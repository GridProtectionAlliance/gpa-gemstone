// ******************************************************************************************************
//  OpenHistorian.ts - Gbtc
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
//  09/30/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

namespace OpenHistorian{
    export namespace Types{
        /** Represents the historian data contract. */
        export interface iHistorian {
            /** Identifier of the associated node. */
            NodeID: string,
            /** Unique identifier for the record. */
            ID: string,
            /** Acronym associated with the record. */
            Acronym: string,
            /** Name displayed for the record. */
            Name: string,
            /** Assembly Name associated with the record. */
            AssemblyName: string,
            /** Type Name associated with the record. */
            TypeName: string,
            /** Connection String associated with the record. */
            ConnectionString: string,
            /** Indicates whether local. */
            IsLocal: boolean,
            /** Measurement Reporting Interval associated with the record. */
            MeasurementReportingInterval: number,
            /** Description of the record. */
            Description: string,
            /** Load Order associated with the record. */
            LoadOrder: number,
            /** Indicates whether the record is enabled. */
            Enabled: boolean,
            /** Created On associated with the record. */
            CreatedOn: string,
            /** Created By associated with the record. */
            CreatedBy: string,
            /** Updated On associated with the record. */
            UpdatedOn: string,
            /** Updated By associated with the record. */
            UpdatedBy: string
        }
        /** Represents the active Measurement data contract. */
        export interface iActiveMeasurement {
            /** Identifier of the associated node. */
            NodeID: string,
            /** Identifier of the associated source Node. */
            SourceNodeID: string,
            /** Unique identifier for the record. */
            ID: string,
            /** Identifier of the associated signal. */
            SignalID: string,
            /** Point Tag associated with the record. */
            PointTag: string,
            /** Alternate Tag associated with the record. */
            AlternateTag: string,
            /** Signal Reference associated with the record. */
            SignalReference: string,
            /** Internal associated with the record. */
            Internal: boolean,
            /** Subscribed associated with the record. */
            Subscribed: boolean,
            /** Device associated with the record. */
            Device: string,
            /** Identifier of the associated device. */
            DeviceID: number,
            /** Frames Per Second associated with the record. */
            FramesPerSecond: number,
            /** Protocol associated with the record. */
            Protocol: string,
            /** Signal Type associated with the record. */
            SignalType: SignalType,
            /** Engineering Units associated with the record. */
            EngineeringUnits: string,
            /** Identifier of the associated phasor. */
            PhasorID: number,
            /** Phasor Type associated with the record. */
            PhasorType: string,
            /** Phase associated with the record. */
            Phase: Phase,
            /** Adder associated with the record. */
            Adder: number,
            /** Multiplier associated with the record. */
            Multiplier: number,
            /** Company associated with the record. */
            Company: string,
            /** Longitude associated with the record. */
            Longitude: number,
            /** Latitude associated with the record. */
            Latitude: number,
            /** Description of the record. */
            Description: string,
            /** Updated On associated with the record. */
            UpdatedOn: string
        }
    
        
        /** Defines the supported signal Type values. */
        export type SignalType = 'IPHM' | 'IPHA' | 'VPHM' | 'VPHA' | 'FREQ' | 'DFDT' | 'ALOG' | 'FLAG' | 'DIGI' | 'CALC' | 'STAT' | 'ALARM' | 'QUAL'
        /** Defines the supported phase values. */
        export type Phase = 'A' | 'B' | 'C' | '+' | '-' | '0' | 'None' 
    }
    
    export namespace Lists{

        export const SignalTypes: Types.SignalType[] = ['IPHM' , 'IPHA' , 'VPHM' , 'VPHA' , 'FREQ' , 'DFDT' , 'ALOG' , 'FLAG' , 'DIGI' , 'CALC' , 'STAT' , 'ALARM' , 'QUAL']
        export const Phases: Types.Phase[] = ['A' , 'B' , 'C' , '+' , '-' , '0' , 'None']   
    }
}

export default OpenHistorian;
