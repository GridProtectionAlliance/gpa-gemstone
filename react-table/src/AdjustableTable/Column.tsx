//  ******************************************************************************************************
//  Column.tsx - Gbtc
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
//  05/31/2024 - C. Lackner
//       Refactored to fix sizing issues.
//
//  ******************************************************************************************************

import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { GetNodeSize } from '@gpa-gemstone/helper-functions';
import * as React from 'react';


export interface IColumnProps<T> {
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
     * Determines the Content to be displaye
     * @param d the data to be turned into content
     * @returns the content displayed
     */
    Content?: (d: { item: T, key: string, field: keyof T | undefined, index: number, style?: React.CSSProperties }) => React.ReactNode;
}


export default function Column<T>(props: React.PropsWithChildren<IColumnProps<T>>) {
    return <>{props.children}</>
}

export interface IHeaderWrapperProps {
    setWidth: (w: number, a: boolean) => void,
    onSort: React.MouseEventHandler<HTMLTableCellElement>,
    sorted: boolean,
    asc: boolean,
    style: React.CSSProperties,
    allowSort?: boolean,
    colKey: string,
    width?: number,
    enabled: boolean,
    extraWidth: number
}

export function ColumnHeaderWrapper (props: React.PropsWithChildren<IHeaderWrapperProps>) {
    const thref = React.useRef(null);
    let isAuto = false;
    
    const style = (props.style !== undefined) ? { ...props.style } : {};

    style.overflowX = style.overflowX ?? 'hidden';
    style.display = style.display ?? 'inline-block'
    style.position = style.position ?? 'relative';
    style.borderTop = style.borderTop ?? 'none';

    if (style.width == 'auto') {
        isAuto = true;
    }

    if ((style.width == undefined || style.width == 'auto') && props.width !== undefined) {
        style.width = (props.width) + props.extraWidth;
    }

    if (style.cursor === undefined && (props.allowSort ?? true)) {
        style.cursor = 'pointer';
    }

    React.useLayoutEffect(() => {
        if (thref.current == null)
            return;
        const w = GetNodeSize(thref.current)?.width;
        if (props.width !== undefined && (w === undefined || w == (props.width + props.extraWidth))) return;
            props.setWidth(w, isAuto);
    })

    const onClick = React.useCallback((e) => {
        if (props.allowSort ?? true) props.onSort(e);
    }, [props.onSort, props.allowSort])


    if (props.width != undefined && !props.enabled)
        return null;

    return <th
        ref={thref}
        style={style}
        onClick={onClick}
        onDrag={(e) => { e.stopPropagation() }}
    >
        {props.sorted? <div
            style={{ position: 'absolute', width: 25 }}>
            {props.asc ? <ReactIcons.ArrowDropUp /> : <ReactIcons.ArrowDropDown />}
        </div> : null}
        <div style={{
            marginLeft: (props.sorted ? 25 : 0),
        }}>{props.children ?? props.colKey}</div>
    </th>
}

export interface IDataWrapperProps {
    setWidth: (w: number, a: boolean) => void,
    width?: number,
    enabled: boolean
    dragStart?: (e: React.DragEvent) => void,
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    style: React.CSSProperties,
    extraWidth: number
}


export function ColumnDataWrapper (props: React.PropsWithChildren<IDataWrapperProps>) {
    const tdref = React.useRef(null);
    const style = (props.style !== undefined) ? { ...props.style } : {};
    let isAuto = false;

    style.overflowX = style.overflowX ?? 'hidden';
    style.display = style.display ?? 'inline-block'

    if ((style.width == undefined || style.width == 'auto') && props.width !== undefined) {
        style.width = (props.width) + props.extraWidth;
    }

    if (style.width == 'auto') {
        isAuto = true;
    }

    if (props.dragStart !== undefined) style.cursor = "grab";

    React.useLayoutEffect(() => {
        if (tdref.current == null)
            return;
        const w = GetNodeSize(tdref.current)?.width;
        if (props.width !== undefined && (w === undefined || w == (props.width + props.extraWidth))) return;
            props.setWidth(w, isAuto);
    })

    if (props.width != undefined && !props.enabled)
        return null;

    return (
        <td
            ref={tdref}
            style={style}
            onClick={props.onClick}
            draggable={props.dragStart !== undefined}
            onDragStart={props.dragStart}
        >
            {props.children}
        </td>
    );
}