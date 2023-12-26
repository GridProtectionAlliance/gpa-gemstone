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
//
//  ******************************************************************************************************

import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import { GetNodeSize } from '@gpa-gemstone/helper-functions';
import * as React from 'react';
import { IColumnProps } from './Column';


interface IAdjustableColProps<T> extends IColumnProps<T> {
    /**
     * The minimum Width used for this Collumn - default is 100px
     */
    MinWidth?: number    
}


export default function AdjustableCol<T>(props: React.PropsWithChildren<IAdjustableColProps<T>>) {
    return <>{props.children}</>
}


interface IHeaderWrapperProps<T> extends IAdjustableColProps<T> {
    setWidth: (w: number, m: number) => void,
    width?: number,
    onSort: (key: string, event: any, field?: keyof T) => void,
    sorted: boolean,
    asc: boolean,
    startAdjustment: (e: any) => void;
    fixedLayout: boolean
} 

export function AdjColumnHeaderWrapper<T>(props: React.PropsWithChildren<IHeaderWrapperProps<T>>) {
    const thref = React.useRef(null);
    const [showBorder, setShowBorder] = React.useState(false);
    
    const onHover = React.useCallback(() => { setShowBorder(true); }, [])
    const onLeave = React.useCallback(() => { setShowBorder(false); }, [])

    const style = (props.RowStyle !== undefined) ? {...props.HeaderStyle } : { };

    if (props.width !== undefined && props.fixedLayout){
        style.width = props.width;
        style.minWidth = props.width;
        style.maxWidth = props.width;
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
            props.setWidth(w, props.MinWidth ?? 100);
    })
    
    const onClick = React.useCallback((e) => { 
        if (props.AllowSort ?? true) props.onSort(props.Key, e, props.Field);
        e.stopPropagation();
        }, [props.onSort])

    const onClickBorder = React.useCallback((e) => { 
        props.startAdjustment(e);
    }, [props.startAdjustment])

    return <th
                ref={thref}
                style={style}
                onClick={onClick}
                onDrag={(e) => {e.stopPropagation()}}
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
            {props.sorted && props.asc ? <div 
                style={{ position: 'absolute', width: 25 }}>
                    {SVGIcons.ArrowDropDown} 
                </div> : null}
            {props.sorted && !props.asc ? <div 
                style={{ position: 'absolute', width: 25 }}>
                    {SVGIcons.ArrowDropUp} 
                </div> : null}
            <div style={{
                marginLeft: (props.sorted ? 25 : 0),
            }}>{props.children ?? props.Key}</div>
        </th>
}
