// ******************************************************************************************************
//  OpenXDA.ts - Gbtc
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

import PqDiff from "./PqDiff";


namespace OpenXDA {
    export namespace Lists {
        // Lists
        export const AssetTypes: Types.AssetTypeName[] = ['Line', 'LineSegment', 'Breaker', 'Bus', 'CapacitorBank', 'Transformer', 'CapacitorBankRelay' , 'DER', 'Generation', 'StationAux', 'StationBattery']
        export const MeasurementTypes: Types.MeasurementTypeName[] = (PqDiff.Lists.MeasurementTypes as Types.MeasurementTypeName[]).concat(['Digital']);
        export const MeasurementCharacteristics: Types.MeasurementCharacteristicName[] = (PqDiff.Lists.MeasurementCharacteristics as Types.MeasurementCharacteristicName[]).concat(['BreakerStatus', 'TCE']);
        export const Phases: Types.PhaseName[] = PqDiff.Lists.Phases;
        export const EventTypes: Types.EventTypeName[] = ['Sag', 'Swell', 'Transient', 'Fault', 'Interruption','RecloseIntoFault','BreakerOpen','Other','Test','Snapshot']
                export const NoteTypes = ['Meter', 'Event', 'Asset', 'Location', 'Customer', 'User', 'Company'] as Types.NoteTypeName[];
        export const NoteApplications = ['OpenMIC', 'OpenXDA', 'MiMD', 'SystemCenter', 'OpenHistorian', 'All'] as Types.NoteApplicationName[];
        export const NoteTags = ['General', 'Configuration', 'Diagnostic', 'Compliance'] as Types.NoteTagName[];
    }

    export namespace Types {
        // Types
        export type AssetTypeName = 'Line' | 'LineSegment' | 'Breaker' | 'Bus' | 'CapacitorBank' | 'Transformer' | 'CapacitorBankRelay' | 'DER' | 'Generation' | 'StationAux' | 'StationBattery'
        export type MeasurementTypeName = PqDiff.Types.MeasurementType | 'Digital';
        export type MeasurementCharacteristicName = PqDiff.Types.MeasurementCharacteristic | 'BreakerStatus' | 'TCE';
        export type PhaseName = PqDiff.Types.Phase;
        export type EventTypeName = 'Sag' | 'Swell' | 'Transient' | 'Fault' | 'Interruption' | 'RecloseIntoFault' | 'BreakerOpen' | 'Other' | 'Test' | 'Snapshot'
        export type NoteTypeName = 'Meter' | 'Event' | 'Asset' | 'Location' | 'Customer' | 'User' | 'Company'
        export type NoteApplicationName = 'OpenMIC' | 'OpenXDA' | 'MiMD' | 'SystemCenter' | 'OpenHistorian' | 'All' | 'SEbrowser'

        export type NoteTagName = 'General' | 'Configuration' | 'Diagnostic' | 'Compliance'
        export type DetailedAsset = (Breaker | Bus | CapBank | Line | Transformer | CapBankRelay | DER | Generation | StationAux | StationBattery)

        // Tables
        export interface EventType { ID: number, Name: EventTypeName, Description: string, Selected?: boolean, ShowInFilter: boolean, Category?: string  }
        export interface Meter { ID: number, AssetKey: string, Alias: string, Make: string, Model: string, Name: string, ShortName: string, TimeZone: string, LocationID: number, Description: string, Selected?: boolean }
        export interface Location { ID: number, LocationKey: string, Name: string, Alias: string, ShortName: string, Latitude: number, Longitude: number, Description: string }
        export interface Disturbance { ID: number, EventID: number, PhaseID: number, Magnitude: number, PerUnitMagnitude: number, DurationSeconds: number }
        export interface EDNAPoint { ID: number, BreakerID: number, Point: string }
        export interface Channel { ID: number, Meter: string, Asset: string, MeasurementType: string, MeasurementCharacteristic: string, Phase: string, Name: string, Adder: number, Multiplier: number, SamplesPerHour: number, PerUnitValue: number, HarmonicGroup: number, Description: string, Enabled: boolean, Series: Series[], ConnectionPriority: number, Trend: boolean }
        export interface Series { ID: number, ChannelID: number, SeriesType: string, SourceIndexes: string }
        export interface Note { ID: number, NoteTypeID: number, ReferenceTableID: number, Note: string, UserAccount?: string, Timestamp: string, NoteApplicationID: number, NoteTagID : number }
        export interface NoteApplication { ID: number, Name: NoteApplicationName }
        export interface NoteTag { ID: number, Name: NoteTagName }
        export interface Company { ID: number, CompanyTypeID: number, CompanyID: string, Name: string, Description: string }
        export interface CompanyMeter { ID: number, CompanyID: number, MeterID: number, DisplayName: string, Enabled: boolean }
        export interface Customer { ID: number, CustomerKey: string, Name: string, Phone: string, Description: string, LSCVS: boolean, PQIFacilityID: number   }
        export interface EventTag { ID: number, Name: string, Description: string, ShowInFilter: boolean }
        export interface MATLABAnalytic { ID: number, AssemblyName: string, MethodName: string, SettingSQL: string, LoadOrder: number }
        export interface MATLABAnalyticEventType { ID: number, MATLABAnalyticID: number, EventTypeID: number }
        export interface MATLABAnalyticAssetType { ID: number, MATLABAnalyticID: number, AssetTypeID: number }
        export interface MagDurCurve { ID: number, Name: string, Area: string, Color: string }

