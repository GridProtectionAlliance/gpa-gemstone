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

import Table, { Column } from "@gpa-gemstone/react-table";
import React = require("react");
import { useDispatch, useSelector } from "react-redux";
import { GenericSlice, Modal, SearchBar, Search} from "@gpa-gemstone/react-interactive";
import _ = require("lodash");
import { CrossMark } from "@gpa-gemstone/gpa-symbols";
import { OpenXDA, SystemCenter } from "@gpa-gemstone/application-typings";
import SelectPopup from "./StandardSelectPopup";
import {DefaultSearch} from './SearchBar';

interface U { ID: number|string }

interface IProps<T extends U> {
    Slice: GenericSlice<T>,
    Selection: T[],
    OnClose: (selected: T[], conf: boolean ) => void
    Show: boolean,
    Type?: 'single'|'multiple',
    Columns: Column<T>[],
    Title: string,
    GetEnum: (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void,
    GetAddlFields: (setAddlFields: (cols: Search.IField<T>[]) => void) => () => void
    MinSelection?: number
}


interface IOptions {Value: string, Label: string}

/** This Implements a few standardized Selection Popups */
export namespace DefaultSelects {

    /** This Implements a standard Meter Selection Modal */
    export function Meter (props: IProps<SystemCenter.Types.DetailedMeter>) {
        return <SelectPopup<SystemCenter.Types.DetailedMeter>{...props} Searchbar={(children) => <DefaultSearch.Meter Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum}>{children}</DefaultSearch.Meter>}></SelectPopup>
    }

    /** This Implements a standard Substation Selection Modal */
    export function Location (props: IProps<SystemCenter.Types.DetailedLocation>) {
        return <SelectPopup<SystemCenter.Types.DetailedLocation>{...props} Searchbar={(children) => <DefaultSearch.Location Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum}>{children}</DefaultSearch.Location>}></SelectPopup>
    }

    /** This Implements a standard Transmission Asset Selection Modal */
    export function Asset (props: IProps<SystemCenter.Types.DetailedAsset>) {
        return <SelectPopup<SystemCenter.Types.DetailedAsset>{...props} Searchbar={(children) => <DefaultSearch.Asset Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum}>{children}</DefaultSearch.Asset>}></SelectPopup>
    }

    /** This Implements a standard Asset Group Selection Modal */
    export function AssetGroup (props: IProps<OpenXDA.Types.AssetGroup>) {
        return <SelectPopup<OpenXDA.Types.AssetGroup>{...props} Searchbar={(children) => <DefaultSearch.AssetGroup Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum}>{children}</DefaultSearch.AssetGroup>}></SelectPopup>
    }

    /** This Implements a standard Asset Group Selection Modal */
    export function Customer (props: IProps<OpenXDA.Types.Customer>) {
        return <SelectPopup<OpenXDA.Types.Customer>{...props} Searchbar={(children) => <DefaultSearch.Customer Slice={props.Slice} GetAddlFields={props.GetAddlFields} GetEnum={props.GetEnum}>{children}</DefaultSearch.Customer>}></SelectPopup>
    }
}