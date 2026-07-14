// ******************************************************************************************************
//  PQBrowser.ts - Gbtc
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
//  08/01/2025 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************


namespace PQBrowser {
    export namespace Types {
		// Types
		/** Represents the trend Channel data contract. */
		export interface TrendChannel {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Description of the record. */
			Description: string,
			/** Identifier of the associated asset. */
			AssetID: number,
			/** Asset Key associated with the record. */
			AssetKey: string,
			/** Asset Name associated with the record. */
			AssetName: string,
			/** Identifier of the associated meter. */
			MeterID: number,
			/** Meter Key associated with the record. */
			MeterKey: string,
			/** Meter Name associated with the record. */
			MeterName: string,
			/** Meter Short Name associated with the record. */
			MeterShortName: string,
			/** Phase associated with the record. */
			Phase: string,
			/** Channel Group associated with the record. */
			ChannelGroup: string,
			/** Channel Group Type associated with the record. */
			ChannelGroupType: string,
			/** Unit associated with the record. */
			Unit: string,
			/** Series associated with the record. */
			Series: Series[]
		}
		/** Represents the series data contract. */
		export interface Series {
			/** Unique identifier for the record. */
			ID: number,
			/** Identifier of the associated channel. */
			ChannelID: number,
			/** Type Name associated with the record. */
			TypeName: string,
			/** Description of the type. */
			TypeDescription: string
		}
		/** Represents the widget View data contract. */
		export interface IWidgetView {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Type associated with the record. */
			Type: string,
			/** Setting associated with the record. */
			Setting: string,
			/** Identifier of the associated category. */
			CategoryID: number
		}
	}
}

export default PQBrowser;


