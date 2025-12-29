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
import _ from 'lodash';
import FilterCreator from './FilterCreator';
import FilterRow from './FilterRow';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

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
    const hasExternalFilters = props.Filters !== undefined;
    const useQuickSearch = props.defaultCollumn !== undefined;

    const [hover, setHover] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);

    const [isNew, setIsNew] = React.useState<boolean>(false);

    const [internalFilters, setInternalFilters] = React.useState<Search.IFilter<T>[]>([]);

    const [search, setSearch] = React.useState<string>("");
    const [searchFilter, setSearchFilter] = React.useState<Search.IFilter<T> | null>(null);
    const [draftFilter, setDraftFilter] = React.useState<Search.IFilter<T>>(setDefaultDraftFilter(props.CollumnList[0]));

    const [showHelpTooltip, setShowHelpTooltip] = React.useState<boolean>(false);
    const helpTooltipRef = React.useRef<string>(CreateGuid())

    const activeFilters = React.useMemo(() => hasExternalFilters ? (props.Filters ?? []) : internalFilters, [hasExternalFilters, props.Filters, internalFilters]);

    // Memoized default column to prevent unneccessary re-renders
    const stringifiedDefaultColumn = React.useMemo(() => props.defaultCollumn != null ? JSON.stringify(props.defaultCollumn) : null, [props.defaultCollumn]);
    const memoizedDefaultColumn = React.useMemo(() => stringifiedDefaultColumn != null ? JSON.parse(stringifiedDefaultColumn) as Search.IField<T> : undefined, [stringifiedDefaultColumn]);

    // Memoized function to apply quick search with debounce and push filters up
    const applyQuickSearch = React.useMemo(() => {
        return _.debounce((text: string, baseFilters: Search.IFilter<T>[]) => {
            if (!useQuickSearch || memoizedDefaultColumn == null) {
                props.SetFilter(baseFilters);
                return;
            }

            if (text.length === 0) {
                setSearchFilter(null);
                props.SetFilter(baseFilters);
                return;
            }

            const quick: Search.IFilter<T> = {
                FieldName: memoizedDefaultColumn.key,
                Operator: 'LIKE',
                Type: memoizedDefaultColumn.type,
                SearchText: `*${text}*`,
                IsPivotColumn: memoizedDefaultColumn.isPivotField
            };

            setSearchFilter(quick);
            props.SetFilter([...baseFilters, quick]);
        }, 500);
    }, [props.SetFilter, memoizedDefaultColumn, useQuickSearch]);

    // Cleanup debounce on unmount
    React.useEffect(() => {
        return () => applyQuickSearch.cancel();
    }, [applyQuickSearch]);

    // Handling filter initialization from props or localStorage
    React.useEffect(() => {
        if (props.StorageID == null || hasExternalFilters)
            return;

        // Get Button Filters
        const storedFilters = JSON.parse(localStorage.getItem(`${props.StorageID}.Filters`) as string) ?? [];
        setInternalFilters(storedFilters);

        // Get Bar Search
        const storedSearch = localStorage.getItem(`${props.StorageID}.Search`) ?? "";
        setSearch(storedSearch);

        applyQuickSearch.cancel();
        applyQuickSearch(storedSearch, storedFilters);
        applyQuickSearch.flush(); //Ensure immediate execution on load
    }, [props.StorageID, hasExternalFilters, applyQuickSearch]);

    //Effect tp store active filters if StorageID is provided
    React.useEffect(() => {
        if (props.StorageID == null || hasExternalFilters)
            return;

        localStorage.setItem(`${props.StorageID}.Filters`, JSON.stringify(activeFilters));
    }, [activeFilters, hasExternalFilters]);

    //Effect to store search string if StorageID is provided
    React.useEffect(() => {
        if (props.StorageID == null || hasExternalFilters)
            return;

        localStorage.setItem(`${props.StorageID}.Search`, search);
    }, [search, hasExternalFilters]);

    //Callback to push up filters
    // if newSearchFilter is provided and not undefined, it will be used instead of the internal searchFilter
    const pushFilters = React.useCallback((newFilters: Search.IFilter<T>[], newSearchFilter: Search.IFilter<T> | null | undefined) => {
        const filtersToPush = [...newFilters];

        //Only add newSearchFilter if quick search is being used and searchFilter is defined
        if (newSearchFilter !== undefined) {
            if (useQuickSearch && newSearchFilter != null)
                props.SetFilter([...filtersToPush, newSearchFilter]);
            else
                props.SetFilter(filtersToPush);
            return;
        }

        if (useQuickSearch && searchFilter != null)
            filtersToPush.push(searchFilter);

        props.SetFilter(filtersToPush);
    }, [searchFilter, props.SetFilter, useQuickSearch]);

    function deleteFilter(filterToDelete: Search.IFilter<T>) {
        const updatedFilters = activeFilters.filter(f => f !== filterToDelete);

        setHover(false);
        if (!hasExternalFilters)
            setInternalFilters(updatedFilters);

        if (useQuickSearch)
            applyQuickSearch(search, updatedFilters);
        else
            pushFilters(updatedFilters, undefined);
    }

    function addFilter() {
        const oldFilters = [...activeFilters];
        const adjustedFilter = { ...draftFilter };
        if (adjustedFilter.Type === 'string' && (adjustedFilter.Operator === 'LIKE' || adjustedFilter.Operator === 'NOT LIKE'))
            adjustedFilter.SearchText = '*' + adjustedFilter.SearchText + '*';
        oldFilters.push(adjustedFilter);

        setDraftFilter(setDefaultDraftFilter(props.CollumnList[0]));

        if (!hasExternalFilters)
            setInternalFilters(oldFilters);

        if (useQuickSearch)
            applyQuickSearch(search, oldFilters);
        else
            pushFilters(oldFilters, undefined);
    }

    function editFilter(index: number) {
        setIsNew(false);
        const oldFilters = [...activeFilters];
        const filt = { ...oldFilters[index] };
        oldFilters.splice(index, 1);

        if (filt.Type === 'string' && (filt.Operator === 'LIKE' || filt.Operator === 'NOT LIKE'))
            filt.SearchText = filt.SearchText.substr(1, filt.SearchText.length - 2);

        setShow(true);
        setDraftFilter(filt);

        if (!hasExternalFilters)
            setInternalFilters(oldFilters);

        if (useQuickSearch)
            applyQuickSearch(search, oldFilters);
        else
            pushFilters(oldFilters, undefined);
    }

    function createFilter() {
        setShow(!show);
        setIsNew(true);
        setDraftFilter(setDefaultDraftFilter(props.CollumnList[0]));
    }

    const editSearch = (text: string) => {
        setSearch(text);
        applyQuickSearch(text, activeFilters);
    }

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
                        className={"btn btn-" + (activeFilters.length > 0 ? "warning" : "primary")}
                        onClick={(evt) => { evt.preventDefault(); createFilter(); }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        Add Filter{activeFilters.length > 0 ? ("(" + activeFilters.length + ")") : ""}
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
                                {activeFilters.map((f, i) => <FilterRow Filter={f} Edit={() => editFilter(i)} Delete={() => deleteFilter(f)} key={i} Collumns={props.CollumnList} />)}
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

export const GetStoredFilters = (storageID: string) => {
    const storedFilters = JSON.parse(localStorage.getItem(`${storageID}.Filters`) as string) ?? [];
    const storedSearch = localStorage.getItem(`${storageID}.Search`) ?? "";

    return [...storedFilters, storedSearch]
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