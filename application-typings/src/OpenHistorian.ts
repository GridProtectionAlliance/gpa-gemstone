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
        export interface iHistorian {
            NodeID: string, ID: string, Acronym: string, Name: string,
            AssemblyName: string, TypeName: string, ConnectionString: string, IsLocal: boolean, MeasurementReportingInterval: number, Description: string,
            LoadOrder: number, Enabled: boolean, CreatedOn: string, CreatedBy: string, UpdatedOn: string, UpdatedBy: string
        }
        export interface iActiveMeasurement {
            NodeID: string, SourceNodeID: string, ID: string, SignalID: string, PointTag: string, AlternateTag: string,
            SignalReference: string, Internal: boolean, Subscribed: boolean, Device: string, DeviceID: number, FramesPerSecond: number,
            Protocol: string, SignalType: SignalType, EngineeringUnits: string, PhasorID: number, PhasorType: string, Phase: Phase,
            Adder: number, Multiplier: number, Company: string, Longitude: number, Latitude: number, Description: string,
            UpdatedOn: string
        }
    
        
        export type SignalType = 'IPHM' | 'IPHA' | 'VPHM' | 'VPHA' | 'FREQ' | 'DFDT' | 'ALOG' | 'FLAG' | 'DIGI' | 'CALC' | 'STAT' | 'ALARM' | 'QUAL'
        export type Phase = 'A' | 'B' | 'C' | '+' | '-' | '0' | 'None' 
    }
    
    export namespace Lists{

        export const SignalTypes: Types.SignalType[] = ['IPHM' , 'IPHA' , 'VPHM' , 'VPHA' , 'FREQ' , 'DFDT' , 'ALOG' , 'FLAG' , 'DIGI' , 'CALC' , 'STAT' , 'ALARM' , 'QUAL']
        export const Phases: Types.Phase[] = ['A' , 'B' , 'C' , '+' , '-' , '0' , 'None']   
    }
}

export default OpenHistorian;
