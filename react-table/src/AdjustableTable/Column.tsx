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
//
//  ******************************************************************************************************

import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
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
     * The Default style for the td element
     */
    RowStyle?: React.CSSProperties;
    /**
     * The Default style for the th element
     */
    HeaderStyle?: React.CSSProperties;
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

interface IHeaderWrapperProps<T> extends IColumnProps<T> {
    setWidth: (w: number) => void,
    width?: number,
    onSort: (key: string, event: any, field?: keyof T) => void,
    sorted: boolean,
    asc: boolean,
    fixedLayout: boolean,
} 

export function ColumnHeaderWrapper<T>(props: React.PropsWithChildren<IHeaderWrapperProps<T>>) {
    const thref = React.useRef(null);

    const style = (props.RowStyle !== undefined) ? {...props.HeaderStyle } : { };
    if (props.width !== undefined && props.fixedLayout){
        style.width = props.width;
        style.minWidth = props.width;
        style.maxWidth = props.width;
        style.overflowX = 'hidden';
        style.display = 'inline-block'
    }

    if (style.cursor === undefined && (props.AllowSort ?? true)) {
        style.cursor = 'pointer';
    }

    if (style.position === undefined) {
        style.position = 'relative';
    }

    if (style.borderTop === undefined) {
        style.borderTop = 'none'
    }

    React.useLayoutEffect(() => {
        if (thref.current == null || props.width !== undefined)
            return;
        const w = GetNodeSize(thref.current)?.width;
        if (w === undefined) return;
            props.setWidth(w);
    })
    
    const onClick = React.useCallback((e) => { 
        if (props.AllowSort ?? true) props.onSort(props.Key, e, props.Field);
        }, [props.onSort, props.AllowSort])

    return <th
                ref={thref}
                style={style}
                onClick={onClick}
                onDrag={(e) => {e.stopPropagation()}}
            >
            {props.sorted && !props.asc ? <div 
                style={{ position: 'absolute', width: 25 }}>
                    {SVGIcons.ArrowDropDown} 
                </div> : null}
            {props.sorted && props.asc ? <div 
                style={{ position: 'absolute', width: 25 }}>
                    {SVGIcons.ArrowDropUp} 
                </div> : null}
            <div style={{
                marginLeft: (props.sorted ? 25 : 0),
            }}>{props.children ?? props.Key}</div>
        </th>
}

interface IDataWrapperProps<T> extends IColumnProps<T> {
    width?: number,
    item: T,
    index: number,
    dragStart: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void,
    onClick?: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    fixedLayout: boolean
} 


export function ColumnDataWrapper<T>(props: IDataWrapperProps<T>) {

    const css = (props.RowStyle !== undefined) ? {...props.RowStyle } : { };
    if (props.width !== undefined && props.fixedLayout){
        css.width = props.width;
        css.minWidth = props.width;
        css.maxWidth = props.width;
        css.overflowX = 'hidden';
        css.display = 'inline-block'
    }

    if (props.dragStart !== undefined) css.cursor = "grab";

    const getFieldValue = () => props.Field !== undefined ? props.item[props.Field] : null;

    const getFieldContent = () => props.Content !== undefined ? props.Content({
        item: props.item, 
        key: props.Key, 
        field: props.Field, 
        style: css,
        index: props.index}) : getFieldValue();

    const onClick = React.useCallback((e) => {
        if (props.onClick !== undefined)
         props.onClick({
            colKey: props.Key, 
            colField: props.Field, 
            row: props.item,
             data: getFieldValue(),
              index: props.index
           }, e)
    }, [props.Key,props.Field, props.item,props.index, props.onClick])
      return (
        <td
            style={css}
            onClick={onClick}
            draggable={props.dragStart !== undefined}
            onDragStart={(e) => { props.dragStart!({
                 colKey: props.Key, 
                 colField: props.Field, 
                 row: props.item, 
                 data: getFieldValue(),
                 index: props.index 
                }, e); }}
        >
            {getFieldContent() as string}
        </td>
    );
}