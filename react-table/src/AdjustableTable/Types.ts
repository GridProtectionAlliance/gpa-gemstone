// ******************************************************************************************************
//  Types.ts - Gbtc
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
//  12/06/2024 - G. Santos
//       Migrated props to namespace.
//
// ******************************************************************************************************

namespace ReactTableProps {
    export interface ITable<T> {
        /**
        * List of T objects used to generate rows
        */
        Data: T[];
        /**
        * Callback when the user clicks on a data entry
        * @param data contains the data including the columnKey
        * @param event the onClick Event to allow propagation as needed
        * @returns
        */
        OnClick?: (
            data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
            event: React.MouseEvent<HTMLElement, MouseEvent>,
        ) => void;
        /**
        * Key of the collumn to sort by
        */
        SortKey: string;
        /**
        * Boolen to indicate whether the sort is ascending or descending
        */
        Ascending: boolean;
        /**
        * Callback when the data should be sorted
        * @param data the information of the collumn including the Key of the collumn
        * @param event The onCLick event to allow Propagation as needed
        */
        OnSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>): void;
        /**
        * Class of the table component
        */
        TableClass?: string;
        /**
        * style of the table component
        */
        TableStyle?: React.CSSProperties;
        /**
        * style of the thead component
        */
        TheadStyle?: React.CSSProperties;
        /**
        * Class of the thead component
        */
        TheadClass?: string;
        /**
        * style of the tbody component
        * Note: Display style overwritten to "block"
        */
        TbodyStyle?: React.CSSProperties;
        /**
        * Class of the tbody component
        */
        TbodyClass?: string;
        /**
        * style of the tfoot component
        */
        TfootStyle?: React.CSSProperties;
        /**
        * Class of the tfoot component
        */
        TfootClass?: string;
    
        /**
        * determines if a row should be styled as selected
        * @param data the item to be checked
        * @returns true if the row should be styled as selected
        */
        Selected?: (data: T, index: number) => boolean;
        /**
        *
        * @param data the information of the row including the item of the row
        * @param e the event triggering this
        * @returns
        */
        OnDragStart?: (
            data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
            e: React.DragEvent<Element>,
        ) => void;
        /**
        * The default style for the tr element
        */
        RowStyle?: React.CSSProperties;
        /**
        * a Function that retrieves a unique key used for React key properties
        * @param data the item to be turned into a key
        * @returns a unique Key
        */
        KeySelector: (data: T, index?: number) => string | number;
        
        /**
        * Optional Element to display in the last row of the Table
        * use this for displaying warnings when the Table content gets cut off.
        * Data appears in the tfoot element
        */
        LastRow?: string | React.ReactNode;
        /**
        * Optional Element to display on upper Right corner
        */
        LastColumn?: string | React.ReactNode;
        
        /**
        * Optional Callback that gets called when there is not enough space to display columns
        * @param disabled takes in string of disabled keys
        */
        ReduceWidthCallback?: (disabled: string[]) => void;
    }

    export interface IColumn<T> {
        /**
         * a unique Key for this Collumn
         */
        Key: string;
        /**
         * Flag indicating whether sorting by this Collumn is allowed
         */
        AllowSort?: boolean;
        /**
         * Optional - the Field to be used 
         */
        Field?: keyof T;
        /**
         * The Default style for the th element
         */
        HeaderStyle?: React.CSSProperties;
        /**
         * The Default style for the td element
         */
        RowStyle?: React.CSSProperties;
        /**
         * Determines the Content to be displayed
         * @param d the data to be turned into content
         * @returns the content displayed
         */
        Content?: (d: { item: T, key: string, field: keyof T | undefined, index: number, style?: React.CSSProperties }) => React.ReactNode;
    }
}

export default ReactTableProps;