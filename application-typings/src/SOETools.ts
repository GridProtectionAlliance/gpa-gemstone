// ******************************************************************************************************
//  SOETools.ts - Gbtc
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


namespace SOETools {
    export namespace Lists{
        export const MeasurementTypes = ['Voltage' , 'Current'] as Types.MeasurementTypeName[];
        export const MeasurementCharacteristics = ['AngleFund' , 'WaveAmplitude' ,'WaveError' ,'RMS', 'Instantaneous'] as Types.MeasurementCharacteristicName[];
        export const Phases = ['AN' , 'BN' , 'CN' , 'IN' , 'RES' , 'General1' , 'General2' , 'General3' , 'Worst'] as Types.PhaseName[];    
    }
    
    export namespace Types {
        export type MeasurementTypeName = 'Voltage' | 'Current';
        export type MeasurementCharacteristicName = 'AngleFund' | 'WaveAmplitude' | 'WaveError' | 'RMS'| 'Instantaneous';
        export type PhaseName = 'AN' | 'BN' | 'CN' | 'IN' | 'RES' | 'General1' | 'General2' | 'General3' | 'Worst';
    
        export interface Channel { ID: number, MeterID: number, LineID: number, 
            MeasurementTypeID: number, MeasurementCharacteristicID: number, PhaseID: number, 
            Name: string, SamplesPerHour: number, PerUnitValue: number, HarmonicGroup: number, 
            Description: string, Enabled: boolean }
    
        export interface Meter { 
            ID: number, AssetKey: string, SubStationID: number, MeterLocationID: number, 
            ParentNormalID: number, ParentAlternateID: number, CircuitID: number, 
            IsNormallyOpen: boolean, Alias: string, ShortName: string, Make: string, 
            Model: string, Name: string, TimeZone: string, Description: string, 
            Phasing: 'ABC' | 'BAC' | 'CAB' | 'CBA', Orientation: 'XY' |'YX' | '',
            ExtraData: string }
    
        export interface MeterLocation { ID: number, AssetKey: string, Name: string, 
            Alias: string, ShortName: string, Latitude: number, Longitude: number, Description: string }
        
        export interface Circuit{ ID: number, SystemID: number, Name: string }
        export interface SubStation{ ID:number, Name: string}
        export interface System{ ID:number, Name: string}
    
        export interface Phase { ID: number, Name: PhaseName, Description: string }
        export interface MeasurementType { ID: number, Name: MeasurementTypeName, Description: string }
        export interface MeasurementCharacteristic { ID: number, Name: MeasurementCharacteristicName, Description: string }

        export interface SOE {ID: number, Name: string, StartTime: string, EndTime: string, Status: string, TimeWindows: number}
    }
    
}

export default SOETools;
