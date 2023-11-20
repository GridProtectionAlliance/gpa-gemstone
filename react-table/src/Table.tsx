//  ******************************************************************************************************
//  Table.tsx - Gbtc
//
//  Copyright © 2018, Grid Protection Alliance.  All Rights Reserved.
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
//  08/02/2018 - Billy Ernest
//       Generated original version of source code.
//
//  ******************************************************************************************************

import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import * as React from 'react';

export interface Column<T> {
    key: string;
    label: string|React.ReactNode;
    field?: keyof T;
    headerStyle?: React.CSSProperties;
    rowStyle?: React.CSSProperties;
    content?(item: T, key: string, field: keyof T | undefined, style: React.CSSProperties, index: number): React.ReactNode;
}


export interface TableProps<T> {
    /**
     * List of Collumns in this Table
     */
    cols: Column<T>[];
    /**
     * List of T objects used to generate rows
     */
    data: T[];
    onClick?: (data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T] | null, index: number }, event: any) => void;
    /**
     * Key of the collumn to sort by
     */
    sortKey: string;
    /**
     * Boolen to indicate whether the sort is ascending or descending
     */
    ascending: boolean;
    onSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: any): void;
    tableClass?: string;
    tableStyle?: React.CSSProperties;
    theadStyle?: React.CSSProperties;
    theadClass?: string;
    tbodyStyle?: React.CSSProperties;
    tbodyClass?: string;
    selected?(data: T): boolean;
    onDragStart?:((data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void);
    rowStyle?: React.CSSProperties;
    keySelector?: (data: T) => string;
    /**
     * Optional Element to display in the last row of the Table
     * use this for displaying warnings when the Table content gets cut off
     */
    lastRow?: string|React.ReactNode;
}

export default function Table<T>(props: TableProps<T>) {

    return (
        <table className={props.tableClass !== undefined ? props.tableClass : ''} style={props.tableStyle}>
            <Header<T> Class={props.theadClass} Style={props.theadStyle} Cols={props.cols} SortKey={props.sortKey} Ascending={props.ascending} Click={(d, e) => handleSort(d, e)} />
            <Rows<T> 
            DragStart={props.onDragStart} Data={props.data} Cols={props.cols} RowStyle={props.rowStyle} BodyStyle={props.tbodyStyle} BodyClass={props.tbodyClass} Click={(data, e) => (props.onClick === undefined? null : props.onClick(data, e))} Selected={props.selected} KeySelector={props.keySelector} />
            {props.lastRow !== undefined? <tr style={(props.rowStyle !== undefined) ? { ...props.rowStyle } : {}} key={-1}>
                {props.lastRow}
            </tr> : null}
        </table>
    );
    
    function handleSort(
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) {
        if (data.colKey !== null)
            props.onSort(data,event);
    }
}

