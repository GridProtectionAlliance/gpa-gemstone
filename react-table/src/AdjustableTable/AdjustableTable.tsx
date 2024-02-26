//  ******************************************************************************************************
//  Adjustable.tsx - Gbtc
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
//  11/18/2023 - C. Lackner
//       Generated original version of source code.
//
//  ******************************************************************************************************

import * as React from 'react';
import * as _ from 'lodash';
import Column, { ColumnDataWrapper, ColumnHeaderWrapper } from './Column';
import AdjustableCol, { AdjColumnHeaderWrapper } from './AdjustableColumn';

interface TableProps<T> {
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
    OnClick?: (data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T] | null, index: number }, event: any) => void;
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
    OnSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: any): void;
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
     */
    TbodyStyle?: React.CSSProperties;
    /**
     * Class of the tbody component
     */
    TbodyClass?: string;
    /**
     * determines if a row should be styled as selected
     * @param data the item to be checked
     * @returns true if the row should be styled as selected
     */
    Selected?: (data: T) => boolean;
    /**
     * 
     * @param data he information of the row including the item of the row
     * @param e the event triggering this
     * @returns 
     */
    OnDragStart?: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void;
    /**
     * The default style for the tr element
     */
    RowStyle?: React.CSSProperties;
    /**
     * a Function that retrieves a unique key used for React key properties
     * @param data the item to be turned into a key
     * @returns a unique Key
     */
    KeySelector: (data: T, index?: number) => string|number;

    /**
     * Optional Element to display in the last row of the Table
     * use this for displaying warnings when the Table content gets cut off
     */
    LastRow?: string | React.ReactNode;
    /**
     * Optional Element to display on upper Right corner
     */
    LastColumn?: string | React.ReactNode;
}

interface IAdjustedWidths {width: number, minWidth: number}

