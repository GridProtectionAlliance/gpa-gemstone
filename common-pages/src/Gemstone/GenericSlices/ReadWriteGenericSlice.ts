// ******************************************************************************************************
//  ReadWriteGenericSlice.tsx - Gbtc
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

import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReadOnlyControllerFunctions, ReadWriteControllerFunctions } from '../ControllerFunctions';
import ReadOnlyGenericSlice from './ReadOnlyGenericSlice';
import { IState as IReadOnlyState } from './ReadOnlyGenericSlice';
import { Application } from '@gpa-gemstone/application-typings';

interface IState<T> extends IReadOnlyState<T> {
    AddStatus: Application.Types.Status,
    UpdateStatus: Application.Types.Status,
    DeleteStatus: Application.Types.Status
}

export default class ReadWriteGenericSlice<T> extends ReadOnlyGenericSlice<T> {
    public Add!: AsyncThunk<T, T, {}>;
    public Update!: AsyncThunk<T, T, {}>;
    public Delete!: AsyncThunk<T, (string | number | T), {}>;

    private updateHandle: JQuery.jqXHR<T> | null = null;
    private addHandle: JQuery.jqXHR<T> | null = null;
    private deleteHandle: JQuery.jqXHR | null = null;

    private readWriteController: ReadWriteControllerFunctions<T>;

    constructor(name: string, defaultSortField: keyof T, ascending: boolean, apiPath: string);
    constructor(name: string, defaultSortField: keyof T, ascending: boolean, readWriteController: ReadWriteControllerFunctions<T>, readOnlyController?: ReadOnlyControllerFunctions<T>);

    constructor(name: string, defaultSortField: keyof T, ascending: boolean, apiPathOrReadWriteController: string | ReadWriteControllerFunctions<T>, readOnlyController?: ReadOnlyControllerFunctions<T>) {
        super(name, defaultSortField, ascending, typeof apiPathOrReadWriteController === 'string' ? new ReadWriteControllerFunctions<T>(apiPathOrReadWriteController) : (readOnlyController ?? apiPathOrReadWriteController));

        this.readWriteController = typeof apiPathOrReadWriteController === 'string' ? new ReadWriteControllerFunctions<T>(apiPathOrReadWriteController) : apiPathOrReadWriteController;

        this.initializeReadWriteSlice();
    }

    private initializeReadWriteSlice() {
        this.Add = createAsyncThunk(`${this.Name}/Add${this.Name}`, async (record, { signal }) => {
            if (this.addHandle?.abort != null)
                this.addHandle.abort('Prev');

            this.addHandle = this.readWriteController.Add(record);

            signal.addEventListener('abort', () => {
                this.addHandle?.abort();
            });
            return await this.addHandle;
        });

        this.Update = createAsyncThunk(`${this.Name}/Update${this.Name}`, async (record, { signal }) => {
            if (this.updateHandle?.abort != null)
                this.updateHandle.abort('Prev');

            this.updateHandle = this.readWriteController.Update(record);

            signal.addEventListener('abort', () => {
                this.updateHandle?.abort();
            });
            return await this.updateHandle;
        });

        this.Delete = createAsyncThunk(`${this.Name}/Delete${this.Name}`, async (record, { signal }) => {
            if (this.deleteHandle?.abort != null)
                this.deleteHandle.abort('Prev');

            if (typeof record === 'string' || typeof record === 'number')
                this.deleteHandle = this.readWriteController.DeleteByID(record);
            else
                this.deleteHandle = this.readWriteController.Delete(record);

            signal.addEventListener('abort', () => {
                this.deleteHandle?.abort();
            });
            return await this.deleteHandle;
        });

        // Create the slice with extended reducers
        this.Slice = createSlice({
            name: this.Name,
            initialState: {
                ...this.Slice.getInitialState(),
                AddStatus: 'uninitiated',
                UpdateStatus: 'uninitiated',
                DeleteStatus: 'uninitiated',
            } as IState<T>,
            reducers: {},
            extraReducers: (builder) => {
                this.addExtraReducers(builder);

                builder.addCase(this.Add.pending, (state, action) => {
                    state.AddStatus = 'loading';
                    state.ActiveID.push(action.meta.requestId);
                });
                builder.addCase(this.Add.fulfilled, (state, action) => {
                    state.AddStatus = 'changed';
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                });
                builder.addCase(this.Add.rejected, (state, action) => {
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveID.length > 0) return;

                    state.AddStatus = 'error';
                    state.Error = {
                        Message: action.error.message ?? '',
                        Action: 'ADD',
                        Time: new Date().toString()
                    };
                });

                builder.addCase(this.Update.pending, (state, action) => {
                    state.UpdateStatus = 'loading';
                    state.ActiveID.push(action.meta.requestId);
                });
                builder.addCase(this.Update.fulfilled, (state, action) => {
                    state.UpdateStatus = 'changed';
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                });
                builder.addCase(this.Update.rejected, (state, action) => {
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveID.length > 0) return;

                    state.UpdateStatus = 'error';
                    state.Error = {
                        Message: action.error.message ?? '',
                        Action: 'UPDATE',
                        Time: new Date().toString()
                    };
                });

                builder.addCase(this.Delete.pending, (state, action) => {
                    state.DeleteStatus = 'loading';
                    state.ActiveID.push(action.meta.requestId);
                });
                builder.addCase(this.Delete.fulfilled, (state, action) => {
                    state.DeleteStatus = 'changed';
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                });
                builder.addCase(this.Delete.rejected, (state, action) => {
                    state.ActiveID = state.ActiveID.filter(id => id !== action.meta.requestId);
                    if (state.ActiveID.length > 0) return;

                    state.DeleteStatus = 'error';
                    state.Error = {
                        Message: action.error.message ?? '',
                        Action: 'DELETE',
                        Time: new Date().toString()
                    };
                });
            }
        });

        this.Reducer = this.Slice.reducer;
    }

    public UpdateStatus = (state: any) => (state[this.Name] as IState<T>).UpdateStatus;
    public AddStatus = (state: any) => (state[this.Name] as IState<T>).AddStatus;
    public DeleteStatus = (state: any) => (state[this.Name] as IState<T>).DeleteStatus;
}
