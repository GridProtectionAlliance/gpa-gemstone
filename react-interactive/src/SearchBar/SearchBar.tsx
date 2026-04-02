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

interface IProps<T> {
    /**
     * List of available fields to be searched/filtered by
     */
    CollumnList: Search.IField<T>[],
    /**
     * Optional list of current filters, this will act as the source of truth if provided ignoring filters from StorageID.
     */
    Filters?: Search.IFilter<T>[],
    /**
     * Called whenever internal filters change, if Filters props is provided this must update the Filters prop to keep in sync.
     * @param filters current filters
     * @returns
     */
    SetFilter: (filters: Search.IFilter<T>[]) => void,
    /**
     * Optional default column to be used for searching via the input box
     */
    defaultCollumn?: Search.IField<T>,
    /**
     * Optional direction to control where filter popover is placed
     */
    Direction?: 'left' | 'right',
    /**
     * Optional width to be used on the search bar
     */
    Width?: string | number,
    /**
     * Optional label to used for search filter
     */
    Label?: string,
    /**
     * Optional function used to populate enum-type filter options dynamically, will be called when enum filter is being added or edited.
     */
    GetEnum?: EnumSetter<T>,
    /**
     * Optional flag to render a loading icon in quick search input box
     */
    ShowLoading?: boolean,
    /**
     * Optional note to be used under quick search input
     */
    ResultNote?: string,
    /**
     * If provided, component stores and loads filters to/from localStorage using this key
     */
    StorageID?: string
    /**
     * Optional class to apply to outer div
     */
    Class?: string
    /**
     * Optional disabled flag
     */
    Disabled?: boolean,
    /**
     * Optional help message for the filter button
     */
    Help?: string
}

export interface IOptions { Value: string, Label: string }
export type EnumSetter<T> = (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void

export namespace Search {
    export type FieldType = ('string' | 'number' | 'enum' | 'integer' | 'datetime' | 'boolean' | 'date' | 'time' | "query")
    export interface IField<T> { label: string, key: string, type: FieldType, enum?: IOptions[], isPivotField: boolean }
    export type OperatorType = ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
    export interface IFilter<T> { FieldName: string, SearchText: string, Operator: Search.OperatorType, Type: Search.FieldType, IsPivotColumn: boolean }
}

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
        if (filtersEqual(props.Filters, lastPushedFilters.current)) return;
        setInternalFilters(props.Filters);
    }, [props.Filters]);

    // Build the combined filter list (base filters + quick search) and push up
    React.useEffect(() => {
        const combined = buildCombinedFilters(internalFilters, debouncedSearch, memoizedDefaultColumn, useQuickSearch);

        if (filtersEqual(combined, lastPushedFilters.current)) return;

        lastPushedFilters.current = combined;
        props.SetFilter(combined);

        // Persist to localStorage when managing our own filters
        if (props.Filters === undefined && props.StorageID != null) {
            localStorage.setItem(`${props.StorageID}.Filters`, JSON.stringify(internalFilters));
            localStorage.setItem(`${props.StorageID}.Search`, debouncedSearch);
        }
    }, [internalFilters, debouncedSearch, memoizedDefaultColumn, useQuickSearch]);

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

// Order-independent comparison of two filter arrays
function filtersEqual<T>(a: Search.IFilter<T>[], b: Search.IFilter<T>[]): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    const serialize = (f: Search.IFilter<T>) =>
        `${f.FieldName}|${f.Operator}|${f.SearchText}|${f.Type}|${f.IsPivotColumn}`;

    const sortedA = a.map(serialize).sort();
    const sortedB = b.map(serialize).sort();

    return sortedA.every((val, i) => val === sortedB[i]);
}