export default function AdjustableTable<T>(props: React.PropsWithChildren<TableProps<T>>) {

    const tblref = React.useRef<HTMLTableElement>(null);

    const [fixLayout, setFixLayout] = React.useState<boolean>(false);
    const [currentTableWidth, setCurrentTableWidth] = React.useState<number>(0);
    const [fixedWidths, setFixedWidths] = React.useState<Map<string, number>>(new Map<string, number>())
    const [adjustedWidths, setAdjustedWidths] = React.useState<Map<string, IAdjustedWidths>>(new Map<string, IAdjustedWidths>())
    const [fixedkeys, setFixedKeys] = React.useState<string[]>(React.Children.map(props.children, (element) => {
            if (!React.isValidElement(element))
                return undefined
            if ((element as React.ReactElement<any>).type === Column)
                return element.props.Key
            return undefined; 
        })?.filter((s) => s !== undefined) ?? [])

    const [adjKeys, setAdjKeys] = React.useState<string[]>(React.Children.map(props.children,
        (element) => {
            if (!React.isValidElement(element))
                return undefined
            if ((element as React.ReactElement<any>).type === AdjustableCol)
                return element.props.Key
            return undefined; 
        })?.filter(d => d !== undefined) ?? [])

        const setTableWidth = React.useCallback(_.debounce(() => {setCurrentTableWidth(tblref.current?.offsetWidth ?? 0)}, 500),[])

        React.useEffect(() => {
            const element = tblref?.current;
        
            if (!element) return;
        
            const observer = new ResizeObserver(() => {
                setTableWidth()
            });
        
            observer.observe(element);
            return () => {
              observer.disconnect();
            };
          }, [])

    React.useEffect(() => {
        const keysFixed = React.Children.map(props.children,
            (element) => {
                if (!React.isValidElement(element))
                    return undefined
                if ((element as React.ReactElement<any>).type === Column)
                    return element.props.Key
                return undefined; 
            })?.filter((k) => k !== undefined) ?? [];
        
        const keysAdj = React.Children.map(props.children,
            (element) => {
                if (!React.isValidElement(element))
                    return undefined
                if ((element as React.ReactElement<any>).type === AdjustableCol)
                    return element.props.Key
                return undefined; 
            });
        
        setFixedKeys((k) => {
            const u = keysFixed?.filter(d => d !== undefined) ?? []
            if (_.isEqual(k, u))
                return k;
            return u; 
        })

        setAdjKeys((k) => {
            const u = keysAdj?.filter(d => d !== undefined) ?? []
            if (_.isEqual(k, u))
                return k;
            return u; 
        })

    }, [props.children])

    React.useEffect(() => {
        setFixLayout(false);
        setFixedWidths(new Map<string,number>())
        setAdjustedWidths(new Map<string,IAdjustedWidths>())
    }, [fixedkeys.length, adjKeys.length, currentTableWidth])

    React.useEffect(() => {
        const fixed = fixedkeys.length == fixedWidths.size
        const adj = adjKeys.length == adjustedWidths.size

        setFixLayout(fixed && adj);

    }, [fixedkeys,adjKeys, fixedWidths, adjustedWidths])

    const handleSort = React.useCallback((
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
        if (data.colKey !== null)
            props.OnSort(data, event);
    }, [props.OnSort]);

    const getWidth = React.useCallback((key: string, type: 'fixed'|'adjustable') => {
        if (type === 'fixed' && fixedWidths.has(key))
            return fixedWidths.get(key);
        if (type === 'adjustable' && adjustedWidths.has(key))
            return adjustedWidths.get(key)?.width;
        return undefined;
    }, [fixedWidths, adjustedWidths]);

    const getMinWidth = React.useCallback((key: string) => {
        if (adjustedWidths.has(key))
            return adjustedWidths.get(key)?.minWidth ?? 100;
        return 100;
    }, [fixedWidths, adjustedWidths]);

    const getPrevKey = React.useCallback((key: string) => {
       const i = adjKeys.findIndex((a) => a === key)
        if (i < 1)
            return undefined;
        return adjKeys[i-1];
    }, [adjKeys]);

    const setWidth = React.useCallback((key: string, width: number, type: 'fixed'|'adjustable', minWidth?: number) => {
        if (type === 'fixed')
            setFixedWidths((d) => {
                const u = new Map<string, number>(d);
                u.set(key, width);
                return u;
            });
        if (type === 'adjustable') {
            if (adjustedWidths.has(key))
                minWidth = adjustedWidths.get(key)?.minWidth ?? 100;
            setAdjustedWidths((d) => {
                const u = new Map<string, IAdjustedWidths>(d);
                u.set(key, {width: width, minWidth: minWidth??100});
                return u;
            });
        }
    }, []);
  
    return (
        <table
            className={props.TableClass !== undefined ? props.TableClass : ''}
            style={props.TableStyle} ref={tblref}
        >
            <Header<T> Class={props.TheadClass}
                Style={props.TheadStyle}
                SortKey={props.SortKey}
                Ascending={props.Ascending}
                OnSort={handleSort}
                SetWidth={setWidth}
                GetWidth={getWidth}
                GetMinWidth={getMinWidth}
                GetLeftKey={getPrevKey}
                LastColumn={props.LastColumn}
                FixedLayout={fixLayout}
                >
                {props.children}
            </Header>
            <Rows<T>
                DragStart={props.OnDragStart}
                Data={props.Data}
                RowStyle={props.RowStyle}
                BodyStyle={props.TbodyStyle}
                BodyClass={props.TbodyClass}
                OnClick={props.OnClick}
                Selected={props.Selected} KeySelector={props.KeySelector}
                AdjWidth={adjustedWidths}
                FixedWidth={fixedWidths}
                FixedLayout={fixLayout}
                >
            {props.children}
            </Rows>
            {props.LastRow !== undefined ? <tr style={(props.RowStyle !== undefined) ? { ...props.RowStyle } : {}} key={-1}>
                {props.LastRow}
            </tr> : null}
        </table>
    );
}

