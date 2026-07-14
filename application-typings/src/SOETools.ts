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
        /** Defines the supported measurement Type Name values. */
        export type MeasurementTypeName = 'Voltage' | 'Current';
        /** Defines the supported measurement Characteristic Name values. */
        export type MeasurementCharacteristicName = 'AngleFund' | 'WaveAmplitude' | 'WaveError' | 'RMS'| 'Instantaneous';
        /** Defines the supported phase Name values. */
        export type PhaseName = 'AN' | 'BN' | 'CN' | 'IN' | 'RES' | 'General1' | 'General2' | 'General3' | 'Worst';
    
        /** Represents the channel data contract. */
        export interface Channel {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated meter. */
            MeterID: number,
            /** Identifier of the associated line. */
            LineID: number,
            /** Identifier of the associated measurement Type. */
            MeasurementTypeID: number,
            /** Identifier of the associated measurement Characteristic. */
            MeasurementCharacteristicID: number,
            /** Identifier of the associated phase. */
            PhaseID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Samples Per Hour associated with the record. */
            SamplesPerHour: number,
            /** Per Unit Value associated with the record. */
            PerUnitValue: number,
            /** Harmonic Group associated with the record. */
            HarmonicGroup: number,
            /** Description of the record. */
            Description: string,
            /** Indicates whether the record is enabled. */
            Enabled: boolean
        }
    
        /** Represents the meter data contract. */
        export interface Meter {
            /** Unique identifier for the record. */
            ID: number,
            /** Asset Key associated with the record. */
            AssetKey: string,
            /** Identifier of the associated sub Station. */
            SubStationID: number,
            /** Identifier of the associated meter Location. */
            MeterLocationID: number,
            /** Identifier of the associated parent Normal. */
            ParentNormalID: number,
            /** Identifier of the associated parent Alternate. */
            ParentAlternateID: number,
            /** Identifier of the associated circuit. */
            CircuitID: number,
            /** Indicates whether normally Open. */
            IsNormallyOpen: boolean,
            /** Alias associated with the record. */
            Alias: string,
            /** Short Name associated with the record. */
            ShortName: string,
            /** Make associated with the record. */
            Make: string,
            /** Model associated with the record. */
            Model: string,
            /** Name displayed for the record. */
            Name: string,
            /** Time Zone associated with the record. */
            TimeZone: string,
            /** Description of the record. */
            Description: string,
            /** Phasing associated with the record. */
            Phasing: 'ABC' | 'BAC' | 'CAB' | 'CBA',
            /** Orientation associated with the record. */
            Orientation: 'XY' |'YX' | '',
            /** Extra Data associated with the record. */
            ExtraData: string
        }
    
        /** Represents the meter Location data contract. */
        export interface MeterLocation {
            /** Unique identifier for the record. */
            ID: number,
            /** Asset Key associated with the record. */
            AssetKey: string,
            /** Name displayed for the record. */
            Name: string,
            /** Alias associated with the record. */
            Alias: string,
            /** Short Name associated with the record. */
            ShortName: string,
            /** Latitude associated with the record. */
            Latitude: number,
            /** Longitude associated with the record. */
            Longitude: number,
            /** Description of the record. */
            Description: string
        }
        
        /** Represents the circuit data contract. */
        export interface Circuit{
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated system. */
            SystemID: number,
            /** Name displayed for the record. */
            Name: string
        }
        /** Represents the sub Station data contract. */
        export interface SubStation{
            /** Unique identifier for the record. */
            ID:number,
            /** Name displayed for the record. */
            Name: string
        }
        /** Represents the system data contract. */
        export interface System{
            /** Unique identifier for the record. */
            ID:number,
            /** Name displayed for the record. */
            Name: string
        }
    
        /** Represents the phase data contract. */
        export interface Phase {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: PhaseName,
            /** Description of the record. */
            Description: string
        }
        /** Represents the measurement Type data contract. */
        export interface MeasurementType {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: MeasurementTypeName,
            /** Description of the record. */
            Description: string
        }
        /** Represents the measurement Characteristic data contract. */
        export interface MeasurementCharacteristic {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: MeasurementCharacteristicName,
            /** Description of the record. */
            Description: string
        }

        /** Represents the sOE data contract. */
        export interface SOE {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Start Time associated with the record. */
            StartTime: string,
            /** End Time associated with the record. */
            EndTime: string,
            /** Status associated with the record. */
            Status: string,
            /** Time Windows associated with the record. */
            TimeWindows: number
        }
    }
    
}

export default SOETools;
