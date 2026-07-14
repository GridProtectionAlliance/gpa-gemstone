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
//  12/04/2024 - G. Santos
//       Refactored to fix performance issues.
//
//  ******************************************************************************************************

import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import * as React from 'react';
import * as ReactTableProps from './Types';

/**
 * Declares a typed table column consumed by the parent table component.
 * @param props - Column configuration and header content.
 * @returns Column header content for discovery by the table.
 */
export function Column<T>(props: React.PropsWithChildren<ReactTableProps.IColumn<T>>) {
    return <>{props.children}</>
}

export interface IHeaderWrapperProps {
    /**
     * Handles activation of the column header for sorting.
     * @param event - Mouse event raised by the header cell.
     */
    onSort: React.MouseEventHandler<HTMLTableCellElement>,
    /**
     * Optional handler that begins resizing the column.
     * @param event - Mouse event raised by the resize handle.
     */
    startAdjustment?: React.MouseEventHandler<HTMLDivElement>,
    /**
     * Indicates whether this column is the active sort column.
     */
    sorted: boolean,
    /**
     * Indicates whether the active sort direction is ascending.
     */
    asc: boolean,
    /**
     * CSS styles applied to the header cell.
     */
    style: React.CSSProperties,
    /**
     * Optional flag that permits sorting from this header, defaulting to true.
     */
    allowSort?: boolean,
    /**
     * Unique key used to identify the column header.
     */
    colKey: string
}

/**
 * Renders a sortable and optionally resizable table header cell.
 * @param props - Header state, styles, handlers, and content.
 * @returns Configured table header cell.
 */
export function ColumnHeaderWrapper(props: React.PropsWithChildren<IHeaderWrapperProps>) {
    const [showBorder, setShowBorder] = React.useState(false);

    const onHover = React.useCallback(() => { setShowBorder(true); }, []);
    const onLeave = React.useCallback(() => { setShowBorder(false); }, []);

    const onClickBorder = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (props.startAdjustment != null) props.startAdjustment(e);
    }, [props.startAdjustment]);

    const onClick = React.useCallback((e: React.MouseEvent<HTMLTableCellElement>) => {
        if (props.allowSort ?? true) props.onSort(e);
    }, [props.onSort, props.allowSort]);
    
    const preventPropagation = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }, []);

    return <th
        style={props.style}
        onClick={onClick}
        onDrag={(e) => { e.stopPropagation() }}
        id={props.colKey}
    >
        {props.startAdjustment == null ? <></> :
            <div style={{
                    width: 5,
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: showBorder ? 1 : 0,
                    background: '#e9ecef',
                    cursor: 'col-resize',
                }}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                onMouseDown={onClickBorder}
                onClick={preventPropagation}
            />
        }
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
    /**
     * Optional handler fired when dragging begins from the data cell.
     * @param e - Drag event raised by the cell.
     */
    dragStart?: (e: React.DragEvent) => void,
    /**
     * Optional handler fired when the data cell is clicked.
     * @param e - Mouse event raised by the cell.
     */
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    /**
     * CSS styles applied to the data cell.
     */
    style: React.CSSProperties
}

/**
 * Renders an interactive table data cell.
 * @param props - Cell styles, interaction handlers, and content.
 * @returns Configured table data cell.
 */
export function ColumnDataWrapper (props: React.PropsWithChildren<IDataWrapperProps>) {
    return (
        <td
            style={props.style}
            onClick={props.onClick}
            draggable={props.dragStart != undefined}
            onDragStart={props.dragStart}
        >
            {props.children}
        </td>
    );
}