interface IRowProps<T> {
    Data: T[],
    RowStyle?: React.CSSProperties,
    BodyStyle?: React.CSSProperties,
    BodyClass?: string,
    OnClick?: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    DragStart?: ((data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void)
    Selected?: ((data: T) => boolean);
    KeySelector: (data: T, index?: number) => string|number;
    AdjWidth: Map<string,IAdjustedWidths>,
    FixedWidth: Map<string,number>,
    FixedLayout: boolean
}

function Rows<T>(props: React.PropsWithChildren<IRowProps<T>>) {
    if (props.Data.length === 0) return null;

    const getWidth = React.useCallback((key: string, type: 'fixed'|'adjustable') => {
        if (type === 'fixed' && props.FixedWidth.has(key))
            return props.FixedWidth.get(key);
        if (type === 'adjustable' && props.AdjWidth.has(key))
            return props.AdjWidth.get(key)?.width;
        return undefined;
    }, [props.FixedWidth, props.AdjWidth]);
    return (
        <tbody style={props.BodyStyle} className={props.BodyClass}>
            {props.Data.map((d,i) => {
                const style: React.CSSProperties = (props.RowStyle !== undefined) ? { ...props.RowStyle } : {};
                if (style.cursor === undefined && (props.OnClick !== undefined || props.DragStart !== undefined))
                    style.cursor = 'pointer';
        
                if (props.Selected !== undefined && props.Selected(d))
                    style.backgroundColor = 'yellow';
                
                const key = props.KeySelector(d, i);
                return <tr key={key} style={{ display: (props.FixedLayout ? 'block' : undefined), ...style}}>
                 {React.Children.map(props.children, (element) => {
                    if (!React.isValidElement(element))
                        return null;
                    if ((element as React.ReactElement<any>).type === AdjustableCol)
                        return <ColumnDataWrapper 
                            {...element.props}
                            width={getWidth(element.props.Key,'adjustable')}
                            item={d}
                            index={i}
                            key={element.key}
                            fixedLayout={props.FixedLayout}
                            onClick={props.OnClick}
                            dragStart={props.DragStart}
                            sel
                         />
                    return null;
                })}
                {React.Children.map(props.children, (element) => {
                    if (!React.isValidElement(element))
                        return null;
                    if ((element as React.ReactElement<any>).type === Column)
                        return <ColumnDataWrapper 
                            {...element.props}
                            width={getWidth(element.props.Key,'fixed')}
                            item={d}
                            index={i}
                            key={element.key}
                            fixedLayout={props.FixedLayout}
                            onClick={props.OnClick}
                            dragStart={props.DragStart}
                         />
                    return null;
                })}
                </tr>
            })}
        </tbody>
    );

 }

interface IHeaderProps<T> {
    Class?: string,
    Style?: React.CSSProperties,  
    SortKey: string,
    Ascending: boolean,
    SetWidth: (key: string, width: number, type: 'fixed'|'adjustable', minWidth?: number) => void,
    GetWidth: (key: string, type: 'fixed'|'adjustable') => number|undefined,
    GetMinWidth: (key: string) => number,
    GetLeftKey: (key: string) => string|undefined,
    OnSort: (data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>) => void
    LastColumn?: string | React.ReactNode;
    FixedLayout: boolean;
}

function Header<T>(props: React.PropsWithChildren<IHeaderProps<T>>) {
    const trRef = React.useRef(null);

    const [adjKeys, setAdjKeys] = React.useState<[string,string]|undefined>(undefined);
    const [mouseDown, setMouseDown] = React.useState<number>(0)
    const [deltaX, setDeltaX] = React.useState<number>(0);

    const finishAdjustment = (e: MouseEvent) => {
        const d = deltaX;
        if (adjKeys === undefined)
            return;
   
        const w = limitMovement(adjKeys[0], adjKeys[1], d);
       
        const leftWidth = props.GetWidth(adjKeys[0],'adjustable') ?? 100;
        const rightWidth = props.GetWidth(adjKeys[1],'adjustable') ?? 100;
        if (Math.abs(w) > 5) {
            props.SetWidth(adjKeys[0], (leftWidth - w), 'adjustable')
            props.SetWidth(adjKeys[1], (rightWidth + w), 'adjustable')
        }
      
        setMouseDown(0);
        setAdjKeys(undefined);
        setDeltaX(0);
    }

    const onMove = React.useCallback((e: MouseEvent) => {
        if (adjKeys === undefined)
            return;
        const w = limitMovement(adjKeys[0], adjKeys[1], mouseDown - e.screenX);
        setDeltaX(w);
    }, [mouseDown, adjKeys ])

    function limitMovement(leftKey: string, rightKey: string, delta: number) {
        let w = delta;
        const leftWidth = props.GetWidth(leftKey, 'adjustable');
        const rightWidth = props.GetWidth(rightKey, 'adjustable');

        const leftMin = props.GetMinWidth(leftKey);
        const rightMin = props.GetMinWidth(rightKey);

        if ((leftWidth ?? 100) - w < leftMin) {
            w = (leftWidth ?? 100) - leftMin;
        }
        if ((rightWidth ?? 100) + w < rightMin) {
            w = -(rightWidth ?? 100) - rightMin;
        }

        return w;
    }

    const adjustWidth = (w: number|undefined, key: string) => {
        if (w === undefined)
            return w;
        if (adjKeys === undefined)
            return w
        if (key === adjKeys[0])
            return w - deltaX;
        if (key === adjKeys[1])
            return w + deltaX;
        return w;
    }

    return (<thead
        className={props.Class}
        style={props.Style}
        onMouseMove={(e) => { onMove(e.nativeEvent); e.stopPropagation(); }}
        onMouseUp={(e) => { finishAdjustment(e.nativeEvent); e.stopPropagation(); }}
        onMouseLeave={(e) => {finishAdjustment(e.nativeEvent); e.stopPropagation();}}
        >
        <tr ref={trRef} >
        {React.Children.map(props.children, (element) => {
                if (!React.isValidElement(element))
                    return null;
                if ((element as React.ReactElement<any>).type === AdjustableCol)
                     return <AdjColumnHeaderWrapper
                         {...element.props}
                         setWidth={(w,min) => props.SetWidth(element.props.Key,Math.floor(w),'adjustable', min)}
                         onSort={(key, e, fld) => props.OnSort({colKey: key, colField: fld, ascending: props.Ascending},e)}
                         sorted={props.SortKey === element.props.Key && (element.props.AllowSort ?? true)}
                         asc={props.Ascending}
                         width={adjustWidth(props.GetWidth(element.props.Key,'adjustable'),element.props.Key)}
                         startAdjustment={(e) => {
                             if (props.GetLeftKey(element.props.Key) !== undefined)
                                setAdjKeys([props.GetLeftKey(element.props.Key) as string, element.props.Key as string])
                                setMouseDown(e.screenX)
                            }}
                        fixedLayout={props.FixedLayout}
                      />
                return null;
            })}
            
            {React.Children.map(props.children, (element) => {
                if (!React.isValidElement(element))
                    return null;
                if ((element as React.ReactElement<any>).type === Column)
                    return <ColumnHeaderWrapper 
                        {...element.props}
                        setWidth={(w) => props.SetWidth(element.props.Key,Math.floor(w),'fixed')}
                        onSort={(key, e, fld) => props.OnSort({colKey: key, colField: fld, ascending: props.Ascending},e)}
                        sorted={props.SortKey === element.props.Key && (element.props.AllowSort ?? true)}
                        asc={props.Ascending}
                        width={props.GetWidth(element.props.Key,'fixed')}
                        fixedLayout={props.FixedLayout}
                     />
                return null;
            })}
            <th style={{ width: 17, padding: 0}}>{props.LastColumn}</th>
        </tr>
    </thead>)

}