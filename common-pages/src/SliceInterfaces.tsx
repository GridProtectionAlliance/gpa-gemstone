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

/** Database mutation verbs supported by generic slices. */
type DBAction = 'POST' | 'DELETE' | 'PATCH';
/** Current validation state of a user account. */
export type UserValidation = 'Resolving' | 'Valid' | 'Invalid' | 'Unknown';

/** Exposes the async actions and selectors of a generic data slice. */
export interface IGenericSlice<T> {
  /** Fetches records, optionally scoped to a parent identifier. */
  Fetch: (AsyncThunk<any, void | number | string, {}>),
  /** Executes a database mutation for a record. */
  DBAction: (AsyncThunk<any, { verb: DBAction, record: T }, {}>),
  /** Updates the field and direction used to sort records. */
  Sort: AsyncThunk<any, { SortField: keyof T, Ascending: boolean }, {}>,

  /** Selects the slice records from application state. */
  Data: (state: any) => T[],
  /** Selects the current fetch status from application state. */
  Status: (state: any) => Application.Types.Status,
  /** Selects the active sort field from application state. */
  SortField: (state: any) => keyof T,
  /** Selects whether sorting is ascending from application state. */
  Ascending: (state: any) => boolean,
  /** Optionally selects the active parent identifier from application state. */
  ParentID?: (state: any) => number | string
}

/** Extends a generic slice with searchable records and search state. */
export interface ISearchableSlice<T> extends IGenericSlice<T> {
  /** Searches records with optional sort overrides. */
  DBSearch: (AsyncThunk<any, { filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean }, {}> ),

  /** Selects the active search filters from application state. */
  SearchFilters: (state: any) => Search.IFilter<T>[],
  /** Selects records returned by the current search. */
  SearchResults: (state: any) => T[],
  /** Selects the current search status from application state. */
  SearchStatus: (state: any) => Application.Types.Status,
}

/** Exposes actions and selectors for fields with parent-associated values. */
export interface IAdditionalFieldSlice<F,V> {
  /** Fetches available field definitions. */
  FetchField: AsyncThunk<any, void, {}>,
  /** Executes a database mutation for a field definition. */
  FieldAction: AsyncThunk<any, { Verb: DBAction, Record: F }, {}>,
  /** Fetches values associated with a parent identifier. */
  FetchValues: AsyncThunk<any, number|string, {}>,
  /** Updates values associated with a parent identifier. */
  UpdateValues: AsyncThunk<any, {ParentID: number|string, Values: V[]}, {}>,
  /** Updates the field and direction used to sort field definitions. */
  Sort: ActionCreatorWithPayload<{ SortField: keyof F, Ascending: boolean}, string>,

  /** Selects available field definitions from application state. */
  Fields: (state: any) => F[],
  /** Selects values associated with the active parent. */
  Values: (state: any) => V[],
  /** Selects the current field-fetch status. */
  FieldStatus: (state: any) => Application.Types.Status,
  /** Selects the current value-fetch status. */
  ValueStatus: (state: any) => Application.Types.Status,
  /** Selects the parent identifier associated with loaded values. */
  ValueParentId: (state: any) => number|string,
  /** Selects the active field sort key. */
  SortField: (state: any) => keyof F,
  /** Selects whether fields are sorted in ascending order. */
  Ascending: (state: any) => boolean,
}

/** Extends a searchable slice with current-user and directory validation state. */
export interface IUserAccountSlice extends ISearchableSlice<Application.Types.iUserAccount> {
  /** Refreshes user information from the configured directory. */
  ADUpdate: (AsyncThunk<any, void, {}>),
  /** Sets the user account currently being edited. */
  SetCurrentUser: (AsyncThunk<any, Application.Types.iUserAccount, {}>),
  /** Loads an existing user by identifier. */
  LoadExistingUser: (AsyncThunk<any, string, {}>),
  /** Initializes a new user account. */
  SetNewUser: ActionCreatorWithoutPayload

  /** Selects the identifier of the current user, when available. */
  CurrentID: (state: any) => string|undefined,
  /** Selects the current user account. */
  CurrentUser: (state: any) => Application.Types.iUserAccount,
  /** Selects the current directory validation state. */
  ADValidation: (state: any) => UserValidation
}

/** Exposes actions and selectors used to assign security roles to users. */
export interface ISecurityRoleSlice {
  /** Fetches all available security roles. */
  FetchRoles: (AsyncThunk<any, void, {}>),
  /** Fetches roles assigned to a user. */
  FetchUserRoles: (AsyncThunk<any, string, {}>),
  /** Replaces the roles assigned to a user. */
  SetUserRoles: (AsyncThunk<any, {UserId: string, Roles: Application.Types.iApplicationRoleUserAccount[]}, {}>),

  /** Selects the status of the role list request. */
  Status: (state: any) => Application.Types.Status,
  /** Selects the status of the current user's role request. */
  CurrentRoleStatus: (state: any) => Application.Types.Status,
  /** Selects roles assigned to the current user. */
  Roles: (state: any) =>  Application.Types.iApplicationRoleUserAccount[],
  /** Selects all roles available for assignment. */
  AvailableRoles: (state: any) => Application.Types.iApplicationRole<Application.Types.SecurityRoleName>[]
}
