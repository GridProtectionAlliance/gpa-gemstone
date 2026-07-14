// ******************************************************************************************************
//  SearchBar.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  01/06/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Modal from '../Modal';
import LoadingIcon from '../LoadingIcon';
import { Select, ToolTip } from '@gpa-gemstone/react-forms';
import FilterCreator from './FilterCreator';
import FilterRow from './FilterRow';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid, useStringMemonization } from '@gpa-gemstone/helper-functions';

/** Configures searchable fields, active filters, and search actions. */
interface IProps<T> {
    /**
     * Fields available for quick searches and filter creation.
     */
    CollumnList: Search.IField<T>[],
    /**
     * Optional controlled filter list that takes precedence over filters loaded from `StorageID`.
     */
    Filters?: Search.IFilter<T>[],
    /**
     * Callback fired whenever the combined filter list changes.
     * @param filters - Current filters, including any active quick-search filter.
     */
    SetFilter: (filters: Search.IFilter<T>[]) => void,
    /**
     * Optional field searched by the debounced quick-search input.
     */
    defaultCollumn?: Search.IField<T>,
    /**
     * Optional alignment for the filter popover and child content.
     */
    Direction?: 'left' | 'right',
    /**
     * Optional width applied to the search-bar item.
     */
    Width?: string | number,
    /**
     * Optional legend displayed around the search controls.
     */
    Label?: string,
    /**
     * Optional function that loads options when an enum filter is added or edited.
     * @param setOptions - Setter used to provide the loaded enum options.
     * @param field - Field whose enum options should be loaded.
     * @returns Cleanup callback invoked when the effect is replaced or unmounted.
     */
    GetEnum?: EnumSetter<T>,
    /**
     * Optional flag that shows a loading indicator beside the quick-search input, defaulting to false.
     */
    ShowLoading?: boolean,
    /**
     * Optional note displayed beneath the quick-search input.
     */
    ResultNote?: string,
    /**
     * Optional local-storage key used to persist uncontrolled filters and quick-search text.
     */
    StorageID?: string
    /**
     * Optional class applied to the outer container, defaulting to `w-100`.
     */
    Class?: string
    /**
     * Optional flag that disables the quick-search input and filter button, defaulting to false.
     */
    Disabled?: boolean,
    /**
     * Optional help text displayed in a tooltip beside the filter button.
     */
    Help?: string
    /**
     * Optional equality function used to decide whether changed filters should be emitted.
     * @param newFilters - Newly combined filters to compare.
     * @param oldFilters - Filters most recently emitted to the parent.
     * @returns Whether the two filter lists should be treated as equal.
     */
    OverrideFilterEquality?: (newFilters: Search.IFilter<T>[], oldFilters: Search.IFilter<T>[]) => boolean
}

