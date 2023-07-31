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

import { createSlice, createAsyncThunk, AsyncThunk, Slice, Draft, PayloadAction, ActionReducerMapBuilder, SerializedError } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import { Application } from '@gpa-gemstone/application-typings';
import * as $ from 'jquery';
import { Search } from './SearchBar';
import { WritableDraft } from 'immer/dist/types/types-external'

interface IOptions<T extends U> {
    ActionDependencies? : (state: IState<T>, action: string , arg: any) => void,
    ActionPendingDependencies? : (state: IState<T>, action: string , arg: any, requestID: string) => void,
    ActionErrorDependencies? : (state: IState<T>, action: string , arg: any, requestID: string) => void,
    ActionFullfilledDependencies? : (state: IState<T>, action: string , arg: any, requestID: string) => void,
    AddionalThunks?: IAdditionalThunk<T>[]
}

interface IAdditionalThunk<T extends U> {
    Name: string,
    Fetch: (state: IState<T>, args: any|void) => null|JQuery.jqXHR<any>,
    OnSuccess?: (state: WritableDraft<IState<T>>, requestId: string, data: any, args: any|void) => void,
    OnFailure?: (state: WritableDraft<IState<T>>, requestId: string, args: any|void, error: any) => void,
    OnPending?: (state: WritableDraft<IState<T>>, requestId: string, args: any|void) => void
}


interface U { ID: number|string }

interface IError {
	Message: string,
	Verb: 'POST' | 'DELETE' | 'PATCH' | 'FETCH' | 'SEARCH' | 'PAGE'
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

interface IPagedState< T extends U> extends IState<T> {
    PagedStatus: Application.Types.Status,
    ActivePagedID: string[],
    CurrentPage: number
    TotalPages: number
    PagedData: T[],
    PagedSortField: keyof T,
    PagedAscending: boolean,
    PagedFilter:  Search.IFilter<T>[]
}

export default class GenericSlice<T extends U> {
    Name = "";
    APIPath = "";
    Slice: ( Slice<IPagedState<T>> );
    Fetch: (AsyncThunk<any, void | number | string, {}>);
    SetChanged: (AsyncThunk<any, void, {}>);
    DBAction: (AsyncThunk<any, { verb: 'POST' | 'DELETE' | 'PATCH', record: T }, {}> );
    DBSearch: (AsyncThunk<any, { filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean }, {}> );
    PagedSearch: (AsyncThunk<any, { filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean, page?: number }, {}> );
    Sort: (AsyncThunk<any, {SortField: keyof T, Ascending: boolean}, {}>);
    AdditionalThunk: {[key: string]: AsyncThunk<any, any, {}>};
    Reducer: any;

    private fetchHandle: JQuery.jqXHR<any>|null;
    private searchHandle: JQuery.jqXHR<any>|null;
    private pageHandle: JQuery.jqXHR<any>|null;

    private actionDependency: ((state: IPagedState<T>, action: string, arg: any) => void)| null;

