// ******************************************************************************************************
//  SystemCenter.ts - Gbtc
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
//  04/28/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************


namespace SystemCenter {
    export namespace Lists {
	
        // Lists
		export const AdditionalFieldTypes: Types.AdditionalFieldType[] = ['integer', 'number', 'string' , 'boolean']
	}

    export namespace Types {
		// Types
		export type AdditionalFieldType = 'integer' | 'number' | 'string' | 'boolean' | string;
        // Tables
        export interface Setting {ID: number, Name: string, Value: string, DefaultValue: string }
		export interface AdditionalField { ID: number, ParentTable: string, FieldName: string, Type: AdditionalFieldType, ExternalDB?: string, ExternalDBTable?: string, ExternalDBTableKey?: string, IsSecure: boolean, Searchable: boolean}
		export interface AdditionalFieldValue { ID: number, ParentTableID: number, AdditionalFieldID: number, Value: string }
		export interface ValueListGroup { ID: number, Name: string, Description: string, Items?: ValueListItem[]}
		export interface ValueListItem { ID: number, GroupID: number, AltValue: string, Value: string, SortOrder: number}
		
		export interface LocationDrawing { ID: number, LocationID: number, Name: string, Link: string, Description: string }

		export interface ExternalDB { name: string, lastupdate: Date }
		export interface ExternalDBField { DisplayName: string, FieldValueID: number, OpenXDAParentTableID: number, AdditionalFieldID: number, Value: string, FieldName: string, PreviousValue: string, Error: boolean, Message: string, isXDAField: boolean, Changed: boolean }
		export interface ExternalDataBaseTable { ID: number, TableName: string, ExternalDB: string, Query: string }
		export interface DetailedAsset { ID: number, AssetKey: string, AssetName: string, VoltageKV: number, AssetType: string, Meters: number, Locations: number }
        export interface DetailedMeter { ID: number, AssetKey: string, Name: string, Location: string, MappedAssets: number, Make: string, Model: string }
        export interface DetailedLocation { ID: number, LocationKey: string, Name: string, Description: string, Alias: string, ShortName: string, Longitude: number, Latitude: number, Meters: number, Assets: number }
	}
}

export default SystemCenter;