interface IRowProps<T> {
    Data: T[],
    Cols: Column<T>[],
    RowStyle?: React.CSSProperties,
    BodyStyle?: React.CSSProperties,
    BodyClass?: string,
    Click: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    DragStart?:((data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void)
    Selected?: ((data: T) => boolean);
    KeySelector?: (data: T) => string;
}
export function Rows<T>(props: IRowProps<T>) {

    if (props.Data.length === 0) return null;

    const rows = props.Data.map((item, rowIndex) => {
        const cells = props.Cols.map((colData) => {
            return <Cell<T> key={colData.key} Style={colData.rowStyle} DataKey={colData.key} DataField={colData.field} Object={item} RowIndex={rowIndex} Content={colData.content} Click={(data, e) => props.Click(data, e)} DragStart={props.DragStart} />
        });

        const style: React.CSSProperties = (props.RowStyle !== undefined) ? { ...props.RowStyle } : {};

        if (style.cursor === undefined)
            style.cursor = 'pointer';

        if (props.Selected !== undefined && props.Selected(item))
            style.backgroundColor = 'yellow';

        function ToKey(index: number, data: T): string {
            if (props.KeySelector === undefined)
                return index.toString();
            return props.KeySelector(data);

        }

        return (
            <tr style={style} key={ToKey(rowIndex, item)}>
                {cells}
            </tr>
        );
    });

    return (
        <tbody style={props.BodyStyle} className={props.BodyClass}>{rows}</tbody>
    );
}

interface ICellProps<T> {
    Style?: React.CSSProperties,
    DataKey: string,
    DataField?: keyof T,
    Object: T,
    RowIndex: number,
    Content?: ((item: T, key: string, field: keyof T | undefined, style: React.CSSProperties, index: number) => React.ReactNode),
    Click: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    DragStart?: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void,
}

function Cell<T>(props: ICellProps<T>) {
    const css: React.CSSProperties = (props.Style !== undefined) ? { ...props.Style } : {};
    if (props.DragStart !== undefined) css.cursor = "grab";

    const getFieldValue = () => props.DataField !== undefined ? props.Object[props.DataField] : null;

    const getFieldContent = () => props.Content !== undefined ? props.Content(props.Object, props.DataKey, props.DataField, css, props.RowIndex) : getFieldValue();

    return (
        <td
            style={css}
            onClick={(e) => props.Click({ colKey: props.DataKey, colField: props.DataField, row: props.Object, data: getFieldValue(), index: props.RowIndex }, e)}
            draggable={props.DragStart !== undefined} 
            onDragStart={(e) => { if (props.DragStart !== undefined) props.DragStart({ colKey: props.DataKey, colField: props.DataField, row: props.Object, data: getFieldValue(), index: props.RowIndex }, e);}}
        >
            {getFieldContent() as string}
        </td>
    );
}

interface IHeaderProps<T> {
    Class?: string,
    Style?: React.CSSProperties,
    Cols: Column<T>[],
    SortKey: string,
    Ascending: boolean,
    Click: (data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>) => void

}
export function Header<T>(props: IHeaderProps<T>) {

    return (<thead className={props.Class} style={props.Style}><tr>{props.Cols.map((col) => <HeaderCell key={col.key} HeaderStyle={col.headerStyle} DataKey={col.key} Click={(e) => props.Click({ colKey: col.key, colField: col.field, ascending: props.Ascending }, e)} Label={col.label} SortKey={props.SortKey} Ascending={props.Ascending} />)}</tr></thead>)

}

interface IHeaderCellProps {
    HeaderStyle?: React.CSSProperties,
    DataKey: string,
    Click: (e: any) => void,
    Label: string|React.ReactNode,
    SortKey: string,
    Ascending: boolean
}
function HeaderCell(props: IHeaderCellProps) {
    const style: React.CSSProperties = (props.HeaderStyle !== undefined) ? props.HeaderStyle : {};

    if (style.cursor === undefined && props.DataKey !== null) {
        style.cursor = 'pointer';
    }

    if (style.position === undefined) {
        style.position = 'relative';
    }

    return (
        <th
            style={style}
            onClick={(e) => props.Click(e)}
        >

           <RenderAngleIcon SortKey={props.SortKey} Key={props.DataKey} Ascending={props.Ascending} />
            <div style={{ marginLeft: (props.SortKey === props.DataKey? 25 : 0) }}>{props.Label}</div>
        </th>
    );
}

interface IRenderAngleProps {
    SortKey: string,
    Key: string,
    Ascending: boolean
}

function RenderAngleIcon(props: IRenderAngleProps) {

    const AngleIcon: React.FunctionComponent<{ ascending: boolean }> = (a) => a.ascending ? SVGIcons.ArrowDropUp : SVGIcons.ArrowDropDown;

    if (props.SortKey === null)
        return null;

    if (props.SortKey !== props.Key)
        return null;

    return  <div style={{position: 'absolute', width: 25}}>
        <AngleIcon ascending={props.Ascending} />
    </div>
}