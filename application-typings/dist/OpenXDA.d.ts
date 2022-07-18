import PqDiff from "./PqDiff";
declare namespace OpenXDA {
    namespace Lists {
        const AssetTypes: Types.AssetTypeName[];
        const MeasurementTypes: Types.MeasurementTypeName[];
        const MeasurementCharacteristics: Types.MeasurementCharacteristicName[];
        const Phases: Types.PhaseName[];
        const EventTypes: Types.EventTypeName[];
        const NoteTypes: Types.NoteTypeName[];
        const NoteApplications: Types.NoteApplicationName[];
        const NoteTags: Types.NoteTagName[];
    }
    namespace Types {
        type AssetTypeName = 'Line' | 'LineSegment' | 'Breaker' | 'Bus' | 'CapacitorBank' | 'Transformer' | 'CapacitorBankRelay' | 'DER';
        type MeasurementTypeName = PqDiff.Types.MeasurementType | 'Digital';
        type MeasurementCharacteristicName = PqDiff.Types.MeasurementCharacteristic | 'BreakerStatus' | 'TCE';
        type PhaseName = PqDiff.Types.Phase;
        type EventTypeName = 'Sag' | 'Swell' | 'Transient' | 'Fault' | 'Interruption';
        type NoteTypeName = 'Meter' | 'Event' | 'Asset' | 'Location' | 'Customer' | 'User' | 'Company';
        type NoteApplicationName = 'OpenMIC' | 'OpenXDA' | 'MiMD' | 'SystemCenter' | 'OpenHistorian' | 'All' | 'SEbrowser';
        type NoteTagName = 'General' | 'Configuration' | 'Diagnostic' | 'Compliance';
        type DetailedAsset = (Breaker | Bus | CapBank | Line | Transformer | CapBankRelay | DER);
        interface EventType {
            ID: number;
            Name: EventTypeName;
            Description: string;
            Selected?: boolean;
        }
        interface Meter {
            ID: number;
            AssetKey: string;
            Alias: string;
            Make: string;
            Model: string;
            Name: string;
            ShortName: string;
            TimeZone: string;
            LocationID: number;
            Description: string;
            Selected?: boolean;
        }
        interface Location {
            ID: number;
            LocationKey: string;
            Name: string;
            Alias: string;
            ShortName: string;
            Latitude: number;
            Longitude: number;
            Description: string;
        }
        interface Disturbance {
            ID: number;
            EventID: number;
            PhaseID: number;
            Magnitude: number;
            PerUnitMagnitude: number;
            DurationSeconds: number;
        }
        interface EDNAPoint {
            ID: number;
            BreakerID: number;
            Point: string;
        }
        interface Channel {
            ID: number;
            Meter: string;
            Asset: string;
            MeasurementType: string;
            MeasurementCharacteristic: string;
            Phase: string;
            Name: string;
            Adder: number;
            Multiplier: number;
            SamplesPerHour: number;
            PerUnitValue: number;
            HarmonicGroup: number;
            Description: string;
            Enabled: boolean;
            Series: Series[];
            ConnectionPriority: number;
        }
        interface Series {
            ID: number;
            ChannelID: number;
            SeriesType: string;
            SourceIndexes: string;
        }
        interface Note {
            ID: number;
            NoteTypeID: number;
            ReferenceTableID: number;
            Note: string;
            UserAccount?: string;
            Timestamp: string;
            NoteApplicationID: number;
            NoteTagID: number;
        }
        interface NoteApplication {
            ID: number;
            Name: NoteApplicationName;
        }
        interface NoteTag {
            ID: number;
            Name: NoteTagName;
        }
        interface Company {
            ID: number;
            CompanyTypeID: number;
            CompanyID: string;
            Name: string;
            Description: string;
        }
        interface CompanyMeter {
            ID: number;
            CompanyID: number;
            MeterID: number;
            DisplayName: string;
            Enabled: boolean;
        }
        interface Customer {
            ID: number;
            CustomerKey: string;
            Name: string;
            Phone: string;
            Description: string;
            LSCVS: boolean;
        }
        interface Asset {
            ID: number;
            VoltageKV: number;
            AssetKey: string;
            Description: string;
            AssetName: string;
            AssetType: AssetTypeName;
            Spare: boolean;
            Channels: Array<Channel>;
        }
        interface Breaker extends Asset {
            ThermalRating: number;
            Speed: number;
            TripTime: number;
            PickupTime: number;
            TripCoilCondition: number;
            EDNAPoint?: string;
            SpareBreakerID?: number;
            AirGapResistor: boolean;
        }
        interface Bus extends Asset {
        }
        interface CapBank extends Asset {
            NumberOfBanks: number;
            CapacitancePerBank: number;
            CktSwitcher: string;
            MaxKV: number;
            UnitKV: number;
            UnitKVAr: number;
            NegReactanceTol: number;
            PosReactanceTol: number;
            Nparalell: number;
            Nseries: number;
            NSeriesGroup: number;
            NParalellGroup: number;
            Fused: boolean;
            VTratioBus: number;
            NumberLVCaps: number;
            NumberLVUnits: number;
            LVKVAr: number;
            LVKV: number;
            LVNegReactanceTol: number;
            LVPosReactanceTol: number;
            UpperXFRRatio: number;
            LowerXFRRatio: number;
            Nshorted: number;
            BlownFuses: number;
            BlownGroups: number;
            RelayPTRatioPrimary: number;
            Rv: number;
            Rh: number;
            Compensated: boolean;
            NLowerGroups: number;
            ShortedGroups: number;
            Sh: number;
            RelayPTRatioSecondary: number;
        }
        interface CapBankRelay extends Asset {
            OnVoltageThreshhold: number;
            CapBankNumber: number;
        }
        interface Line extends Asset {
            MaxFaultDistance: number;
            MinFaultDistance: number;
            Detail: LineDetail;
        }
        interface LineSegment extends Asset {
            R0: number;
            X0: number;
            R1: number;
            X1: number;
            ThermalRating: number;
            Length: number;
            IsEnd: boolean;
        }
        interface Transformer extends Asset {
            R0: number;
            X0: number;
            R1: number;
            X1: number;
            ThermalRating: number;
            PrimaryVoltageKV: number;
            SecondaryVoltageKV: number;
            Tap: number;
            TertiaryVoltageKV: number;
            SecondaryWinding: number;
            PrimaryWinding: number;
            TertiaryWinding: number;
        }
        interface LineDetail {
            R0: number;
            X0: number;
            R1: number;
            X1: number;
            ThermalRating: number;
            Length: number;
        }
        interface DER extends Asset {
            FullRatedOutputCurrent: number;
            VoltageLevel: 'Low' | 'Medium';
        }
        interface AssetConnection {
            ID: number;
            AssetRelationshipTypeID: number;
            Parent: string;
            Child: string;
        }
        interface Phase {
            ID: number;
            Name: PhaseName;
            Description: string;
        }
        interface MeasurementType {
            ID: number;
            Name: MeasurementTypeName;
            Description: string;
        }
        interface MeasurementCharacteristic {
            ID: number;
            Name: MeasurementCharacteristicName;
            Description: string;
        }
        interface AssetType {
            ID: number;
            Name: AssetTypeName;
            Description: string;
        }
        interface AssetConnectionType {
            ID: number;
            Name: string;
            Description: string;
            BiDirectional: boolean;
            JumpConnection: string;
            PassThrough: string;
        }
        interface NoteType {
            ID: number;
            Name: NoteTypeName;
            ReferenceTableName: string;
        }
        interface MeterConfiguration {
            ID: number;
            MeterID: number;
            DiffID: number;
            ConfigKey: string;
            ConfigText: string;
            RevisionMajor: number;
            RevisionMinor: number;
        }
        interface DataFile {
            ID: number;
            FileGroupID: number;
            FilePath: string;
            FilePathHash: number;
            FileSize: number;
            CreationTime: string;
            LastWriteTime: string;
            LastAccessTime: string;
            MeterID: number;
            DataStartTime: string;
            ProcessingEndTime: string;
        }
        interface CompanyType {
            ID: number;
            Name: string;
            Description: string;
        }
        interface CustomerAccess {
            ID: number;
            CustomerID: number;
            PQViewSiteID: number;
        }
        interface AssetGroup {
            ID: number;
            Name: string;
            DisplayDashboard: boolean;
            AssetGroups: number;
            Meters: number;
            Assets: number;
            Users: number;
        }
        interface DataOperation {
            ID: number;
            AssemblyName: string;
            TypeName: string;
            LoadOrder: number;
        }
        interface DataReader {
            ID: number;
            FilePattern: string;
            AssemblyName: string;
            TypeName: string;
            LoadOrder: number;
        }
    }
}
export default OpenXDA;
export { OpenXDA };
