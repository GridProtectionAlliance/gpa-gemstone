// ******************************************************************************************************
//  ReadOnlyGenericSlice.tsx - Gbtc
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
//  08/12/2024 - Preston Crawford
//       Generated original version of source code.
// ******************************************************************************************************

import { createSlice, createAsyncThunk, AsyncThunk, Slice, PayloadAction, ActionReducerMapBuilder, SerializedError, Reducer } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import { ReadOnlyControllerFunctions } from '../ControllerFunctions';
import { Draft } from 'immer';
import { Application } from '@gpa-gemstone/application-typings';
import { Gemstone } from '../Gemstone';

type ThunkState<T> = Record<string, IState<T>>;

export interface IError {
    Message: string,
    Action: 'FETCH' | 'UPDATE' | 'ADD' | 'DELETE'
    Time: string
}

export interface IState<T> {
    FetchStatus: Application.Types.Status,
    Data: T[],

    SortField: keyof T,
    Ascending: boolean,
    Filter: Gemstone.Types.ISearchFilter<T>[],
    PageInfo: Gemstone.Types.IPageInfo,

    ParentID: string | number | null,

    ActiveID: string[],
    Error: (IError | null),
}

export interface IFetchThunkArg<T> {
    sortField?: keyof T,
    ascending?: boolean,
    parentID?: string | number,
    filter?: Gemstone.Types.ISearchFilter<T>[]
}

export interface IReadOnlyThunkReturn<T> {
    Data: T[],
}

/**
 * A generic class providing functionalities related to a slice of data.
 */
export default class ReadOnlyGenericSlice<T> {
    protected Name: string;

    protected Slice!: Slice<any>;
    public Fetch: AsyncThunk<IReadOnlyThunkReturn<T>, IFetchThunkArg<T>, {}>;
    public SetStatusToChanged: AsyncThunk<void, void, {}>;
    public Reducer!: Reducer<IState<T>>;

    private fetchHandle: JQuery.jqXHR<T[]> | null;
    protected controller: ReadOnlyControllerFunctions<T>;

    constructor(name: string, defaultSortField: keyof T, ascending: boolean, apiPath: string);
    constructor(name: string, defaultSortField: keyof T, ascending: boolean, readonlyController: ReadOnlyControllerFunctions<T>);

    constructor(name: string, defaultSortField: keyof T, ascending: boolean, apiPathOrReadOnlyController: string | ReadOnlyControllerFunctions<T>) {
        this.Name = name;
        this.fetchHandle = null;

        if (typeof apiPathOrReadOnlyController === 'string')
            this.controller = new ReadOnlyControllerFunctions<T>(apiPathOrReadOnlyController);
        else
            this.controller = apiPathOrReadOnlyController;

        this.Fetch = createAsyncThunk<IReadOnlyThunkReturn<T>, IFetchThunkArg<T> | undefined, { state: ThunkState<T> }>(`${this.Name}/Fetch${this.Name}`, async (arg: IFetchThunkArg<T> | undefined = undefined, { signal, getState }) => {
            const stateMap = getState();
            const state = stateMap[this.Name];

            if (this.fetchHandle != null && this.fetchHandle.abort != null)
                this.fetchHandle.abort('Prev');

            let fetchHandle: JQuery.jqXHR<T[]>;

            const sortField = arg?.sortField ?? state.SortField;
            const ascending = arg?.ascending ?? state.Ascending;
            const filter = arg?.filter ?? state.Filter;
            const parentID = arg?.parentID ?? state.ParentID ?? undefined;

            if (arg?.filter == null)
                fetchHandle = this.controller.GetPage(0, sortField, ascending, parentID);
            else
                fetchHandle = this.controller.SearchPage(0, sortField, ascending, filter, parentID);

            this.fetchHandle = fetchHandle;

            const paginationHandle = this.controller.GetPageInfo();

            signal.addEventListener('abort', () => {
                if (fetchHandle.abort !== undefined) fetchHandle.abort();
                if (paginationHandle.abort !== undefined) paginationHandle.abort();
            });

            return Promise.all([fetchHandle]).then((responses) => ({ Data: responses[0] }));
        }) as AsyncThunk<IReadOnlyThunkReturn<T>, IFetchThunkArg<T>, {}>;

        this.SetStatusToChanged = createAsyncThunk(`${this.Name}/SetChanged${this.Name}`, async () => { return; });

        this.initializeSlice(defaultSortField, ascending);
    }

