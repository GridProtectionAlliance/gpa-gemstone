// ******************************************************************************************************
//  SearchBar.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  12/17/2021 - Samuel Robinson
//       Generated original version of source code.
//  12/19/2021 - C. Lackner
//       Cleaned up code.
// ******************************************************************************************************

import * as React from 'react';
import { GenericSlice, SearchBar as GenericSearchBar, Search } from '@gpa-gemstone/react-interactive';
import { OpenXDA, SystemCenter, Application } from '@gpa-gemstone/application-typings';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';

interface U { ID: number|string }

interface IProps<T extends U> {
    /** A Generic Slyce for the Search */
    Slice: GenericSlice<T>,
    /** Functions that gets available values for any ENUM Types */
    GetEnum: (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void,
    /** Function that Grabs any additional Filters that shoudl be available (such as Addl Fields) */
    GetAddlFields: (setAddlFields: (cols: Search.IField<T>[]) => void) => () => void,
    children: React.ReactNode,
    AddlFilters?: Search.IFilter<T>[],
    StorageID?: string
}

interface IOptions {Value: string, Label: string}

/** This Implements a few standardized SearchBars */
export namespace DefaultSearch {

    /** This Implements a standard Meter Search */
    export function Meter(props: IProps<SystemCenter.Types.DetailedMeter>) {

      const defaultSearchcols: Search.IField<SystemCenter.Types.DetailedMeter>[] = [
        { label: 'Key', key: 'AssetKey', type: 'string', isPivotField: false },
        { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
        { label: 'Substation', key: 'Location', type: 'string', isPivotField: false },
        { label: 'Make', key: 'Make', type: 'string', isPivotField: false },
        { label: 'Model', key: 'Model', type: 'string', isPivotField: false },
        { label: 'Number of Assets', key: 'MappedAssets', type: 'number', isPivotField: false },
        { label: 'Description', key: 'Description', type: 'string', isPivotField: false },
      ];

        const dispatch = useDispatch<Dispatch<any>>();

        const [addlFieldCols, setAddlFieldCols] = React.useState<Search.IField<SystemCenter.Types.DetailedMeter>[]>([]);
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: SystemCenter.Types.DetailedMeter[] = useSelector(props.Slice.SearchResults);

        React.useEffect(() => {
          return props.GetAddlFields(setAddlFieldCols);
        }, []);

        const standardSearch: Search.IField<SystemCenter.Types.DetailedMeter> = { label: 'Name', key: 'Name', type: 'string', isPivotField: false };

        return <GenericSearchBar<SystemCenter.Types.DetailedMeter>
            CollumnList={[...defaultSearchcols, ...addlFieldCols]}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: (props.AddlFilters === undefined ? flds : [...flds, ...props.AddlFilters]), sortField, ascending }))} 
            Direction={'left'}
            defaultCollumn={standardSearch}
            Width={'50%'}
            Label={'Search'}
            ShowLoading={searchStatus === 'loading'}
            ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Meter(s)'}
            GetEnum={props.GetEnum}
            StorageID={props.StorageID}
        >
            {props.children}
        </GenericSearchBar>
    }

    /** This Implements a standard Substation Search */
    export function Location (props: IProps<SystemCenter.Types.DetailedLocation>) {

        const standardSearch: Search.IField<SystemCenter.Types.DetailedLocation> = { label: 'Name', key: 'Name', type: 'string', isPivotField: false };
        const [addlFieldCols, setAddlFieldCols] = React.useState<Search.IField<SystemCenter.Types.DetailedLocation>[]>([]);
        
        const dispatch = useDispatch<Dispatch<any>>();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: SystemCenter.Types.DetailedLocation[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Search.IField<SystemCenter.Types.DetailedLocation>[] = [
            { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Key', key: 'LocationKey', type: 'string', isPivotField: false },
            { label: 'Transmission Asset', key: 'Asset', type: 'string', isPivotField: false },
            { label: 'Meter', key: 'Meter', type: 'string', isPivotField: false },
            { label: 'Number of Transmission Assets', key: 'Assets', type: 'integer', isPivotField: false },
            { label: 'Number of Meters', key: 'Meters', type: 'integer', isPivotField: false },
            { label: 'Description', key: 'Description', type: 'string', isPivotField: false },
        ]; 

        React.useEffect(() => {
          return props.GetAddlFields(setAddlFieldCols);
        }, []);

        return <GenericSearchBar<SystemCenter.Types.DetailedLocation> 
            CollumnList={[...defaultSearchcols, ...addlFieldCols]}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: (props.AddlFilters === undefined ? flds : [...flds, ...props.AddlFilters]), sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus === 'loading'} 
            ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + '  Substation(s)'}
            GetEnum={props.GetEnum}
            StorageID={props.StorageID}
        >
            {props.children}
        </GenericSearchBar>
    }

    /** This Implements a standard Transmission Asset Search */
    export function Asset (props: IProps<SystemCenter.Types.DetailedAsset>) {

        const standardSearch: Search.IField<SystemCenter.Types.DetailedAsset> = { label: 'Name', key: 'AssetName', type: 'string', isPivotField: false };
        const [addlFieldCols, setAddlFieldCols] = React.useState<Search.IField<SystemCenter.Types.DetailedAsset>[]>([]);

        const dispatch = useDispatch<Dispatch<any>>();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: SystemCenter.Types.DetailedAsset[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Search.IField<SystemCenter.Types.DetailedAsset>[] = [
            { label: 'Key', key: 'AssetKey', type: 'string', isPivotField: false },
            { label: 'Name', key: 'AssetName', type: 'string', isPivotField: false },
            { label: 'Nominal Voltage (L-L kV)', key: 'VoltageKV', type: 'number', isPivotField: false },
            { label: 'Type', key: 'AssetType', type: 'enum', isPivotField: false },
            { label: 'Meter Key', key: 'Meter', type: 'string', isPivotField: false },
            { label: 'Substation Key', key: 'Location', type: 'string', isPivotField: false },
            { label: 'Number of Meters', key: 'Meters', type: 'integer', isPivotField: false },
            { label: 'Number of Substations', key: 'Locations', type: 'integer', isPivotField: false },
            { label: 'Description', key: 'Description', type: 'string', isPivotField: false },
        ];

        React.useEffect(() => {
          return props.GetAddlFields(setAddlFieldCols);
        }, []);

        return <GenericSearchBar<SystemCenter.Types.DetailedAsset> 
            CollumnList={[...defaultSearchcols, ...addlFieldCols]}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: (props.AddlFilters === undefined ? flds : [...flds, ...props.AddlFilters]), sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus === 'loading'} 
            ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Transmission Asset(s)'}
            GetEnum={props.GetEnum}
            StorageID={props.StorageID}
        >
            {props.children}
        </GenericSearchBar>
    }

    /** This Implements a standard AssetGroup Search */
    export function AssetGroup (props: IProps<OpenXDA.Types.AssetGroup>) {

        const standardSearch: Search.IField<OpenXDA.Types.AssetGroup> = { label: 'Name', key: 'Name', type: 'string', isPivotField: false };
        const [addlFieldCols, setAddlFieldCols] = React.useState<Search.IField<OpenXDA.Types.AssetGroup>[]>([]);

        const dispatch = useDispatch<Dispatch<any>>();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: OpenXDA.Types.AssetGroup[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Search.IField<OpenXDA.Types.AssetGroup>[] = [
            { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Number of Meters', key: 'Meters', type: 'integer', isPivotField: false },
            { label: 'Number of Transmission Assets', key: 'Assets', type: 'integer', isPivotField: false },
            { label: 'Number of Asset Groups', key: 'AssetGroups', type: 'integer', isPivotField: false },
            { label: 'Show in PQ Dashboard', key: 'DisplayDashboard', type: 'boolean', isPivotField: false },
            { label: 'Show in Email Subscription', key: 'DisplayEmail', type: 'boolean', isPivotField: false },
        ];

        React.useEffect(() => {
          return props.GetAddlFields(setAddlFieldCols);
        }, []);
        
        return <GenericSearchBar<OpenXDA.Types.AssetGroup> 
            CollumnList={[...defaultSearchcols, ...addlFieldCols]}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: (props.AddlFilters === undefined ? flds : [...flds, ...props.AddlFilters]), sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus === 'loading'} 
            ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Asset Group(s)'}
            GetEnum={props.GetEnum}
            StorageID={props.StorageID}
        >
            {props.children}
        </GenericSearchBar>
    }

    /** This Implements a standard User Search */
    export function User (props: IProps<Application.Types.iUserAccount>) {

        const standardSearch: Search.IField<Application.Types.iUserAccount> = { label: 'Username', key: 'Name', type: 'string', isPivotField: false };
        const [addlFieldCols, setAddlFieldCols] = React.useState<Search.IField<Application.Types.iUserAccount>[]>([]);

        const dispatch = useDispatch<Dispatch<any>>();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: Application.Types.iUserAccount[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Search.IField<Application.Types.iUserAccount>[] = [
            { label: 'Username', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Email', key: 'Email', type: 'string', isPivotField: false },
            { label: 'Account Locked', key: 'LockedOut', type: 'boolean', isPivotField: false },     
        ];

        React.useEffect(() => {
          return props.GetAddlFields(setAddlFieldCols);
        }, []);
        
        return <GenericSearchBar<Application.Types.iUserAccount> 
            CollumnList={[...defaultSearchcols, ...addlFieldCols]}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: (props.AddlFilters === undefined ? flds : [...flds, ...props.AddlFilters]), sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus === 'loading'} 
            ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' User(s)'}
            GetEnum={props.GetEnum}
            StorageID={props.StorageID}
        >
            {props.children}
        </GenericSearchBar>
    }


    /** This Implements a standard Customer Search */
    export function Customer (props: IProps<OpenXDA.Types.Customer>) {

        const defaultSearchcols: Search.IField<OpenXDA.Types.Customer>[] = [
            { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Account Name', key: 'CustomerKey', type: 'string', isPivotField: false },
            { label: 'Phone', key: 'Phone', type: 'string', isPivotField: false },
            { label: 'Description', key: 'Description', type: 'string', isPivotField: false },
        ];

        const standardSearch: Search.IField<OpenXDA.Types.Customer> = { label: 'Name', key: 'Name', type: 'string', isPivotField: false };
        const [addlFieldCols, setAddlFieldCols] = React.useState<Search.IField<OpenXDA.Types.Customer>[]>([]);
        
        const dispatch = useDispatch<Dispatch<any>>();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: OpenXDA.Types.Customer[] = useSelector(props.Slice.SearchResults);

        React.useEffect(() => {
          return props.GetAddlFields(setAddlFieldCols);
        }, []);
        
        return <GenericSearchBar<OpenXDA.Types.Customer> 
            CollumnList={[...defaultSearchcols, ...addlFieldCols]}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: (props.AddlFilters === undefined ? flds : [...flds, ...props.AddlFilters]), sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus === 'loading'} 
            ResultNote={searchStatus === 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Customer(s)'}
            GetEnum={props.GetEnum}
            StorageID={props.StorageID}
        >
            {props.children}
        </GenericSearchBar>
    }
}