    private actionFullfilledDependency: ((state: IPagedState<T>, action: string , arg: any, requestID: string) => void)| null;
    private actionPendingDependency: ((state: IPagedState<T>, action: string , arg: any, requestID: string)=> void)| null;
    private actionErrorDependency: ((state: IPagedState<T>, action: string , arg: any, requestID: string) => void)| null;

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
    constructor(name: string, apiPath: string, defaultSort: keyof T, ascending = true, options: IOptions<T>|null = null) {
        this.Name = name;
        this.APIPath = apiPath;

        this.fetchHandle = null;
        this.searchHandle = null;
        this.pageHandle = null;
        this.actionDependency = null;

        this.actionPendingDependency = null;
        this.actionFullfilledDependency = null;
        this.actionErrorDependency = null;

        if (options !== null && options.ActionDependencies !== undefined)
            this.actionDependency = options.ActionDependencies;

        if (options !== null && options.ActionPendingDependencies !== undefined)
            this.actionPendingDependency = options.ActionPendingDependencies;

        if (options !== null && options.ActionFullfilledDependencies !== undefined)
            this.actionFullfilledDependency = options.ActionFullfilledDependencies;

        if (options !== null && options.ActionErrorDependencies !== undefined)
            this.actionErrorDependency = options.ActionErrorDependencies;


        const additionalThunks: {[key: string]: any} = {};
        let additionalBuilder: (builder: ActionReducerMapBuilder<IPagedState<T>>) => void = () => { _.noop(); };

        if (options !== null && options.AddionalThunks !== undefined) {

            options.AddionalThunks.forEach((thunk) => {
                additionalThunks[thunk.Name] = createAsyncThunk(`${name}/${thunk.Name}`, async (arg: any|void, { getState }) => {
                    const state = (getState() as any)[name] as IPagedState<T>;
                    if (this.actionDependency !== null)
                        this.actionDependency(state,`${name}/${thunk.Name}`, arg)

                    const handle = thunk.Fetch(state,arg);
                    if (handle != null)
                        return await handle;
                    return;
                });
            });

            additionalBuilder = (builder) => {
                 options.AddionalThunks?.forEach((thunk) => {
                        builder.addCase(fetch.fulfilled, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<any, string, {requestId: string, arg: any|void }, never>) => {
                            if (thunk.OnSuccess !== undefined)
                                thunk.OnSuccess(state,action.meta.requestId,action.payload,action.meta.arg);
                            if (this.actionFullfilledDependency !== null)
                                this.actionFullfilledDependency(state as IPagedState<T>,`${name}/${thunk.Name}`, action.meta.arg, action.meta.requestId)
                        });                    
                        builder.addCase(fetch.pending, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<undefined, string,  {arg: any | void, requestId: string},never>) => {
                            if (thunk.OnPending !== undefined)
                                thunk.OnPending(state,action.meta.requestId,action.meta.arg);
                            if (this.actionPendingDependency !== null)
                                this.actionPendingDependency(state as IPagedState<T>,`${name}/${thunk.Name}`, action.meta.arg, action.meta.requestId)
                        });
                        builder.addCase(fetch.rejected, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<unknown, string,  {arg: number | string | void, requestId: string},SerializedError>) => {
                            if (thunk.OnFailure !== undefined)
                                thunk.OnFailure(state,action.meta.requestId,action.payload,action.meta.arg);
                            if (this.actionErrorDependency !== null)
                                this.actionErrorDependency(state as IPagedState<T>,`${name}/${thunk.Name}`, action.meta.arg, action.meta.requestId)
                        });
                });
            }
        }

        const fetch = createAsyncThunk(`${name}/Fetch${name}`, async (parentID:number | void | string, { signal, getState }) => {
            
            const state = (getState() as any)[name] as IPagedState<T>;

            if (this.actionDependency !== null)
                this.actionDependency(state,`${name}/Fetch${name}`, parentID)

            if (this.fetchHandle != null && this.fetchHandle.abort != null)
                this.fetchHandle.abort('Prev');

            const handle = this.GetRecords(state.Ascending, state.SortField, parentID);
            this.fetchHandle = handle;
            
            signal.addEventListener('abort', () => {
                if (handle.abort !== undefined) handle.abort();
            });

            return await handle;
        });

        const dBAction = createAsyncThunk(`${name}/DBAction${name}`, async (args: {verb: 'POST' | 'DELETE' | 'PATCH', record: T}, { signal, getState }) => {
          const handle = this.Action(args.verb, args.record);

          const state = (getState() as any)[name] as IPagedState<T>;
          if (this.actionDependency !== null)
            this.actionDependency(state,`${name}/DBAction${name}`, args)

          signal.addEventListener('abort', () => {
              if (handle.abort !== undefined) handle.abort();
          });

          return await handle
        });

        const dBSearch = createAsyncThunk(`${name}/Search${name}`, async (args: { filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean}, { getState, signal }) => {

            const state = (getState() as any)[name] as IPagedState<T>;
            if (this.actionDependency !== null)
                this.actionDependency(state,`${name}/Search${name}`, args)

            let sortfield = args.sortField;
            let asc = args.ascending;

            sortfield = sortfield === undefined ? state.SortField : sortfield;
            asc = asc === undefined ? state.Ascending : asc;

            if (this.searchHandle != null && this.searchHandle.abort != null)
                this.searchHandle.abort('Prev');

            const handle = this.Search(args.filter, asc,sortfield, state.ParentID);
            this.searchHandle = handle;

            signal.addEventListener('abort', () => {
                if (handle.abort !== undefined) handle.abort();
            });

            return await handle;
        });

        const dBSort = createAsyncThunk(`${name}/DBSort${name}`, async (args: {SortField: keyof T, Ascending: boolean}, { signal, getState, dispatch }) => {
            const state = (getState() as any)[name] as IPagedState<T>;

            if (this.actionDependency !== null)
                this.actionDependency(state,`${name}/DBSort${name}`, args)

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

        const dBPage = createAsyncThunk(`${name}/Page${name}`, async (args: { filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean, page?: number}, { getState, signal }) => {

            const state = (getState() as any)[name] as IPagedState<T>;
            if (this.actionDependency !== null)
                this.actionDependency(state,`${name}/Page${name}`, args)

            let sortfield = args.sortField;
            let asc = args.ascending;
            const page = args.page ?? 0;

            sortfield = sortfield === undefined ? state.PagedSortField : sortfield;
            asc = asc === undefined ? state.PagedAscending : asc;

            if (this.pageHandle != null && this.pageHandle.abort != null)
                this.pageHandle.abort('Prev');

            const handle = this.FetchPage(args.filter, asc,sortfield, page, state.ParentID);
            this.pageHandle = handle;

            signal.addEventListener('abort', () => {
                if (handle.abort !== undefined) handle.abort();
            });

            return await handle;
        });

        const setChanged = createAsyncThunk(`${name}/SetChanged${name}`, async (args: void, {}) => { return; });
          
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
                ActiveSearchID: [],
                PagedStatus: 'unintiated',
                ActivePagedID: [],
                CurrentPage: 0,
                TotalPages: 0,
                PagedData: [],
                PagedSortField: defaultSort,
                PagedAscending: ascending,
                PagedFilter:  []
            } as IPagedState<T>,
            reducers: {},
            extraReducers: (builder: ActionReducerMapBuilder<IPagedState<T>>) => {
                builder.addCase(fetch.fulfilled, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<T[], string, {requestId: string, arg: number | string | void }, never>) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    state.Status = 'idle';
                    state.Error = null;
                    state.Data = JSON.parse(action.payload.toString()) as Draft<T[]>;
                    if (this.actionFullfilledDependency !== null)
                        this.actionFullfilledDependency(state as IPagedState<T>,`${name}/Fetch${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(fetch.pending, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<undefined, string,  {arg: number | string | void, requestId: string},never>) => {
                    if (state.ParentID !== (action.meta.arg == null? null : action.meta.arg))
                        state.SearchStatus = 'changed';
                    state.ParentID = (action.meta.arg == null? null : action.meta.arg);
                    state.Status = 'loading';
                    state.ActiveFetchID.push(action.meta.requestId);
                    if (this.actionPendingDependency !== null)
                        this.actionPendingDependency(state as IPagedState<T>,`${name}/Fetch${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(fetch.rejected, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<unknown, string,  {arg: number | string | void, requestId: string},SerializedError>) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveFetchID.length > 0)
                        return;
                    state.Status = 'error';

                    state.Error = {
						Message: (action.error.message == null? '' : action.error.message),
						Verb: 'FETCH',
						Time: new Date().toString()
					}
                    if (this.actionErrorDependency !== null)
                        this.actionErrorDependency(state as IPagedState<T>,`${name}/Fetch${name}`, action.meta.arg, action.meta.requestId)
                });

                builder.addCase(dBAction.pending, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<undefined, string, {requestId: string, arg: {verb: 'POST' | 'DELETE' | 'PATCH', record: T} }, never>) => {
                    state.Status = 'loading';
                    if (this.actionPendingDependency !== null)
                        this.actionPendingDependency(state as IPagedState<T>,`${name}/DBAction${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBAction.rejected, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<unknown, string,  {arg: {verb: 'POST' | 'DELETE' | 'PATCH', record: T},requestId: string},SerializedError>) => {
                    state.Status = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: action.meta.arg.verb,
                        Time: new Date().toString()
                    }
                    if (this.actionErrorDependency !== null)
                        this.actionErrorDependency(state as IPagedState<T>,`${name}/DBAction${name}`, action.meta.arg, action.meta.requestId)

                });
                builder.addCase(dBAction.fulfilled, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<T, string, {requestId: string, arg: {verb: 'POST' | 'DELETE' | 'PATCH', record: T} }, never>) => {
                    state.Status = 'changed';
                    state.SearchStatus = 'changed';
                    state.Error = null;
                    if (this.actionFullfilledDependency !== null)
                        this.actionFullfilledDependency(state as IPagedState<T>,`${name}/DBAction${name}`, action.meta.arg, action.meta.requestId)
                });

                builder.addCase(dBSearch.pending, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<undefined, string,  {requestId: string, arg: { filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean}},never>) => {
                    state.SearchStatus = 'loading';
                    state.ActiveSearchID.push(action.meta.requestId);
                    if (this.actionPendingDependency !== null)
                        this.actionPendingDependency(state as IPagedState<T>,`${name}/Search${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBSearch.rejected, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<unknown, string,   {requestId: string, arg: { filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean}} ,SerializedError> ) => {
                    state.ActiveSearchID = state.ActiveSearchID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveSearchID.length > 0)
                        return;
                    state.SearchStatus = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: 'SEARCH',
                        Time: new Date().toString()
                    }
                    if (this.actionErrorDependency !== null)
                        this.actionErrorDependency(state as IPagedState<T>,`${name}/Search${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBSearch.fulfilled, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<string, string,  {arg: { filter:  Search.IFilter<T>[], sortfield?: keyof T, ascending?: boolean}, requestId: string},never>) => {
                    state.ActiveSearchID = state.ActiveSearchID.filter(id => id !== action.meta.requestId);
                    state.SearchStatus = 'idle';
                    state.SearchResults = JSON.parse(action.payload);
                    state.Filter = action.meta.arg.filter;
                    if (this.actionFullfilledDependency !== null)
                        this.actionFullfilledDependency(state as IPagedState<T>,`${name}/Search${name}`, action.meta.arg, action.meta.requestId)
                });

                builder.addCase(dBPage.pending, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<undefined, string,  {requestId: string, arg: { page?: number, filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean}},never>) => {
                    state.PagedStatus = 'loading';
                    state.ActivePagedID.push(action.meta.requestId);
                    if (this.actionPendingDependency !== null)
                        this.actionPendingDependency(state as IPagedState<T>,`${name}/Page${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBPage.rejected, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<unknown, string,   {requestId: string, arg: { page?: number, filter:  Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean}} ,SerializedError> ) => {
                    state.ActivePagedID = state.ActivePagedID.filter(id => id !== action.meta.requestId);
                    if (state.ActivePagedID.length > 0)
                        return;
                    state.PagedStatus = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: 'PAGE',
                        Time: new Date().toString()
                    }
                    if (this.actionErrorDependency !== null)
                        this.actionErrorDependency(state as IPagedState<T>,`${name}/Page${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBPage.fulfilled, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<any, string,  {arg: { page?: number, filter:  Search.IFilter<T>[], sortfield?: keyof T, ascending?: boolean}, requestId: string},never>) => {
                    state.ActivePagedID = state.ActivePagedID.filter(id => id !== action.meta.requestId);
                    state.PagedStatus = 'idle';
                    state.TotalPages = action.payload.NumberOfPages
                    state.SearchResults = JSON.parse(action.payload.Data);
                    state.Filter = action.meta.arg.filter;
                    if (this.actionFullfilledDependency !== null)
                        this.actionFullfilledDependency(state as IPagedState<T>,`${name}/Page${name}`, action.meta.arg, action.meta.requestId)
                });

                builder.addCase(dBSort.pending, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<undefined, string,  {requestId: string, arg: {SortField: keyof T, Ascending: boolean} },never>) => {
                    state.Status = 'loading';
                    state.ActiveFetchID.push(action.meta.requestId);
                    if (this.actionPendingDependency !== null)
                        this.actionPendingDependency(state as IPagedState<T>,`${name}/DBSort${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBSort.rejected, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<unknown, string,  {requestId: string, arg: {SortField: keyof T, Ascending: boolean}},SerializedError> ) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveFetchID.length > 0)
                        return;
                    state.Status = 'error';
                    state.Error = {
                        Message: (action.error.message == null? '' : action.error.message),
                        Verb: 'FETCH',
                        Time: new Date().toString()
                    }
                    if (this.actionErrorDependency !== null)
                        this.actionErrorDependency(state as IPagedState<T>,`${name}/DBSort${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(dBSort.fulfilled, (state: WritableDraft<IPagedState<T>>, action: PayloadAction<T[],string,{arg: {SortField: keyof T, Ascending: boolean}, requestId: string}>) => {
                    state.ActiveFetchID = state.ActiveFetchID.filter(id => id !== action.meta.requestId);
                    state.Status = 'idle';
                    state.Error = null;
                    state.Data = JSON.parse(action.payload.toString()) as Draft<T[]>;

                    if (state.SortField === action.meta.arg.SortField)
                        state.Ascending = !state.Ascending;
                    else
                        state.SortField = action.meta.arg.SortField as Draft<keyof T>;
                    
                    if (this.actionFullfilledDependency !== null)
                        this.actionFullfilledDependency(state as IPagedState<T>,`${name}/DBSort${name}`, action.meta.arg, action.meta.requestId)
                });
                builder.addCase(setChanged.pending,(state: WritableDraft<IPagedState<T>>) => {
                    state.Status = 'changed';
                    state.SearchStatus = 'changed';
                } )

                additionalBuilder(builder);
            }

        });

        this.AdditionalThunk = additionalThunks;
        this.Fetch = fetch;
        this.DBAction = dBAction;
        this.Slice = slice;
        this.DBSearch = dBSearch;
        this.PagedSearch = dBPage;
        this.Sort = dBSort;
        this.Reducer = slice.reducer;
        this.SetChanged = setChanged;
    }

    private GetRecords(ascending: (boolean | undefined), sortField: keyof T, parentID: number | void | string,): JQuery.jqXHR<T[]> {
        return $.ajax({
            type: "GET",
            url: `${this.APIPath}${(parentID != null ? '/' + parentID : '')}/${sortField.toString()}/${ascending? '1' : '0'}`,
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

    private Search(filter: Search.IFilter<T>[], ascending: (boolean | undefined), sortField: keyof T, parentID?: number | string | null): JQuery.jqXHR<string> {
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

    private FetchPage(filter: Search.IFilter<T>[], ascending: (boolean | undefined), sortField: keyof T, page: number, parentID?: number | string | null): JQuery.jqXHR<string> {
        return $.ajax({
            type: 'POST',
            url: `${this.APIPath}/${parentID != null ? `${parentID}/` : ''}PagedList/${page}`,
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

    public PagedResults = (state: any) => state[this.Name].PagedData as T[];
    public PagedStatus = (state: any) => state[this.Name].PagedStatus as Application.Types.Status;
    public PagedFilters = (state: any) => state[this.Name].PagedFilter as Search.IFilter<T>[];
    public PagedSortField = (state: any) => state[this.Name].PagedSortField as keyof T;
    public PagedAscending = (state: any) => state[this.Name].PagedAscending as boolean;
    public CurrentPage = (state: any) => state[this.Name].CurrentPage as number;
    public TotalPages = (state: any) => state[this.Name].TotalPages as number;
}
