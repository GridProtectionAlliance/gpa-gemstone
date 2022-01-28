declare namespace SystemCenter {
    namespace Lists {
        const AdditionalFieldTypes: Types.AdditionalFieldType[];
    }
    namespace Types {
        type AdditionalFieldType = 'integer' | 'number' | 'string' | 'boolean' | string;
        interface Setting {
            ID: number;
            Name: string;
            Value: string;
            DefaultValue: string;
        }
        interface AdditionalField {
            ID: number;
            ParentTable: string;
            FieldName: string;
            Type: AdditionalFieldType;
            ExternalDB?: string;
            ExternalDBTable?: string;
            ExternalDBTableKey?: string;
            IsSecure: boolean;
            Searchable: boolean;
        }
        interface AdditionalFieldValue {
            ID: number;
            ParentTableID: number;
            AdditionalFieldID: number;
            Value: string;
        }
        interface ValueListGroup {
            ID: number;
            Name: string;
            Description: string;
            Items?: ValueListItem[];
        }
        interface ValueListItem {
            ID: number;
            GroupID: number;
            AltValue: string;
            Value: string;
            SortOrder: number;
        }
        interface LSCVSAccount {
            ID: number;
            AccountID: number;
            CustomerID: number;
        }
        interface LocationDrawing {
            ID: number;
            LocationID: number;
            Name: string;
            Link: string;
            Description: string;
        }
        interface ExternalDB {
            name: string;
            lastupdate: Date;
        }
        interface ExternalDBField {
            DisplayName: string;
            FieldValueID: number;
            OpenXDAParentTableID: number;
            AdditionalFieldID: number;
            Value: string;
            FieldName: string;
            PreviousValue: string;
            Error: boolean;
            Message: string;
            isXDAField: boolean;
            Changed: boolean;
        }
        interface ExternalDataBaseTable {
            ID: number;
            TableName: string;
            ExternalDB: string;
            Query: string;
        }
        interface DetailedAsset {
            ID: number;
            AssetKey: string;
            AssetName: string;
            VoltageKV: number;
            AssetType: string;
            Meters: number;
            Locations: number;
        }
        interface DetailedMeter {
            ID: number;
            AssetKey: string;
            Name: string;
            Location: string;
            MappedAssets: number;
            Make: string;
            Model: string;
        }
        interface DetailedLocation {
            ID: number;
            LocationKey: string;
            Name: string;
            Description: string;
            Alias: string;
            ShortName: string;
            Longitude: number;
            Latitude: number;
            Meters: number;
            Assets: number;
        }
    }
}
export default SystemCenter;