        // Assets
        export interface Asset { ID: number, VoltageKV: number, AssetKey: string, Description: string, AssetName: string, AssetType: AssetTypeName, Spare:boolean, Channels: Array<Channel> }
        export interface MeterAsset extends Asset { FaultDetectionLogic: string, Designation: string }
        export interface Breaker extends Asset { ThermalRating: number, Speed: number, TripTime: number, PickupTime: number, TripCoilCondition: number, EDNAPoint?: string, SpareBreakerID?: number, AirGapResistor: boolean }
        export interface Bus extends Asset { }
        export interface CapBank extends Asset {
            NumberOfBanks: number, CapacitancePerBank: number, CktSwitcher: string, MaxKV: number, UnitKV: number, UnitKVAr: number, NegReactanceTol: number, PosReactanceTol: number,
            Nparalell: number, Nseries: number, NSeriesGroup: number, NParalellGroup: number, Fused: boolean, VTratioBus: number, NumberLVCaps: number, NumberLVUnits: number, LVKVAr: number, LVKV: number,
            LVNegReactanceTol: number, LVPosReactanceTol: number, UpperXFRRatio: number, LowerXFRRatio: number, Nshorted: number, BlownFuses: number, BlownGroups: number, RelayPTRatioPrimary: number, Rv: number,
            Rh: number, Compensated: boolean, NLowerGroups: number, ShortedGroups: number, Sh: number, RelayPTRatioSecondary: number
        }
        export interface CapBankRelay extends Asset { OnVoltageThreshhold: number;  CapBankNumber: number }
        export interface Line extends Asset { MaxFaultDistance: number, MinFaultDistance: number, Detail: LineDetail }
        export interface LineSegment extends Asset { R0: number, X0: number, R1: number, X1: number, ThermalRating: number, Length: number, IsEnd: boolean, FromBus?: string, ToBus?: string }      
        export interface LineSegmentConnections {ID: number, ParentSegment: number, ChildSegment: number}
        export interface SourceImpedance { ID: number, AssetLocationID: number, RSrc: number, XSrc: number }
        export interface Transformer extends Asset { R0: number, X0: number, R1: number, X1: number, ThermalRating: number, PrimaryVoltageKV: number, SecondaryVoltageKV: number, Tap: number, TertiaryVoltageKV: number, SecondaryWinding: number, PrimaryWinding: number, TertiaryWinding: number }
        export interface LineDetail { R0: number, X0: number, R1: number, X1: number, ThermalRating: number, Length: number }
        export interface DER extends Asset { FullRatedOutputCurrent: number; VoltageLevel: 'Low' | 'Medium' }
        export interface Generation extends Asset { }
        export interface StationAux extends Asset { }
        export interface StationBattery extends Asset { }
        export interface AssetLocation { ID: number, AssetID: number, LocationID: number }
        export interface EventTypeAssetType { ID: number, EventTypeID: number, AssetTypeID: number }

        // Links
        export interface AssetConnection { ID: number, AssetRelationshipTypeID: number, Parent: string, Child: string }

        export interface Phase { ID: number, Name: PhaseName, Description: string }
        export interface MeasurementType { ID: number, Name: MeasurementTypeName, Description: string }
        export interface MeasurementCharacteristic { ID: number, Name: MeasurementCharacteristicName, Description: string }
        export interface AssetType { ID: number, Name: AssetTypeName, Description: string }
        export interface AssetConnectionType { ID: number, Name: string, Description: string, BiDirectional: boolean, JumpConnection: string, PassThrough: string }
        export interface NoteType { ID: number, Name: NoteTypeName, ReferenceTableName: string, Label?: string }

        export interface MeterConfiguration { ID: number, MeterID: number, DiffID: number, ConfigKey: string, ConfigText: string, RevisionMajor: number, RevisionMinor: number }
        export interface DataFile {
            ID: number,
            FileGroupID: number,
            FilePath: string,
            FilePathHash: number,
            FileSize: number,
            CreationTime: string,
            LastWriteTime: string,
            LastAccessTime: string,
            MeterID: number,
            DataStartTime: string,
            ProcessingEndTime: string,
            ProcessingState: number
        }

        export interface DataOperationFailure { ID: number, DataOperationID: number, DataOperationTypeName: string, FileGroupID: number, Log: string, StackTrace: string, TimeOfFailure: string }

        export interface CompanyType { ID: number, Name: string, Description: string }
        export interface CustomerAccess { ID: number, CustomerID: number, PQViewSiteID: number }

        // AssetGroups
        export interface AssetGroup { ID: number, Name: string, DisplayDashboard: boolean, AssetGroups: number, Meters: number, Assets: number, Users: number, DisplayEmail: boolean }

        export interface DataOperation { ID: number, AssemblyName: string, TypeName: string, LoadOrder: number }
        export interface DataReader { ID: number, FilePattern: string, AssemblyName: string, TypeName: string, LoadOrder: number }

		export interface RemoteXDAInstance { ID: number, Name: string, Address: string, Frequency: string, APIToken: string, RegistrationKey: string }
        export interface MetersToDataPush { ID: number, RemoteXDAInstanceID: number, LocalXDAMeterID: number, RemoteXDAMeterID: number, RemoteXDAName: string, RemoteXDAAssetKey: string, Obsfucate: boolean, Synced: boolean}
        export interface RemoteXDAMeter extends MetersToDataPush { LocalAlias: string, LocalMeterName: string, LocalAssetKey: string, RemoteAlias: string }
        export interface AssetsToDataPush { ID: number, RemoteXDAInstanceID: number, LocalXDAAssetID: number, RemoteXDAAssetID: number, RemoteXDAAssetKey: string, Obsfucate: boolean, Synced: boolean, RemoteAssetCreatedByDataPusher: boolean}
        export interface RemoteXDAAsset extends AssetsToDataPush { LocalAssetName: string, LocalAssetKey: string, RemoteAssetName: string, RemoteAssetKey: string }
    }
}
export default OpenXDA;
export { OpenXDA }

