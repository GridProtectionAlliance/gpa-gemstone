// ******************************************************************************************************
//  GenericSlice.tsx - Gbtc
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
//  11/04/2020 - Billy Ernest
//       Generated original version of source code.
// ******************************************************************************************************

import { createSlice, createAsyncThunk, AsyncThunk, Slice, Draft, ActionCreatorWithPayload, PayloadAction, ActionReducerMapBuilder, SerializedError } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import { Application } from '@gpa-gemstone/application-typings';
import * as $ from 'jquery';
import { Search } from './SearchBar';
import { WritableDraft } from 'immer/dist/types/types-external'

interface U { ID: number|string }

interface IError {
	Message: string,
	Verb: 'POST' | 'DELETE' | 'PATCH' | 'FETCH' | 'SEARCH'
	Time: string
}

export interface IState<T extends U> {
    Status: Application.Types.Status,
    ActiveFetchID: string[],
    SearchStatus: Application.Types.Status,
    ActiveSearchID: string[],
    Error: ( IError | null ),
    Data: T[],
    SortField: keyof T,
    Ascending: boolean,
    ParentID: (number | null | string ),
    SearchResults: T[],
    Filter: Search.IFilter<T>[]
}

export default class GenericSlice<T extends U> {
    Name: string = "";
    APIPath: string = "";
    Slice: ( Slice<IState<T>> );
    Fetch: (AsyncThunk<any, void | number | string, {}>);
    DBAction: (AsyncThunk<any, { verb: 'POST' | 'DELETE' | 'PATCH', record: T }, {}> );
    DBSearch: (AsyncThunk<any, { filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean }, {}> );
    Sort: (AsyncThunk<any, {SortField: keyof T, Ascending: boolean}, {}>);
    Reducer: any;

    private fetchHandle: JQuery.jqXHR<any>|null;
    private searchHandle: JQuery.jqXHR<any>|null;

