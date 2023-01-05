// ******************************************************************************************************
//  SliceInterfaces.tsx - Gbtc
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
//  07/15/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
import { Application } from '@gpa-gemstone/application-typings';
import { Search } from '@gpa-gemstone/react-interactive';
import { ActionCreatorWithPayload, AsyncThunk, ActionCreatorWithoutPayload } from '@reduxjs/toolkit';

type DBAction = 'POST' | 'DELETE' | 'PATCH';
export type UserValidation = 'Resolving' | 'Valid' | 'Invalid' | 'Unknown';

export interface IGenericSlice<T> {
  Fetch: (AsyncThunk<any, void | number | string, {}>),
  DBAction: (AsyncThunk<any, { verb: DBAction, record: T }, {}>),
  Sort: AsyncThunk<any, { SortField: keyof T, Ascending: boolean }, {}>,

  Data: (state: any) => T[],
  Status: (state: any) => Application.Types.Status,
  SortField: (state: any) => keyof T,
  Ascending: (state: any) => boolean,
  ParentID?: (state: any) => number | string
}

export interface ISearchableSlice<T> extends IGenericSlice<T> {
	DBSearch: (AsyncThunk<any, { filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean }, {}> ),

	SearchFilters: (state: any) => Search.IFilter<T>[],
	SearchResults: (state: any) => T[],
	SearchStatus: (state: any) => Application.Types.Status,
}

export interface IAdditionalFieldSlice<F,V> {
	FetchField: AsyncThunk<any, void, {}>,
	FieldAction: AsyncThunk<any, { Verb: DBAction, Record: F }, {}>,
  FetchValues: AsyncThunk<any, number|string, {}>,
  UpdateValues: AsyncThunk<any, {ParentID: number|string, Values: V[]}, {}>,
  Sort: ActionCreatorWithPayload<{ SortField: keyof F, Ascending: boolean}, string>,

	Fields: (state: any) => F[],
  Values: (state: any) => V[],
  FieldStatus: (state: any) => Application.Types.Status,
  ValueStatus: (state: any) => Application.Types.Status,
  ValueParentId: (state: any) => number|string,
  SortField: (state: any) => keyof F,
  Ascending: (state: any) => boolean,
}

export interface IUserAccountSlice extends ISearchableSlice<Application.Types.iUserAccount> {
	ADUpdate: (AsyncThunk<any, void, {}>),
  SetCurrentUser: (AsyncThunk<any, Application.Types.iUserAccount, {}>),
  LoadExistingUser: (AsyncThunk<any, string, {}>),
  SetNewUser: ActionCreatorWithoutPayload

	CurrentID: (state: any) => string|undefined,
	CurrentUser: (state: any) => Application.Types.iUserAccount,
  ADValidation: (state: any) => UserValidation
}

export interface ISecurityRoleSlice {
  FetchRoles: (AsyncThunk<any, void, {}>),
  FetchUserRoles: (AsyncThunk<any, string, {}>),
  SetUserRoles: (AsyncThunk<any, {UserId: string, Roles: Application.Types.iApplicationRoleUserAccount[]}, {}>),

	Status: (state: any) => Application.Types.Status,
  CurrentRoleStatus: (state: any) => Application.Types.Status,
  Roles: (state: any) =>  Application.Types.iApplicationRoleUserAccount[],
  AvailableRoles: (state: any) => Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]
}
