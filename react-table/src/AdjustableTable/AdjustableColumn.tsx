//  ******************************************************************************************************
//  AdjustableColumn.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  11/19/2023 - C. Lackner
//       Generated original version of source code.
//  05/31/2024 - C. Lackner
//       Refactored to fix sizing issues.
//
//  ******************************************************************************************************
import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import { GetNodeSize } from '@gpa-gemstone/helper-functions';
import * as React from 'react';
import { IColumnProps, IDataWrapperProps, IHeaderWrapperProps } from './Column';


export default function AdjustableColumn<T>(props: React.PropsWithChildren<IColumnProps<T>>) {
    return <>{props.children}</>
}


interface IAdjustableHeaderWrapperProps extends IHeaderWrapperProps {
    adjustment: number,
    startAdjustment: React.MouseEventHandler<HTMLDivElement>,
    setMinWidth: (w: number) => void,
    minWidth?: number,
    setMaxWidth: (w: number) => void,
    maxWidth?: number,
    extraWidth: number
}

export function AdjustableColumnHeaderWrapper(props: React.PropsWithChildren<IAdjustableHeaderWrapperProps>) {
    const thref = React.useRef(null);
    const [mode, setMode] = React.useState<'width' | 'minWidth' | 'maxWidth'>('minWidth');
    const [width, setWidth] = React.useState<number>();
    const [minWidth, setMinWidth] = React.useState<number>();
    const [maxWidth, setMaxWidth] = React.useState<number>();

    const [showBorder, setShowBorder] = React.useState(false);

    const onHover = React.useCallback(() => { setShowBorder(true); }, [])
    const onLeave = React.useCallback(() => { setShowBorder(false); }, [])

    const style = (props.style !== undefined) ? { ...props.style } : {};
    let isAuto = false;

    style.overflowX = style.overflowX ?? 'hidden';
    style.display = style.display ?? 'inline-block'
    style.position = style.position ?? 'relative';
    style.borderTop = style.borderTop ?? 'none';
    style.minWidth = style.minWidth ?? 100;

    if (style.width == 'auto') {
        isAuto = true;
    }

    if ((style.width == undefined || style.width == 'auto') && props.width !== undefined && mode === 'width') {
        style.width = (props.width) + props.extraWidth;
    }

    if (mode === 'minWidth') {
        style.width = style.minWidth;
    }

    if (mode === 'maxWidth') {
        style.width = style.maxWidth;
    }

    if (mode === 'width' && props.adjustment !== undefined && props.adjustment !== 0 && style.width !== undefined) {
        style.width = `calc(${formatwidth(style.width).toString()} ${props.adjustment < 0 ? '-' : '+'} ${Math.abs(props.adjustment).toString()}px)`
    }

    if (style.cursor === undefined && (props.allowSort ?? true)) {
        style.cursor = 'pointer';
    }

    React.useLayoutEffect(() => {

        
        if (thref.current == null) return;
        if (mode != 'minWidth') return;

        const w = GetNodeSize(thref.current)?.width;
        if (w === undefined) return;

        if (w !== minWidth) {
            setMinWidth(w);
        }

        if (maxWidth === undefined && style.maxWidth !== undefined) {
            setMode('maxWidth');
            
        } else if (props.width === undefined) {
            setMode('width');
        }
        
    });

    React.useLayoutEffect(() => {
        if (thref.current == null) return;
        if (mode != 'maxWidth') return;

        const w = GetNodeSize(thref.current)?.width;
        if (w === undefined) return;

        if (w !== maxWidth) {
            setMaxWidth(w);
        }
        
        if (props.width === undefined) {
            setMode('width');
        } else if (props.minWidth === undefined && style.minWidth !== undefined) {
            setMode('minWidth');
        }
    
    });

    React.useLayoutEffect(() => {
        if (thref.current == null) return;
        if (mode != 'width') return;

        const w = GetNodeSize(thref.current)?.width;
        if (w === undefined) return;

        if (props.width === undefined || (w !== (props.width + props.extraWidth))) {
            props.setWidth(w, isAuto);
        }

        if (maxWidth === undefined && style.maxWidth !== undefined) {
            setMode('maxWidth');
        } else if (minWidth === undefined && style.minWidth !== undefined) {
            setMode('minWidth');
        }
    });

    React.useEffect(() => { 
        if (minWidth !== props.minWidth) props.setMinWidth(minWidth as number);
    }, [minWidth]);
    React.useEffect(() => { 
        if (maxWidth !== props.maxWidth) props.setMaxWidth(maxWidth as number);
    }, [maxWidth]);
    React.useEffect(() => { 
        if (width !== props.width) props.setWidth(width as number, isAuto);
    }, [width]);

    const onClick = React.useCallback((e) => {
        if (props.allowSort ?? true) props.onSort(e);
    }, [props.onSort, props.allowSort]);

    const onClickBorder = React.useCallback((e) => {
        props.startAdjustment(e);
    }, [props.startAdjustment])


    if (props.width != undefined && !props.enabled)
        return null;

    return <th
        ref={thref}
        style={style}
        onClick={onClick}
        onDrag={(e) => { e.stopPropagation() }}
    >
        <div style={{
                width: 5,
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: showBorder ? 1 : 0,
                background: '#e9ecef',
                cursor: 'col-resize'
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onMouseDown={onClickBorder}
        ></div>
        {props.sorted ? <div
            style={{ position: 'absolute', width: 25 }}>
            {props.asc ? SVGIcons.ArrowDropUp : SVGIcons.ArrowDropDown}
        </div> : null}
        <div style={{
            marginLeft: (props.sorted ? 25 : 0),
        }}>{props.children ?? props.colKey}</div>
    </th>
}

interface IAdjustableDataWrapperProps extends IDataWrapperProps {
    adjustment?: number
}


export function AdjustableColumnDataWrapper(props: React.PropsWithChildren<IAdjustableDataWrapperProps>) {
    const tdref = React.useRef(null);
    const style = (props.style !== undefined) ? { ...props.style } : {};
    let isAuto = false;

    style.overflowX = style.overflowX ?? 'hidden';
    style.display = style.display ?? 'inline-block'

    if ((style.width == undefined || style.width == 'auto') && props.width !== undefined) {
        style.width = (props.width) + props.extraWidth;
    }

    if (props.dragStart !== undefined) style.cursor = "grab";
    if (style.width == 'auto') isAuto = true;

    React.useLayoutEffect(() => {
        if (tdref.current == null)
            return;

        const w = GetNodeSize(tdref.current)?.width;

        if (style.width === undefined && props.width === undefined) {
            props.setWidth(w, isAuto);
            return;
        } 

        if (props.adjustment !== undefined && props.adjustment !== 0)
            return;

        if (w === undefined || (props.width !== undefined && w == (props.width + props.extraWidth))) return;
        props.setWidth(w, isAuto);
    })
    
    if (props.adjustment !== undefined && props.adjustment !== 0 && style.width !== undefined)
        style.width = `calc(${formatwidth(style.width)} ${props.adjustment < 0 ? '-' : '+'} ${Math.abs(props.adjustment).toString()}px)`

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


function formatwidth(style: string | number) {
    if (style.toString().endsWith('%') || style.toString().endsWith('px'))
        return style;
    return style.toString() + "px"
}