    protected initializeSlice(defaultSortField: keyof T, ascending = true) {
        const initialState: IState<T> = {
            FetchStatus: 'uninitiated',
            Error: null,
            Data: [],
            SortField: defaultSortField,
            Ascending: ascending,
            Filter: [],
            ActiveID: [],
            PageInfo: {
                PageCount: 0,
                TotalCount: 0,
                PageSize: 0
            },
            ParentID: null
        }

        this.Slice = createSlice({
            name: this.Name,
            initialState,
            reducers: {},
            extraReducers: (builder: ActionReducerMapBuilder<IState<T>>) => {
                builder.addCase(this.Fetch.pending, (state: Draft<IState<T>>, action: PayloadAction<undefined, string, { requestId: string, arg: IFetchThunkArg<T> }, never>) => {
                    state.FetchStatus = 'loading';
                    state.ActiveID.push(action.meta.requestId);
                });
                builder.addCase(this.Fetch.rejected, (state: Draft<IState<T>>, action: PayloadAction<unknown, string, { requestId: string, arg: IFetchThunkArg<T> }, SerializedError>) => {
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveID.length > 0) return;

                    state.FetchStatus = 'error';
                    state.Error = {
                        Message: action.error.message ?? '',
                        Action: 'FETCH',
                        Time: new Date().toString()
                    }
                });
                builder.addCase(this.Fetch.fulfilled, (state: Draft<IState<T>>, action: PayloadAction<IReadOnlyThunkReturn<T>, string, { requestId: string, arg: IFetchThunkArg<T> }, never>) => {
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                    state.FetchStatus = 'idle';
                    state.Error = null;
                    state.Data = action.payload.Data as Draft<T[]>;

                    if (action.meta.arg == null) return;

                    if (action.meta.arg.filter != null)
                        state.Filter = action.meta.arg?.filter as Draft<Gemstone.Types.ISearchFilter<T>[]>

                    if (action.meta.arg.parentID != null)
                        state.ParentID = action.meta.arg?.parentID

                    if (state.SortField === action.meta.arg.sortField)
                        state.Ascending = !state.Ascending;
                    else if (action.meta.arg.sortField != null)
                        state.SortField = action.meta.arg.sortField as Draft<keyof T>
                });
                builder.addCase(this.SetStatusToChanged.pending, (state: Draft<IState<T>>) => {
                    state.FetchStatus = 'changed';
                })

            }
        });
        this.Reducer = this.Slice.reducer;
    }

    protected addExtraReducers(builder: ActionReducerMapBuilder<IState<T>>): void {
        builder.addCase(this.Fetch.pending, (state, action) => {
            state.FetchStatus = 'loading';
            state.ActiveID.push(action.meta.requestId);
        });
        builder.addCase(this.Fetch.rejected, (state, action) => {
            state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
            if (state.ActiveID.length > 0) return;

            state.FetchStatus = 'error';
            state.Error = {
                Message: action.error.message ?? '',
                Action: 'FETCH',
                Time: new Date().toString()
            };
        });
        builder.addCase(this.Fetch.fulfilled, (state, action) => {
            state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
            state.FetchStatus = 'idle';
            state.Error = null;
            state.Data = action.payload.Data as Draft<T[]>;

            if (action.meta.arg.filter != null)
                state.Filter = action.meta.arg?.filter as Draft<Gemstone.Types.ISearchFilter<T>[]>;

            if (action.meta.arg.parentID != null)
                state.ParentID = action.meta.arg?.parentID;

            if (state.SortField === action.meta.arg.sortField)
                state.Ascending = !state.Ascending;
            else if (action.meta.arg.sortField != null)
                state.SortField = action.meta.arg.sortField as Draft<keyof T>;
        });
        builder.addCase(this.SetStatusToChanged.pending, (state) => {
            state.FetchStatus = 'changed';
        });
    }

    public Data: (state: any) => T[] = (state) => (state[this.Name] as IState<T>).Data;

    public Error: (state: any) => IError | null = (state) => (state[this.Name] as IState<T>).Error;
    public FetchStatus: (state: any) => Application.Types.Status = (state) => (state[this.Name] as IState<T>).FetchStatus;

    public SortField: (state: any) => keyof T = (state) => (state[this.Name] as IState<T>).SortField;
    public Ascending: (state: any) => boolean = (state) => (state[this.Name] as IState<T>).Ascending;

    public ParentID: (state: any) => string | number | null = (state) => (state[this.Name] as IState<T>).ParentID;
}
