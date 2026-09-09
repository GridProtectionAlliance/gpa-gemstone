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
        /** Defines the supported asset Type Name values. */
        export type AssetTypeName = 'Line' | 'LineSegment' | 'Breaker' | 'Bus' | 'CapacitorBank' | 'Transformer' | 'CapacitorBankRelay' | 'DER' | 'Generation' | 'StationAux' | 'StationBattery'
        /** Defines the supported measurement Type Name values. */
        export type MeasurementTypeName = PqDiff.Types.MeasurementType | 'Digital';
        /** Defines the supported measurement Characteristic Name values. */
        export type MeasurementCharacteristicName = PqDiff.Types.MeasurementCharacteristic | 'BreakerStatus' | 'TCE';
        /** Defines the phase Name type. */
        export type PhaseName = PqDiff.Types.Phase;
        /** Defines the supported event Type Name values. */
        export type EventTypeName = 'Sag' | 'Swell' | 'Transient' | 'Fault' | 'Interruption' | 'RecloseIntoFault' | 'BreakerOpen' | 'Other' | 'Test' | 'Snapshot'
        /** Defines the supported note Type Name values. */
        export type NoteTypeName = 'Meter' | 'Event' | 'Asset' | 'Location' | 'Customer' | 'User' | 'Company'
        /** Defines the supported note Application Name values. */
        export type NoteApplicationName = 'OpenMIC' | 'OpenXDA' | 'MiMD' | 'SystemCenter' | 'OpenHistorian' | 'All' | 'SEbrowser'

        /** Defines the supported note Tag Name values. */
        export type NoteTagName = 'General' | 'Configuration' | 'Diagnostic' | 'Compliance'
        /** Defines the detailed Asset type. */
        export type DetailedAsset = (Breaker | Bus | CapBank | Line | Transformer | CapBankRelay | DER | Generation | StationAux | StationBattery)

        // Tables
        /** Represents the event Type data contract. */
        export interface EventType {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: EventTypeName,
            /** Description of the record. */
            Description: string,
            /** Indicates whether the record is selected. */
            Selected?: boolean,
            /** Indicates whether in Filter is displayed. */
            ShowInFilter: boolean,
            /** Optional category. */
            Category?: string
        }
        /** Represents the event Search data contract. */
        export interface EventSearch {
            /** Unique identifier for the record. */
            ID: number,
            /** Start Time associated with the record. */
            StartTime: string,
            /** End Time associated with the record. */
            EndTime: string,
            /** Phase associated with the record. */
            Phase: string,
            /** Identifier of the associated meter. */
            MeterID: number,
            /** Meter Name associated with the record. */
            MeterName: string,
            /** Event Type associated with the record. */
            EventType: string,
            /** Identifier of the associated event Type. */
            EventTypeID: number,
            /** Per Unit Magnitude associated with the record. */
            PerUnitMagnitude: number,
            /** Duration Seconds associated with the record. */
            DurationSeconds: number
        }
        /** Represents the meter data contract. */
        export interface Meter {
            /** Unique identifier for the record. */
            ID: number,
            /** Asset Key associated with the record. */
            AssetKey: string,
            /** Alias associated with the record. */
            Alias: string,
            /** Make associated with the record. */
            Make: string,
            /** Model associated with the record. */
            Model: string,
            /** Name displayed for the record. */
            Name: string,
            /** Short Name associated with the record. */
            ShortName: string,
            /** Time Zone associated with the record. */
            TimeZone: string,
            /** Identifier of the associated location. */
            LocationID: number,
            /** Description of the record. */
            Description: string,
            /** Indicates whether the record is selected. */
            Selected?: boolean
        }
        /** Represents the location data contract. */
        export interface Location {
            /** Unique identifier for the record. */
            ID: number,
            /** Location key associated with the record. */
            LocationKey: string,
            /** Name displayed for the record. */
            Name: string,
            /** Alternate name for the location. */
            Alias: string,
            /** Abbreviated location name. */
            ShortName: string,
            /** Geographic latitude of the location. */
            Latitude: number,
            /** Geographic longitude of the location. */
            Longitude: number,
            /** Description of the location. */
            Description: string
        }
        /** Represents a recorded disturbance. */
        export interface Disturbance {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated event. */
            EventID: number,
            /** Identifier of the associated phase. */
            PhaseID: number,
            /** Disturbance magnitude. */
            Magnitude: number,
            /** Disturbance magnitude expressed in per-unit values. */
            PerUnitMagnitude: number,
            /** Duration of the disturbance, in seconds. */
            DurationSeconds: number
        }
        /** Represents a SCADA point associated with a breaker. */
        export interface SCADAPoint {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated breaker. */
            BreakerID: number,
            /** SCADA point name. */
            Point: string
        }
        /** Represents a measurement channel. */
        export interface Channel {
            /** Unique identifier for the record. */
            ID: number,
            /** Meter associated with the channel. */
            Meter: string,
            /** Asset associated with the channel. */
            Asset: string,
            /** Measurement type recorded by the channel. */
            MeasurementType: string,
            /** Measurement characteristic recorded by the channel. */
            MeasurementCharacteristic: string,
            /** Phase measured by the channel. */
            Phase: string,
            /** Channel name. */
            Name: string,
            /** Value added during channel scaling. */
            Adder: number,
            /** Value multiplied during channel scaling. */
            Multiplier: number,
            /** Number of samples recorded per hour. */
            SamplesPerHour: number,
            /** Per-unit channel value. */
            PerUnitValue: number,
            /** Harmonic group assigned to the channel. */
            HarmonicGroup: number,
            /** Description of the channel. */
            Description: string,
            /** Indicates whether the channel is enabled. */
            Enabled: boolean,
            /** Series associated with the channel. */
            Series: Series[],
            /** Priority used when selecting a connection. */
            ConnectionPriority: number,
            /** Indicates whether the channel contains trend data. */
            Trend: boolean
        }
        /** Represents a series associated with a measurement channel. */
        export interface Series {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated channel. */
            ChannelID: number,
            /** Series classification. */
            SeriesType: string,
            /** Source indexes included in the series. */
            SourceIndexes: string
        }
        /** Represents a note attached to an application record. */
        export interface Note {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the note type. */
            NoteTypeID: number,
            /** Identifier of the referenced record. */
            ReferenceTableID: number,
            /** Note text. */
            Note: string,
            /** Optional account that created the note. */
            UserAccount?: string,
            /** Time when the note was recorded. */
            Timestamp: string,
            /** Identifier of the originating application. */
            NoteApplicationID: number,
            /** Identifier of the note tag. */
            NoteTagID : number
        }
        /** Represents an application available as a note source. */
        export interface NoteApplication {
            /** Unique identifier for the record. */
            ID: number,
            /** Application name. */
            Name: NoteApplicationName
        }
        /** Represents a note classification tag. */
        export interface NoteTag {
            /** Unique identifier for the record. */
            ID: number,
            /** Tag name. */
            Name: NoteTagName
        }
        /** Represents a company record. */
        export interface Company {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the company type. */
            CompanyTypeID: number,
            /** External company identifier. */
            CompanyID: string,
            /** Company name. */
            Name: string,
            /** Description of the company. */
            Description: string
        }
        /** Associates a company with a meter. */
        export interface CompanyMeter {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the company. */
            CompanyID: number,
            /** Identifier of the meter. */
            MeterID: number,
            /** Meter name displayed for the company. */
            DisplayName: string,
            /** Indicates whether the association is enabled. */
            Enabled: boolean
        }
        /** Represents a customer record. */
        export interface Customer {
            /** Unique identifier for the record. */
            ID: number,
            /** Customer lookup key. */
            CustomerKey: string,
            /** Customer name. */
            Name: string,
            /** Customer telephone number. */
            Phone: string,
            /** Description of the customer. */
            Description: string,
            /** Indicates whether LSCVS integration is enabled. */
            LSCVS: boolean,
            /** Identifier of the associated PQI facility. */
            PQIFacilityID: number
        }
        /** Represents a tag that can be assigned to events. */
        export interface EventTag {
            /** Unique identifier for the record. */
            ID: number,
            /** Tag name. */
            Name: string,
            /** Description of the tag. */
            Description: string,
            /** Indicates whether the tag appears in filters. */
            ShowInFilter: boolean
        }
        /** Represents the event Event Tag data contract. */
        export interface EventEventTag {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated event. */
            EventID: number,
            /** Identifier of the associated event Tag. */
            EventTagID: number,
            /** Tag Data associated with the record. */
            TagData: string,
            /** Tag Name associated with the record. */
            TagName: string
        }
        /** Represents the mATLAB Analytic data contract. */
        export interface MATLABAnalytic {
            /** Unique identifier for the record. */
            ID: number,
            /** Assembly Name associated with the record. */
            AssemblyName: string,
            /** Method Name associated with the record. */
            MethodName: string,
            /** Setting SQL associated with the record. */
            SettingSQL: string,
            /** Load Order associated with the record. */
            LoadOrder: number
        }
        /** Represents the mATLAB Analytic Event Type data contract. */
        export interface MATLABAnalyticEventType {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated mATLAB Analytic. */
            MATLABAnalyticID: number,
            /** Identifier of the associated event Type. */
            EventTypeID: number
        }
        /** Represents the mATLAB Analytic Asset Type data contract. */
        export interface MATLABAnalyticAssetType {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated mATLAB Analytic. */
            MATLABAnalyticID: number,
            /** Identifier of the associated asset Type. */
            AssetTypeID: number
        }
        /** Represents the mag Dur Curve data contract. */
        export interface MagDurCurve {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Area associated with the record. */
            Area: string,
            /** Color associated with the record. */
            Color: string
        }

        // Assets
        /** Represents the asset data contract. */
        export interface Asset {
            /** Unique identifier for the record. */
            ID: number,
            /** Voltage KV associated with the record. */
            VoltageKV: number,
            /** Asset Key associated with the record. */
            AssetKey: string,
            /** Description of the record. */
            Description: string,
            /** Asset Name associated with the record. */
            AssetName: string,
            /** Asset Type associated with the record. */
            AssetType: AssetTypeName,
            /** Indicates whether the record is spare. */
            Spare:boolean,
            /** Channels associated with the record. */
            Channels: Array<Channel>
        }
        /** Represents the meter Asset data contract. */
        export interface MeterAsset extends Asset {
            /** Fault Detection Logic associated with the record. */
            FaultDetectionLogic: string,
            /** Designation associated with the record. */
            Designation: string
        }
        /** Represents the breaker data contract. */
        export interface Breaker extends Asset {
            /** Thermal Rating associated with the record. */
            ThermalRating: number,
            /** Speed associated with the record. */
            Speed: number,
            /** Trip Time associated with the record. */
            TripTime: number,
            /** Pickup Time associated with the record. */
            PickupTime: number,
            /** Trip Coil Condition associated with the record. */
            TripCoilCondition: number,
            /** Optional sCADA Point. */
            SCADAPoint?: string,
            /** Identifier of the associated spare Breaker. */
            SpareBreakerID?: number,
            /** Air Gap Resistor associated with the record. */
            AirGapResistor: boolean
        }
        /** Represents the bus data contract. */
        export interface Bus extends Asset {
        }
        /** Represents the cap Bank data contract. */
        export interface CapBank extends Asset {
            /** Number Of Banks associated with the record. */
            NumberOfBanks: number,
            /** Capacitance Per Bank associated with the record. */
            CapacitancePerBank: number,
            /** Ckt Switcher associated with the record. */
            CktSwitcher: string,
            /** Max KV associated with the record. */
            MaxKV: number,
            /** Unit KV associated with the record. */
            UnitKV: number,
            /** Unit KV Ar associated with the record. */
            UnitKVAr: number,
            /** Neg Reactance Tol associated with the record. */
            NegReactanceTol: number,
            /** Pos Reactance Tol associated with the record. */
            PosReactanceTol: number,
            /** Nparalell associated with the record. */
            Nparalell: number,
            /** Nseries associated with the record. */
            Nseries: number,
            /** N Series Group associated with the record. */
            NSeriesGroup: number,
            /** N Paralell Group associated with the record. */
            NParalellGroup: number,
            /** Indicates whether the record is fused. */
            Fused: boolean,
            /** V Tratio Bus associated with the record. */
            VTratioBus: number,
            /** Number LV Caps associated with the record. */
            NumberLVCaps: number,
            /** Number LV Units associated with the record. */
            NumberLVUnits: number,
            /** LVKV Ar associated with the record. */
            LVKVAr: number,
            /** LVKV associated with the record. */
            LVKV: number,
            /** LV Neg Reactance Tol associated with the record. */
            LVNegReactanceTol: number,
            /** LV Pos Reactance Tol associated with the record. */
            LVPosReactanceTol: number,
            /** Upper XFR Ratio associated with the record. */
            UpperXFRRatio: number,
            /** Lower XFR Ratio associated with the record. */
            LowerXFRRatio: number,
            /** Nshorted associated with the record. */
            Nshorted: number,
            /** Blown Fuses associated with the record. */
            BlownFuses: number,
            /** Blown Groups associated with the record. */
            BlownGroups: number,
            /** Relay PT Ratio Primary associated with the record. */
            RelayPTRatioPrimary: number,
            /** Rv associated with the record. */
            Rv: number,
            /** Rh associated with the record. */
            Rh: number,
            /** Indicates whether the record is compensated. */
            Compensated: boolean,
            /** N Lower Groups associated with the record. */
            NLowerGroups: number,
            /** Shorted Groups associated with the record. */
            ShortedGroups: number,
            /** Sh associated with the record. */
            Sh: number,
            /** Relay PT Ratio Secondary associated with the record. */
            RelayPTRatioSecondary: number
        }
        /** Represents the cap Bank Relay data contract. */
        export interface CapBankRelay extends Asset {
            /** On Voltage Threshhold associated with the record. */
            OnVoltageThreshhold: number;
            /** Cap Bank Number associated with the record. */
            CapBankNumber: number
        }
        /** Represents the line data contract. */
        export interface Line extends Asset {
            /** Max Fault Distance associated with the record. */
            MaxFaultDistance: number,
            /** Min Fault Distance associated with the record. */
            MinFaultDistance: number,
            /** Detail associated with the record. */
            Detail: LineDetail
        }
        /** Represents the line Segment data contract. */
        export interface LineSegment extends Asset {
            /** R0 associated with the record. */
            R0: number,
            /** X0 associated with the record. */
            X0: number,
            /** R1 associated with the record. */
            R1: number,
            /** X1 associated with the record. */
            X1: number,
            /** Thermal Rating associated with the record. */
            ThermalRating: number,
            /** Length associated with the record. */
            Length: number,
            /** Indicates whether end. */
            IsEnd: boolean,
            /** Optional from Bus. */
            FromBus?: string,
            /** Optional to Bus. */
            ToBus?: string
        }
        /** Represents the line Segment Connections data contract. */
        export interface LineSegmentConnections {
            /** Unique identifier for the record. */
            ID: number,
            /** Parent Segment associated with the record. */
            ParentSegment: number,
            /** Child Segment associated with the record. */
            ChildSegment: number
        }
        /** Represents the source Impedance data contract. */
        export interface SourceImpedance {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated asset Location. */
            AssetLocationID: number,
            /** R Src associated with the record. */
            RSrc: number,
            /** X Src associated with the record. */
            XSrc: number
        }
        /** Represents the transformer data contract. */
        export interface Transformer extends Asset {
            /** R0 associated with the record. */
            R0: number,
            /** X0 associated with the record. */
            X0: number,
            /** R1 associated with the record. */
            R1: number,
            /** X1 associated with the record. */
            X1: number,
            /** Thermal Rating associated with the record. */
            ThermalRating: number,
            /** Primary Voltage KV associated with the record. */
            PrimaryVoltageKV: number,
            /** Secondary Voltage KV associated with the record. */
            SecondaryVoltageKV: number,
            /** Tap associated with the record. */
            Tap: number,
            /** Tertiary Voltage KV associated with the record. */
            TertiaryVoltageKV: number,
            /** Secondary Winding associated with the record. */
            SecondaryWinding: number,
            /** Primary Winding associated with the record. */
            PrimaryWinding: number,
            /** Tertiary Winding associated with the record. */
            TertiaryWinding: number
        }
        /** Represents the line Detail data contract. */
        export interface LineDetail {
            /** R0 associated with the record. */
            R0: number,
            /** X0 associated with the record. */
            X0: number,
            /** R1 associated with the record. */
            R1: number,
            /** X1 associated with the record. */
            X1: number,
            /** Thermal Rating associated with the record. */
            ThermalRating: number,
            /** Length associated with the record. */
            Length: number
        }
        /** Represents the dER data contract. */
        export interface DER extends Asset {
            /** Full Rated Output Current associated with the record. */
            FullRatedOutputCurrent: number;
            /** Voltage Level associated with the record. */
            VoltageLevel: 'Low' | 'Medium'
        }
        /** Represents the generation data contract. */
        export interface Generation extends Asset {
        }
        /** Represents the station Aux data contract. */
        export interface StationAux extends Asset {
        }
        /** Represents the station Battery data contract. */
        export interface StationBattery extends Asset {
        }
        /** Represents the asset Location data contract. */
        export interface AssetLocation {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated asset. */
            AssetID: number,
            /** Identifier of the associated location. */
            LocationID: number
        }
        /** Represents the event Type Asset Type data contract. */
        export interface EventTypeAssetType {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated event Type. */
            EventTypeID: number,
            /** Identifier of the associated asset Type. */
            AssetTypeID: number
        }

        // Links
        /** Represents the asset Connection data contract. */
        export interface AssetConnection {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated asset Relationship Type. */
            AssetRelationshipTypeID: number,
            /** Parent associated with the record. */
            Parent: string,
            /** Child associated with the record. */
            Child: string
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
        /** Represents the asset Type data contract. */
        export interface AssetType {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: AssetTypeName,
            /** Description of the record. */
            Description: string
        }
        /** Represents the asset Connection Type data contract. */
        export interface AssetConnectionType {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Description of the record. */
            Description: string,
            /** Indicates whether the record is bi Directional. */
            BiDirectional: boolean,
            /** Jump Connection associated with the record. */
            JumpConnection: string,
            /** Pass Through associated with the record. */
            PassThrough: string
        }
        /** Represents the note Type data contract. */
        export interface NoteType {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: NoteTypeName,
            /** Reference Table Name associated with the record. */
            ReferenceTableName: string,
            /** Optional label. */
            Label?: string
        }

        /** Represents the meter Configuration data contract. */
        export interface MeterConfiguration {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated meter. */
            MeterID: number,
            /** Identifier of the associated diff. */
            DiffID: number,
            /** Config Key associated with the record. */
            ConfigKey: string,
            /** Config Text associated with the record. */
            ConfigText: string,
            /** Revision Major associated with the record. */
            RevisionMajor: number,
            /** Revision Minor associated with the record. */
            RevisionMinor: number
        }
        /** Represents the data File data contract. */
        export interface DataFile {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated file Group. */
            FileGroupID: number,
            /** File Path associated with the record. */
            FilePath: string,
            /** File Path Hash associated with the record. */
            FilePathHash: number,
            /** File Size associated with the record. */
            FileSize: number,
            /** Creation Time associated with the record. */
            CreationTime: string,
            /** Last Write Time associated with the record. */
            LastWriteTime: string,
            /** Last Access Time associated with the record. */
            LastAccessTime: string,
            /** Identifier of the associated meter. */
            MeterID: number,
            /** Data Start Time associated with the record. */
            DataStartTime: string,
            /** Processing End Time associated with the record. */
            ProcessingEndTime: string,
            /** Processing State associated with the record. */
            ProcessingState: number
        }

        /** Represents the data Operation Failure data contract. */
        export interface DataOperationFailure {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated data Operation. */
            DataOperationID: number,
            /** Data Operation Type Name associated with the record. */
            DataOperationTypeName: string,
            /** Identifier of the associated file Group. */
            FileGroupID: number,
            /** Log associated with the record. */
            Log: string,
            /** Stack Trace associated with the record. */
            StackTrace: string,
            /** Time Of Failure associated with the record. */
            TimeOfFailure: string
        }

        /** Represents the company Type data contract. */
        export interface CompanyType {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Description of the record. */
            Description: string
        }
        /** Represents the customer Access data contract. */
        export interface CustomerAccess {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated customer. */
            CustomerID: number,
            /** Identifier of the associated pQ View Site. */
            PQViewSiteID: number
        }

        // AssetGroups
        /** Represents the asset Group data contract. */
        export interface AssetGroup {
            /** Unique identifier for the record. */
            ID: number,
            /** Name displayed for the record. */
            Name: string,
            /** Indicates whether dashboard is displayed. */
            DisplayDashboard: boolean,
            /** Asset Groups associated with the record. */
            AssetGroups: number,
            /** Meters associated with the record. */
            Meters: number,
            /** Assets associated with the record. */
            Assets: number,
            /** Users associated with the record. */
            Users: number,
            /** Indicates whether email is displayed. */
            DisplayEmail: boolean
        }

        /** Represents the data Operation data contract. */
        export interface DataOperation {
            /** Unique identifier for the record. */
            ID: number,
            /** Assembly Name associated with the record. */
            AssemblyName: string,
            /** Type Name associated with the record. */
            TypeName: string,
            /** Load Order associated with the record. */
            LoadOrder: number
        }
        /** Represents the data Reader data contract. */
        export interface DataReader {
            /** Unique identifier for the record. */
            ID: number,
            /** File Pattern associated with the record. */
            FilePattern: string,
            /** Assembly Name associated with the record. */
            AssemblyName: string,
            /** Type Name associated with the record. */
            TypeName: string,
            /** Load Order associated with the record. */
            LoadOrder: number
        }

		/** Represents the remote XDA Instance data contract. */
		export interface RemoteXDAInstance {
			/** Unique identifier for the record. */
			ID: number,
			/** Name displayed for the record. */
			Name: string,
			/** Address associated with the record. */
			Address: string,
			/** Frequency associated with the record. */
			Frequency: string,
			/** API Token associated with the record. */
			APIToken: string,
			/** Registration Key associated with the record. */
			RegistrationKey: string
		}
        /** Represents the meters To Data Push data contract. */
        export interface MetersToDataPush {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated remote XDA Instance. */
            RemoteXDAInstanceID: number,
            /** Identifier of the associated local XDA Meter. */
            LocalXDAMeterID: number,
            /** Identifier of the associated remote XDA Meter. */
            RemoteXDAMeterID: number,
            /** Remote XDA Name associated with the record. */
            RemoteXDAName: string,
            /** Remote XDA Asset Key associated with the record. */
            RemoteXDAAssetKey: string,
            /** Indicates whether the record is obsfucate. */
            Obsfucate: boolean,
            /** Indicates whether the record is synced. */
            Synced: boolean
        }
        /** Represents the remote XDA Meter data contract. */
        export interface RemoteXDAMeter extends MetersToDataPush {
            /** Local Alias associated with the record. */
            LocalAlias: string,
            /** Local Meter Name associated with the record. */
            LocalMeterName: string,
            /** Local Asset Key associated with the record. */
            LocalAssetKey: string,
            /** Remote Alias associated with the record. */
            RemoteAlias: string
        }
        /** Represents the assets To Data Push data contract. */
        export interface AssetsToDataPush {
            /** Unique identifier for the record. */
            ID: number,
            /** Identifier of the associated remote XDA Instance. */
            RemoteXDAInstanceID: number,
            /** Identifier of the associated local XDA Asset. */
            LocalXDAAssetID: number,
            /** Identifier of the associated remote XDA Asset. */
            RemoteXDAAssetID: number,
            /** Remote XDA Asset Key associated with the record. */
            RemoteXDAAssetKey: string,
            /** Indicates whether the record is obsfucate. */
            Obsfucate: boolean,
            /** Indicates whether the record is synced. */
            Synced: boolean,
            /** Remote Asset Created By Data Pusher associated with the record. */
            RemoteAssetCreatedByDataPusher: boolean
        }
        /** Represents the remote XDA Asset data contract. */
        export interface RemoteXDAAsset extends AssetsToDataPush {
            /** Local Asset Name associated with the record. */
            LocalAssetName: string,
            /** Local Asset Key associated with the record. */
            LocalAssetKey: string,
            /** Remote Asset Name associated with the record. */
            RemoteAssetName: string,
            /** Remote Asset Key associated with the record. */
            RemoteAssetKey: string
        }
    }
    export namespace Consts {
        export const DateTimeFormat = "YYYY-MM-DD[T]HH:mm:ss";
    }
}
export default OpenXDA;
export { OpenXDA }
