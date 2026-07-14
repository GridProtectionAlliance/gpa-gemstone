// ******************************************************************************************************
//  SelectionPopup.tsx - Gbtc
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
//  12/19/2021 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import React = require("react");
import { GenericSlice, Search} from "@gpa-gemstone/react-interactive";
import { Application, OpenXDA, SystemCenter } from "@gpa-gemstone/application-typings";
import SelectPopup from "./StandardSelectPopup";
import {DefaultSearch} from './SearchBar';

interface U { ID: number|string }

// Pass columns in via children

interface IProps<T extends U> {
    /**
     * Redux slice used to search and sort selectable records.
     */
    Slice: GenericSlice<T>,
    /**
     * Records selected when the popup opens.
     */
    Selection: T[],
    /**
     * Handles confirmation or cancellation of the selection.
     * @param selected - Records selected when the popup closes.
     * @param conf - Whether the user confirmed the selection.
     */
    OnClose: (selected: T[], conf: boolean ) => void
    /**
     * Controls whether the selection popup is visible.
     */
    Show: boolean,
    /**
     * Optional selection mode, defaulting to `single`.
     */
    Type?: 'single'|'multiple',
    /**
     * Title shown in the popup header.
     */
    Title: string,
    /**
     * Loads the available values for an enumerated search field.
     * @param setOptions - Callback that stores the loaded options.
     * @param field - Search field whose options should be loaded.
     * @returns Cleanup callback for the option request.
     */
    GetEnum: (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void,
    /**
     * Loads additional searchable fields for the selected record type.
     * @param setAddlFields - Callback that stores the loaded field definitions.
     * @returns Cleanup callback for the field request.
     */
    GetAddlFields: (setAddlFields: (cols: Search.IField<T>[]) => void) => () => void,
    /**
     * Optional filters appended to filters entered through the search bar.
     */
    AddlFilters?: Search.IFilter<T>[],
    /**
     * Optional number of records required before confirmation is enabled.
     */
    MinSelection?: number,
    /**
     * Optional table columns and search controls rendered by the popup.
     */
    children?: React.ReactNode,
    /**
     * Optional identifier used to persist the search configuration.
     */
    StorageID?: string
}


interface IOptions {Value: string, Label: string}

/** This Implements a few standardized Selection Popups */
export namespace DefaultSelects {

    /** This Implements a standard Meter Selection Modal */
    export function Meter (props: IProps<SystemCenter.Types.DetailedMeter>) {
        return <SelectPopup<SystemCenter.Types.DetailedMeter>{...props} Searchbar={(children) => <DefaultSearch.Meter Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum} StorageID={props.StorageID} AddlFilters={props.AddlFilters}>{children}</DefaultSearch.Meter>}> {props.children} </SelectPopup>
    }

    /** This Implements a standard Substation Selection Modal */
    export function Location (props: IProps<SystemCenter.Types.DetailedLocation>) {
        return <SelectPopup<SystemCenter.Types.DetailedLocation>{...props} Searchbar={(children) => <DefaultSearch.Location Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum} StorageID={props.StorageID} AddlFilters={props.AddlFilters}>{children}</DefaultSearch.Location>}> {props.children} </SelectPopup>
    }

    /** This Implements a standard Transmission Asset Selection Modal */
    export function Asset (props: IProps<SystemCenter.Types.DetailedAsset>) {
        return <SelectPopup<SystemCenter.Types.DetailedAsset>{...props} Searchbar={(children) => <DefaultSearch.Asset Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum} StorageID={props.StorageID} AddlFilters={props.AddlFilters}>{children}</DefaultSearch.Asset>}> {props.children} </SelectPopup>
    }

    /** This Implements a standard Asset Group Selection Modal */
    export function AssetGroup (props: IProps<OpenXDA.Types.AssetGroup>) {
        return <SelectPopup<OpenXDA.Types.AssetGroup>{...props} Searchbar={(children) => <DefaultSearch.AssetGroup Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum} StorageID={props.StorageID} AddlFilters={props.AddlFilters}>{children}</DefaultSearch.AssetGroup>}> {props.children} </SelectPopup>
    }

    /** This Implements a standard User Selection Modal */
    export function User (props: IProps<Application.Types.iUserAccount>) {
        return <SelectPopup<Application.Types.iUserAccount>{...props} Searchbar={(children) => <DefaultSearch.User Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum} StorageID={props.StorageID} AddlFilters={props.AddlFilters}>{children}</DefaultSearch.User>}> {props.children} </SelectPopup>
    }
    /** This Implements a standard Customer Selection Modal */
    export function Customer (props: IProps<OpenXDA.Types.Customer>) {
        return <SelectPopup<OpenXDA.Types.Customer>{...props} Searchbar={(children) => <DefaultSearch.Customer Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum} StorageID={props.StorageID} AddlFilters={props.AddlFilters}>{children}</DefaultSearch.Customer>}> {props.children} </SelectPopup>
        
    }
}