    /**
     * Creates a new GenericSlice of type T, which can be used to perform basic CRUD operations against
     * a specified web api.
     * @typeParam T - Model of Generic Slice
     * @param {string} name - string defining the name of the slice in the store
     * @param {string} apiPath - string containing relative path to web api
     * @param {keyof T} defaultSort - string showing default sort field
     * @param {boolean} ascending - (optional) default sort direction - defaults to true
     * @returns a new GenericSlice<T>
     */
    constructor(name: string, apiPath: string, defaultSort: keyof T, ascending: boolean = true) {
        this.Name = name;
        this.APIPath = apiPath;

        this.fetchHandle = null;
        this.searchHandle = null;

        const fetch = createAsyncThunk(`${name}/Fetch${name}`, async (parentID:number | void | string, { signal, getState }) => {

            const state = (getState() as any)[name] as IState<T>;
            if (this.fetchHandle != null && this.fetchHandle.abort != null)
                this.fetchHandle.abort('Prev');

            const handle = this.GetRecords(state.Ascending, state.SortField, parentID);
            this.fetchHandle = handle;
            
            signal.addEventListener('abort', () => {
                if (handle.abort !== undefined) handle.abort();
            });

            return await handle;
        });

        const dBAction = createAsyncThunk(`${name}/DBAction${name}`, async (args: {verb: 'POST' | 'DELETE' | 'PATCH', record: T}, { signal }) => {
          const handle = this.Action(args.verb, args.record);

          signal.addEventListener('abort', () => {
              if (handle.abort !== undefined) handle.abort();
          });

          return await handle
        });

        const dBSearch = createAsyncThunk(`${name}/Search${name}`, async (args: { filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean}, { getState, signal }) => {

            let sortfield = args.sortField;
            let asc = args.ascending;

            sortfield = sortfield === undefined ? ((getState() as any)[this.Name] as IState<T>).SortField : sortfield;
            asc = asc === undefined ? (getState() as any)[this.Name].Ascending : asc;

            if (this.searchHandle != null && this.searchHandle.abort != null)
                this.searchHandle.abort('Prev');

            const handle = this.Search(args.filter, asc,sortfield, (getState() as any)[this.Name].ParentID);
            this.searchHandle = handle;

            signal.addEventListener('abort', () => {
                if (handle.abort !== undefined) handle.abort();
            });

            return await handle;
        });

        const dBSort = createAsyncThunk(`${name}/DBSort${name}`, async (args: {SortField: keyof T, Ascending: boolean}, { signal, getState, dispatch }) => {
            const state = (getState() as any)[name] as IState<T>;

            let sortFld = state.SortField;
            let asc = state.Ascending;

            if (state.SortField === args.SortField)
                asc = !args.Ascending;
            else
                sortFld = args.SortField;

            dispatch(dBSearch({filter: state.Filter, sortField: sortFld, ascending: asc}));

            if (this.fetchHandle != null && this.fetchHandle.abort != null)
                this.fetchHandle.abort('Prev');

            const handle = this.GetRecords(asc,sortFld,(state.ParentID != null? state.ParentID : undefined));
            this.fetchHandle = handle;
            
            signal.addEventListener('abort', () => {
                if (handle.abort !== undefined) handle.abort();
            });
  
            
            return await handle
          });
          
        const slice = createSlice({
            name: this.Name,
            initialState: {
                Status: 'unintiated',
                SearchStatus: 'unintiated',
                Error: null,
                Data: [],
                SortField: defaultSort,
                Ascending: ascending,
                ParentID: null,
                SearchResults: [],
				Filter: [],
                ActiveFetchID: [],
                ActiveSearchID: []
            } as IState<T>,
            reducers: {},
            extraReducers: (builder: ActionReducerMapBuilder<IState<T>>) => {
                builder.addCase(fetch.fulfilled, (state: WritableDraft<IState<T>>, action: PayloadAction<T[], string, {requestId: string}, never>) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    state.Status = 'idle';
                    state.Error = null;
                    state.Data = JSON.parse(action.payload.toString()) as Draft<T[]>;
                });
                builder.addCase(fetch.pending, (state: WritableDraft<IState<T>>, action: PayloadAction<undefined, string,  {arg: number | string | void, requestId: string},never>) => {
                    if (state.ParentID !== (action.meta.arg == null? null : action.meta.arg))
                        state.SearchStatus = 'changed';
                    state.ParentID = (action.meta.arg == null? null : action.meta.arg);
                    state.Status = 'loading';
                    state.ActiveFetchID.push(action.meta.requestId);
                });
                builder.addCase(fetch.rejected, (state: WritableDraft<IState<T>>, action: PayloadAction<unknown, string,  {arg: number | string | void, requestId: string},SerializedError>) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveFetchID.length > 0)
                        return;
                    state.Status = 'error';

                    state.Error = {
						Message: (action.error.message == null? '' : action.error.message),
						Verb: 'FETCH',
						Time: new Date().toString()
					}
                });

                builder.addCase(dBAction.pending, (state: WritableDraft<IState<T>>) => {
                    state.Status = 'loading';
                });
                builder.addCase(dBAction.rejected, (state: WritableDraft<IState<T>>, action: PayloadAction<unknown, string,  {arg: {verb: 'POST' | 'DELETE' | 'PATCH', record: T}},SerializedError>) => {
                    state.Status = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: action.meta.arg.verb,
                        Time: new Date().toString()
                    }

                });
                builder.addCase(dBAction.fulfilled, (state: WritableDraft<IState<T>>) => {
                    state.Status = 'changed';
                    state.SearchStatus = 'changed';
                    state.Error = null;
                });

