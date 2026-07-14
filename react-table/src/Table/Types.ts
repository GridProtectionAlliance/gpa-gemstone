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

import { Search } from "@gpa-gemstone/react-interactive";
import { IUnit } from "../Filters/NumberFilter";

export interface ITable<T> {
    /**
     * Records rendered as table rows.
     */
    Data: T[];
    /**
     * Optional handler fired when a row or cell is clicked.
     * @param data - Row and column information for the clicked location.
     * @param event - Mouse event raised by the row or cell.
     */
    OnClick?: (
        data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    /**
     * Key of the column currently used to sort the table.
     */
    SortKey: string;
    /**
     * Indicates whether the active sort direction is ascending.
     */
    Ascending: boolean;
    /**
     * Handles a request to sort by a column.
     * @param data - Column and direction requested for sorting.
     * @param event - Mouse event raised by the column header.
     */
    OnSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Optional class name applied to the table element.
     */
    TableClass?: string;
    /**
     * Optional CSS styles applied to the table element.
     */
    TableStyle?: React.CSSProperties;
    /**
     * Optional CSS styles applied to the table header.
     */
    TheadStyle?: React.CSSProperties;
    /**
     * Optional class name applied to the table header.
     */
    TheadClass?: string;
    /**
     * Optional CSS styles applied to the table body; its display remains `block`.
     */
    TbodyStyle?: React.CSSProperties;
    /**
     * Optional class name applied to the table body.
     */
    TbodyClass?: string;
    /**
     * Optional CSS styles applied to the table footer.
     */
    TfootStyle?: React.CSSProperties;
    /**
     * Optional class name applied to the table footer.
     */
    TfootClass?: string;

    /**
     * Optional callback that determines whether a row uses selected styling.
     * @param data - Record represented by the row.
     * @param index - Position of the record in the table data.
     * @returns Whether the row is selected.
     */
    Selected?: (data: T, index: number) => boolean;
    /**
     * Optional handler fired when dragging begins from a table cell.
     * @param data - Row and column information for the dragged location.
     * @param e - Drag event raised by the cell.
     */
    OnDragStart?: (
        data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        e: React.DragEvent<Element>,
    ) => void;
    /**
     * Optional CSS styles applied to each table row.
     */
    RowStyle?: React.CSSProperties;
    /**
     * Produces a stable React key for a row.
     * @param data - Record represented by the row.
     * @param index - Optional position of the record in the table data.
     * @returns Key used to identify the rendered row.
     */
    KeySelector: (data: T, index?: number) => string | number;
    
    /**
     * Optional content displayed in the table footer, such as a truncation warning.
     */
    LastRow?: string | React.ReactNode;
    /**
     * Optional content displayed in the upper-right trailing column.
     */
    LastColumn?: string | React.ReactNode;
    
    /**
     * Optional callback fired when columns are hidden because the table is too narrow.
     * @param disabled - Keys of columns hidden to reduce the table width.
     */
    ReduceWidthCallback?: (disabled: string[]) => void;
    /**
     * Optional callback that applies filters edited through filterable columns.
     * @param filters - Complete filter definitions to apply.
     */
    SetFilters?: (filters: Search.IFilter<T>[]) => void;
    /**
     * Optional filter definitions currently applied to filterable columns.
     */
    Filters?: Search.IFilter<T>[];
}

export interface IColumn<T> {
    /**
     * Unique key used to identify the column.
     */
    Key: string;
    /**
     * Optional flag that permits sorting by the column, defaulting to true.
     */
    AllowSort?: boolean;
    /**
     * Optional record field whose value is displayed by the column.
     */
    Field?: keyof T;
    /**
     * Optional CSS styles applied to the column header.
     */
    HeaderStyle?: React.CSSProperties;
    /**
     * Optional CSS styles applied to the column's data cells.
     */
    RowStyle?: React.CSSProperties;
    /**
     * Optional callback that renders content for a data cell.
     * @param d - Record, field, key, index, and styles for the cell.
     * @returns Content displayed in the data cell.
     */
    Content?: (d: { item: T, key: string, field: keyof T | undefined, index: number, style?: React.CSSProperties }) => React.ReactNode;
    /**
     * Optional flag that allows the column width to be adjusted, defaulting to false.
     */
    Adjustable?: boolean
}

export interface IOptions { Value: string | number, Label: string }

export interface IFilterableCollumn<T> extends IColumn<T> {
    /**
     * Optional field type that determines which filter editor is displayed.
     */
    Type?: Search.FieldType, 
    /**
     * Optional values offered when the field uses an enumeration filter.
     */
    Enum?: IOptions[],
    /**
     * Optional detailed label shown inside the expanded filter menu.
     */
    ExpandedLabel?: string,
    /**
     * Optional units used to display and convert numeric filter values.
     */
    Unit?: IUnit[]
}