/** Represents an option available to an enumerated search field. */
export interface IOptions {
    /** Value submitted for the option. */
    Value: string,
    /** Label displayed for the option. */
    Label: string
}
/** Loads the options available to an enumerated search field. */
export type EnumSetter<T> = (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void

export namespace Search {
    /** Data types supported by searchable fields. */
    export type FieldType = ('string' | 'number' | 'enum' | 'integer' | 'datetime' | 'boolean' | 'date' | 'time' | "query")
    /** Describes a record field available for searching. */
    export interface IField<T> {
        /** Label displayed for the field. */
        label: string,
        /** Record key searched by the field. */
        key: string,
        /** Data type used to edit and compare the field. */
        type: FieldType,
        /** Optional choices available to an enumerated field. */
        enum?: IOptions[],
        /** Whether the field represents a pivoted column. */
        isPivotField: boolean
    }
    /** Comparison operators supported by search filters. */
    export type OperatorType = ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
    /** Describes one comparison applied by a structured search. */
    export interface IFilter<T> {
        /** Name of the record field being compared. */
        FieldName: string,
        /** User-entered value used by the comparison. */
        SearchText: string,
        /** Comparison operator applied to the field. */
        Operator: Search.OperatorType,
        /** Data type used to interpret the search text. */
        Type: Search.FieldType,
        /** Whether the field represents a pivoted column. */
        IsPivotColumn: boolean
    }
}

/**
 * Renders quick-search and structured-filter controls with optional controlled or persisted state.
 * @param props - Configures searchable fields, filter state, persistence, layout, and option loading.
 * @returns The search controls, active-filter popover, and filter editor modal.
 */
export default function SearchBar<T>(props: React.PropsWithChildren<IProps<T>>) {
    const useQuickSearch = props.defaultCollumn !== undefined;

    const [hover, setHover] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);
    const [isNew, setIsNew] = React.useState<boolean>(false);


    const [internalFilters, setInternalFilters] = React.useState<Search.IFilter<T>[]>(() => {
        if (props.Filters !== undefined) return props.Filters;
        if (props.StorageID != null) return getStoredSearchState<T>(props.StorageID).filters;
        return [];
    });

    const [search, setSearch] = React.useState<string>(() => {
        if (props.Filters !== undefined) return "";
        if (props.StorageID != null) return getStoredSearchState<T>(props.StorageID).search;
        return "";
    });

    // Debounced version of search that the push-up effect watches
    const [debouncedSearch, setDebouncedSearch] = React.useState<string>(search);

    const [draftFilter, setDraftFilter] = React.useState<Search.IFilter<T>>(setDefaultDraftFilter(props.CollumnList[0]));

    const [showHelpTooltip, setShowHelpTooltip] = React.useState<boolean>(false);
    const helpTooltipRef = React.useRef<string>(CreateGuid());

    const memoizedDefaultColumn = useStringMemonization<Search.IField<T> | undefined>(props.defaultCollumn);

    // Tracks the last filters we pushed to the parent so we can guard against unstable SetFilter
    const lastPushedFilters = React.useRef<Search.IFilter<T>[]>([]);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Sync external filters into internal state when parent changes them
    React.useEffect(() => {
        if (props.Filters === undefined) return;
        if (IsSearchBarFiltersEqual(props.Filters, lastPushedFilters.current)) return;
        setInternalFilters(props.Filters);
    }, [props.Filters]);

    // Build the combined filter list (base filters + quick search) and push up
    React.useEffect(() => {
        const combined = buildCombinedFilters(internalFilters, debouncedSearch, memoizedDefaultColumn, useQuickSearch);

        if (props.OverrideFilterEquality != null ? props.OverrideFilterEquality(combined, lastPushedFilters.current) : IsSearchBarFiltersEqual(combined, lastPushedFilters.current)) return;

        lastPushedFilters.current = combined;
        props.SetFilter(combined);

        // Persist to localStorage when managing our own filters
        if (props.Filters === undefined && props.StorageID != null) {
            localStorage.setItem(`${props.StorageID}.Filters`, JSON.stringify(internalFilters));
            localStorage.setItem(`${props.StorageID}.Search`, debouncedSearch);
        }
    }, [internalFilters, debouncedSearch, memoizedDefaultColumn, useQuickSearch, props.OverrideFilterEquality]);

    const deleteFilter = (filterToDelete: Search.IFilter<T>) => {
        setHover(false);
        setInternalFilters(prev => prev.filter(f => f !== filterToDelete));
    };

    const addFilter = () => {
        const adjustedFilter = { ...draftFilter };
        if (adjustedFilter.Type === 'string' && (adjustedFilter.Operator === 'LIKE' || adjustedFilter.Operator === 'NOT LIKE'))
            adjustedFilter.SearchText = '*' + adjustedFilter.SearchText + '*';

        setDraftFilter(setDefaultDraftFilter(props.CollumnList[0]));
        setInternalFilters(prev => [...prev, adjustedFilter]);
    };

    const editFilter = (index: number) => {
        setIsNew(false);
        const filt = { ...internalFilters[index] };

        if (filt.Type === 'string' && (filt.Operator === 'LIKE' || filt.Operator === 'NOT LIKE'))
            filt.SearchText = filt.SearchText.substr(1, filt.SearchText.length - 2);

        setShow(true);
        setDraftFilter(filt);
        setInternalFilters(prev => prev.filter((_, i) => i !== index));
    };

    const createFilter = () => {
        setShow(!show);
        setIsNew(true);
        setDraftFilter(setDefaultDraftFilter(props.CollumnList[0]));
    };

    const editSearch = (text: string) => {
        setSearch(text);
    };

    const content = (
        <form>
            <div className="row">

                {useQuickSearch ?
                    <div className="col">
                        <div className="input-group">
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                placeholder={"Search " + (memoizedDefaultColumn?.label ?? '')}
                                onChange={(event) => editSearch(event.target.value as string)}
                                value={search}
                                disabled={props.Disabled}
                            />

                            {props.ShowLoading !== undefined && props.ShowLoading ?
                                <div className="input-group-append">
                                    <LoadingIcon Show={true} />
                                </div>
                                : null}

                        </div>
                        <p style={{ marginTop: 2, marginBottom: 2 }}>{props.ResultNote}</p>
                    </div> : null}

                <div style={{ position: 'relative', display: 'inline-block' }} className='col align-items-start'>
                    <button
                        disabled={props.Disabled}
                        className={"btn btn-" + (internalFilters.length > 0 ? "warning" : "primary")}
                        onClick={(evt) => { evt.preventDefault(); createFilter(); }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        Add Filter{internalFilters.length > 0 ? ("(" + internalFilters.length + ")") : ""}
                    </button>
                    {props.Help != null ?
                        <button
                            className='btn'
                            onMouseEnter={() => setShowHelpTooltip(true)}
                            onMouseLeave={() => setShowHelpTooltip(false)}
                            data-tooltip={helpTooltipRef.current}
                        >
                            <ReactIcons.QuestionMark
                                Color="var(--info)"
                                Size={20}
                            />
                            <ToolTip Show={showHelpTooltip} Target={helpTooltipRef.current} Class="info">
                                {props.Help}
                            </ToolTip>
                        </button>
                        : null}
                    <div className="popover"
                        style={{
                            display: hover ? 'block' : 'none', maxWidth: 'unset',
                            right: (props.Direction === 'right' ? 0 : 'unset'), left: (props.Direction === 'left' ? 0 : 'unset'),
                            top: 'unset'
                        }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Column</th>
                                    <th>Operator</th>
                                    <th>Search Text</th>
                                    <th>Edit</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internalFilters.map((f, i) => <FilterRow Filter={f} Edit={() => editFilter(i)} Delete={() => deleteFilter(f)} key={i} Collumns={props.CollumnList} />)}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </form>
    )

    return (
        <div className={props.Class ?? 'w-100'}>
            <nav className="navbar navbar-expand">
                <div className='w-100'>
                    <ul className="navbar-nav mr-auto d-flex align-items-center w-100">
                        {props.Direction === 'right' ? props.children : null}
                        {props.Label !== undefined ?
                            <li className="nav-item" style={{ minWidth: (props.Width === undefined ? '150px' : undefined), width: props.Width, paddingRight: 10 }}>
                                <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                                    <legend className="w-auto" style={{ fontSize: 'large' }}>
                                        {props.Label}:
                                    </legend>
                                    {content}
                                </fieldset>
                            </li> :
                            <li className="nav-item" style={{ minWidth: (props.Width === undefined ? '150px' : undefined), width: props.Width, paddingRight: 10 }}>
                                {content}
                            </li>}
                        {props.Direction === 'left' ? props.children : null}
                    </ul>
                </div>
            </nav>

            <Modal Title={'Add Filter'} Show={show} CallBack={(conf: boolean) => { if (conf) addFilter(); setShow(false) }} ConfirmText={isNew ? 'Add' : 'Save'} CancelText={isNew ? 'Close' : 'Delete'}>
                <Select<Search.IFilter<T>>
                    Record={draftFilter}
                    Field='FieldName'
                    Options={props.CollumnList.map(fl => ({ Value: fl.key as string, Label: fl.label }))}
                    Setter={(record) => {
                        let operator = "IN" as any;
                        const column = props.CollumnList.find(fl => fl.key === record.FieldName);

                        if (column !== undefined && column.type === 'string')
                            operator = "LIKE";
                        if (column !== undefined && (column.type === 'number' || column.type === 'integer' || column.type === 'boolean'))
                            operator = '=';
                        if (column !== undefined && column.type === 'datetime')
                            operator = '>';

                        setDraftFilter((prevFilter) => ({ ...prevFilter, FieldName: record.FieldName, SearchText: '', Operator: operator, Type: (column !== undefined ? column.type : 'string'), IsPivotColumn: (column !== undefined ? column.isPivotField : true) }))
                    }}
                    Label='Column'
                />

                <FilterCreator
                    Filter={draftFilter}
                    Field={props.CollumnList.find(fl => fl.key === draftFilter.FieldName)}
                    Setter={(record) => setDraftFilter(record)}
                    Enum={(props.GetEnum === undefined ? undefined : props.GetEnum)}
                />
            </Modal>
        </div>
    );
}

// Returns all stored filters including the quick search filter if one exists
export const GetStoredFilters = <T,>(storageID: string, defaultCol?: Search.IField<T>): Search.IFilter<T>[] => {
    const { filters, search } = getStoredSearchState<T>(storageID);
    if (defaultCol == null || search.length === 0) return filters;

    const quick: Search.IFilter<T> = {
        FieldName: defaultCol.key,
        Operator: 'LIKE',
        Type: defaultCol.type,
        SearchText: `*${search}*`,
        IsPivotColumn: defaultCol.isPivotField
    };

    return [...filters, quick];
}

// Reads both filters and search text from localStorage in one pass
function getStoredSearchState<T>(storageID: string): { filters: Search.IFilter<T>[], search: string } {
    let filters: Search.IFilter<T>[] = [];
    try {
        filters = JSON.parse(localStorage.getItem(`${storageID}.Filters`) as string) ?? [];
    } catch {
        filters = [];
    }
    const search = localStorage.getItem(`${storageID}.Search`) ?? "";
    return { filters, search };
}

const setDefaultDraftFilter = <T,>(filter: Search.IField<T>) => {
    const draftFilter: Search.IFilter<T> = {
        FieldName: filter.key,
        SearchText: '',
        Operator: filter.type === 'string' ? 'LIKE' : '=',
        Type: filter.type,
        IsPivotColumn: filter.isPivotField
    }

    return draftFilter;
}

// Appends a quick search filter to the base filters when quick search is active
function buildCombinedFilters<T>(
    baseFilters: Search.IFilter<T>[],
    searchText: string,
    defaultCol: Search.IField<T> | null | undefined,
    quickSearchEnabled: boolean
): Search.IFilter<T>[] {
    if (!quickSearchEnabled || defaultCol == null || searchText.length === 0)
        return baseFilters;

    const quick: Search.IFilter<T> = {
        FieldName: defaultCol.key,
        Operator: 'LIKE',
        Type: defaultCol.type,
        SearchText: `*${searchText}*`,
        IsPivotColumn: defaultCol.isPivotField
    };

    return [...baseFilters, quick];
}

/**
 * Order independent equality check for arrays of filters.
 * @param a The first array of filters to check.
 * @param b The second array of filters to check.
 * @returns true if filters are the same, false if not
 */
export function IsSearchBarFiltersEqual<T>(a: Search.IFilter<T>[], b: Search.IFilter<T>[]): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    const serialize = (f: Search.IFilter<T>) =>
        `${f.FieldName}|${f.Operator}|${f.SearchText}|${f.Type}|${f.IsPivotColumn}`;

    const sortedA = a.map(serialize).sort();
    const sortedB = b.map(serialize).sort();

    return sortedA.every((val, i) => val === sortedB[i]);
}