                builder.addCase(dBSearch.pending, (state: WritableDraft<IState<T>>, action: PayloadAction<undefined, string,  {requestId: string},never>) => {
                    state.SearchStatus = 'loading';
                    state.ActiveSearchID.push(action.meta.requestId);
                });
                builder.addCase(dBSearch.rejected, (state: WritableDraft<IState<T>>, action: PayloadAction<unknown, string,   {requestId: string} ,SerializedError> ) => {
                    state.ActiveSearchID = state.ActiveSearchID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveSearchID.length > 0)
                        return;
                    state.SearchStatus = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: 'SEARCH',
                        Time: new Date().toString()
                    }

                });
                builder.addCase(dBSearch.fulfilled, (state: WritableDraft<IState<T>>, action: PayloadAction<string, string,  {arg: { filter:  Search.IFilter<T>[], sortfield?: keyof T, ascending?: boolean}, requestId: string},never>) => {
                    state.ActiveSearchID = state.ActiveSearchID.filter(id => id !== action.meta.requestId);
                    state.SearchStatus = 'idle';
                    state.SearchResults = JSON.parse(action.payload);
                    state.Filter = action.meta.arg.filter;
                });
                builder.addCase(dBSort.pending, (state: WritableDraft<IState<T>>, action: PayloadAction<undefined, string,  {requestId: string},never>) => {
                    state.Status = 'loading';
                    state.ActiveFetchID.push(action.meta.requestId);
                });
                builder.addCase(dBSort.rejected, (state: WritableDraft<IState<T>>, action: PayloadAction<unknown, string,  {requestId: string},SerializedError> ) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveFetchID.length > 0)
                        return;
                    state.Status = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: 'FETCH',
                        Time: new Date().toString()
                    }

                });
                builder.addCase(dBSort.fulfilled, (state: WritableDraft<IState<T>>, action: PayloadAction<T[],string,{arg: {SortField: keyof T, Ascending: boolean}, requestId: string}>) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    state.Status = 'idle';
                    state.Error = null;
                    state.Data = JSON.parse(action.payload.toString()) as Draft<T[]>;

                    if (state.SortField === action.meta.arg.SortField)
                        state.Ascending = !state.Ascending;
                    else
                        state.SortField = action.meta.arg.SortField as Draft<keyof T>;
                });
            }

        });


        this.Fetch = fetch;
        this.DBAction = dBAction;
        this.Slice = slice;
        this.DBSearch = dBSearch;
        this.Sort = dBSort;
        this.Reducer = slice.reducer;
    }



    private GetRecords(ascending: (boolean | undefined), sortField: keyof T, parentID: number | void | string,): JQuery.jqXHR<T[]> {
        return $.ajax({
            type: "GET",
            url: `${this.APIPath}${(parentID != null ? '/' + parentID : '')}/${sortField}/${ascending? '1' : '0'}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: true,
            async: true
        });
    }

    private Action(verb: 'POST' | 'DELETE' | 'PATCH', record: T): JQuery.jqXHR<T> {
        let action = '';
        if (verb === 'POST') action = 'Add';
        else if (verb === 'DELETE') action = 'Delete';
        else if (verb === 'PATCH') action = 'Update';

        return $.ajax({
            type: verb,
            url: `${this.APIPath}/${action}`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ ...record }),
            cache: false,
            async: true
        });
    }

    private Search(filter: Search.IFilter<T>[], ascending: (boolean | undefined), sortField: keyof T, parentID?: number | string): JQuery.jqXHR<string> {
        return $.ajax({
            type: 'POST',
            url: `${this.APIPath}/${parentID != null ? `${parentID}/` : ''}SearchableList`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ Searches: filter, OrderBy: sortField, Ascending: ascending }),
            cache: false,
            async: true
        });
    }


    public Data = (state: any) => state[this.Name].Data as T[];
	public Error = (state: any) => state[this.Name].Error as IError;
    public Datum = (state: any, id: number|string) => (state[this.Name] as IState<T>).Data.find((d: T) => d.ID === id) as T;
    public Status = (state: any) => state[this.Name].Status as Application.Types.Status;
    public SortField = (state: any) => state[this.Name].SortField as keyof T;
    public Ascending = (state: any) => state[this.Name].Ascending as boolean;
    public ParentID = (state: any) => state[this.Name].ParentID as number | string;

    public SearchResults = (state: any) => state[this.Name].SearchResults as T[];
    public SearchStatus = (state: any) => state[this.Name].SearchStatus as Application.Types.Status;
    public SearchFilters = (state: any) => state[this.Name].Filter as Search.IFilter<T>[];
}
