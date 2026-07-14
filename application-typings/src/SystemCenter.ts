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
		/** Defines the supported additional field data types. */
		export type AdditionalFieldType = 'integer' | 'number' | 'string' | 'boolean' | string;
        // Tables
        /** Represents the setting data contract. */
        export interface Setting {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Value associated with the record. */
            Value: string,
            /** Default Value associated with the record. */
            DefaultValue: string
        }
        /** Represents the sE Browser Setting data contract. */
        export interface SEBrowserSetting extends Setting {
            /** Application Instance associated with the record. */
            ApplicationInstance: boolean,
            /** Scope associated with the record. */
            Scope: string,
            /** Roles associated with the record. */
            Roles: string
        }
		/** Represents the additional Field data contract. */
		export interface AdditionalField {
			/** Unique identifier for the record. */
			ID: number,
			/** Parent Table associated with the record. */
			ParentTable: string,
			/** Field Name associated with the record. */
			FieldName: string,
			/** Type associated with the record. */
			Type: AdditionalFieldType,
			/** Identifier of the associated external DB Table. */
			ExternalDBTableID?: number,
			/** Indicates whether secure. */
			IsSecure: boolean,
			/** Indicates whether info. */
			IsInfo: boolean,
			/** Indicates whether key. */
			IsKey: boolean,
			/** Indicates whether the record is searchable. */
			Searchable: boolean
		}
		/** Represents the additional Field View data contract. */
		export interface AdditionalFieldView extends AdditionalField {
			/** Optional external DB. */
			ExternalDB?: string,
			/** Optional external Table. */
			ExternalTable?: string
		}
		/** Represents the additional Field Value data contract. */
		export interface AdditionalFieldValue {
			/** Unique identifier for the record. */
			ID: number,
			/** Identifier of the associated parent Table. */
			ParentTableID: number,
			/** Identifier of the associated additional Field. */
			AdditionalFieldID: number,
			/** Value associated with the record. */
			Value: string
		}
		/** Represents the external Open XDA Field data contract. */
		export interface ExternalOpenXDAField {
			/** Unique identifier for the record. */
			ID: number,
			/** Parent Table associated with the record. */
			ParentTable: string,
			/** Field Name associated with the record. */
			FieldName: string,
			/** Identifier of the associated external DB Table. */
			ExternalDBTableID: number
		}
		/** Represents the value List Group data contract. */
		export interface ValueListGroup {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Description of the record. */
			Description: string,
			/** Optional items. */
			Items?: ValueListItem[]
		}
		/** Represents the value List Item data contract. */
		export interface ValueListItem {
			/** Unique identifier for the record. */
			ID: number,
			/** Identifier of the associated group. */
			GroupID: number,
			/** Alt Value associated with the record. */
			AltValue: string,
			/** Value associated with the record. */
			Value: string,
			/** Sort Order associated with the record. */
			SortOrder: number
		}
		/** Represents the channel Group data contract. */
		export interface ChannelGroup {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Description of the record. */
			Description: string,
			/** Optional items. */
			Items?: ChannelGroupDetails[]
		}
                /** Represents the channel Group Details data contract. */
                export interface ChannelGroupDetails {
                    /** Unique identifier for the record. */
                    ID: number,
                    /** Identifier of the associated channel Group. */
                    ChannelGroupID: number,
                    /** Channel Group associated with the record. */
                    ChannelGroup: string,
                    /** Identifier of the associated measurement Type. */
                    MeasurementTypeID: number,
                    /** Measurement Type associated with the record. */
                    MeasurementType: string,
                    /** Identifier of the associated measurement Characteristic. */
                    MeasurementCharacteristicID: number,
                    /** Measurement Characteristic associated with the record. */
                    MeasurementCharacteristic: string,
                    /** Indicates whether name is displayed. */
                    DisplayName: string,
                    /** Unit associated with the record. */
                    Unit: string
                }
		
		/** Represents the location Drawing data contract. */
		export interface LocationDrawing {
			/** Unique identifier for the record. */
			ID: number,
			/** Identifier of the associated location. */
			LocationID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Link associated with the record. */
			Link: string,
			/** Description of the record. */
			Description: string,
			/** Number associated with the record. */
			Number: string,
			/** Category associated with the record. */
			Category: string
		}

		/** Represents the external Databases data contract. */
		export interface ExternalDatabases {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Schedule associated with the record. */
			Schedule: string,
			/** Connection String associated with the record. */
			ConnectionString: string,
			/** Data Provider String associated with the record. */
			DataProviderString: string,
			/** Encrypt associated with the record. */
			Encrypt: boolean
		}
		/** Represents the detailed External Databases data contract. */
		export interface DetailedExternalDatabases extends ExternalDatabases {
			/** Optional last Data Update. */
			LastDataUpdate?: string,
			/** Optional mapped Tables. */
			MappedTables?: number,
			/** Optional mapped Fields. */
			MappedFields?: number
		}
		/** Represents the ext DB Tables data contract. */
		export interface extDBTables {
			/** Unique identifier for the record. */
			ID: number,
			/** Table Name associated with the record. */
			TableName: string,
			/** Identifier of the associated ext DB. */
			ExtDBID: number,
			/** Query associated with the record. */
			Query: string
		}
		/** Represents the detailed Ext DB Tables data contract. */
		export interface DetailedExtDBTables extends extDBTables {
			/** Optional external DB. */
			ExternalDB?: string,
			/** Optional mapped Fields. */
			MappedFields?: number
		}
		/** Represents the detailed Asset data contract. */
		export interface DetailedAsset {
			/** Unique identifier for the record. */
			ID: number,
			/** Asset Key associated with the record. */
			AssetKey: string,
			/** Asset Name associated with the record. */
			AssetName: string,
			/** Voltage KV associated with the record. */
			VoltageKV: number,
			/** Asset Type associated with the record. */
			AssetType: string,
			/** Meters associated with the record. */
			Meters: number,
			/** Locations associated with the record. */
			Locations: number
		}
        /** Represents the detailed Meter data contract. */
        export interface DetailedMeter {
            /** Unique identifier for the record. */
            ID: number,
            /** Asset Key associated with the record. */
            AssetKey: string,
            /** Name displayed for the record. */
            Name: string,
            /** Location associated with the record. */
            Location: string,
            /** Mapped Assets associated with the record. */
            MappedAssets: number,
            /** Make associated with the record. */
            Make: string,
            /** Model associated with the record. */
            Model: string
        }
        /** Represents the detailed Location data contract. */
        export interface DetailedLocation {
            /** Unique identifier for the record. */
            ID: number,
            /** Location Key associated with the record. */
            LocationKey: string,
            /** Name displayed for the record. */
            Name: string,
            /** Description of the record. */
            Description: string,
            /** Alias associated with the record. */
            Alias: string,
            /** Short Name associated with the record. */
            ShortName: string,
            /** Longitude associated with the record. */
            Longitude: number,
            /** Latitude associated with the record. */
            Latitude: number,
            /** Meters associated with the record. */
            Meters: number,
            /** Assets associated with the record. */
            Assets: number
        }
		/** Represents the lSCVS Account data contract. */
		export interface LSCVSAccount {
			/** Unique identifier for the record. */
			ID: number,
			/** Identifier of the associated account. */
			AccountID: string,
			/** Identifier of the associated customer. */
			CustomerID: number
		}
	
		/** Represents the pQ Applications data contract. */
		export interface PQApplications {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Url associated with the record. */
			Url: string,
			/** Image associated with the record. */
			Image: string,
			/** Identifier of the associated category. */
			CategoryID: number,
			/** Sort Order associated with the record. */
			SortOrder: number
		}
		/** Represents the application Category data contract. */
		export interface ApplicationCategory {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Sort Order associated with the record. */
			SortOrder: number
		}
	}
}

export default SystemCenter;


