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

export function Column<T>(props: React.PropsWithChildren<ReactTableProps.IColumn<T>>) {
    return <>{props.children}</>
}

export interface IHeaderWrapperProps {
    onSort: React.MouseEventHandler<HTMLTableCellElement>,
    startAdjustment?: React.MouseEventHandler<HTMLDivElement>,
    sorted: boolean,
    asc: boolean,
    style: React.CSSProperties,
    allowSort?: boolean,
    colKey: string
}

export function ColumnHeaderWrapper(props: React.PropsWithChildren<IHeaderWrapperProps>) {
    const [showBorder, setShowBorder] = React.useState(false);

    const onHover = React.useCallback(() => { setShowBorder(true); }, []);
    const onLeave = React.useCallback(() => { setShowBorder(false); }, []);

    const onClickBorder = React.useCallback((e) => {
        if (props.startAdjustment != null) props.startAdjustment(e);
    }, [props.startAdjustment]);

    const onClick = React.useCallback((e) => {
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
    dragStart?: (e: React.DragEvent) => void,
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    style: React.CSSProperties
}

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