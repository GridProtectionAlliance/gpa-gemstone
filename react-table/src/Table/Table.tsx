//  ******************************************************************************************************
//  Table.tsx - Gbtc
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
//  05/31/2024 - C. Lackner
//       Refactored to fix sizing issues.
//  12/04/2024 - G. Santos
//       Refactored to fix performance issues.
//
//  ******************************************************************************************************
import * as React from 'react';
import * as _ from 'lodash';
import * as ReactTableProps from './Types';
import { Column, ColumnDataWrapper, ColumnHeaderWrapper } from './Column';

type width = {
    width: number,
    minWidth: number,
    maxWidth: number
}

const defaultTableStyle: React.CSSProperties = {
    padding: 0,
    flex: 1,
    tableLayout: 'fixed',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 0,
    width: '100%'
};

const defaultHeadStyle: React.CSSProperties = {
    fontSize: 'auto', 
    tableLayout: 'fixed', 
    display: 'table', 
    width: '100%'
};

const defaultBodyStyle: React.CSSProperties = {
    flex: 1,
    display: 'block',
    overflow: 'auto'
};

const defaultRowStyle: React.CSSProperties = {
    display: 'table',
    tableLayout: 'fixed',
    width: '100%'
};

const defaultDataHeadStyle: React.CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    borderTop: 'none',
    width: 'auto'
};

const defaultDataCellStyle: React.CSSProperties = {
    overflowX: 'hidden',
    display: 'inline-block',
    width: 'auto'
};

const IsColumnProps = (props: any) => (props?.['Key'] != null);
const IsColumnAdjustable = (props: any) => {
    const propValue = props?.['Adjustable'];
    if (propValue === false || propValue === true) return propValue as boolean;
    return false;
}

export function Table<T>(props: React.PropsWithChildren<ReactTableProps.ITable<T>>) {
    const bodyRef = React.useRef<HTMLTableSectionElement | null>(null);
    const colWidthsRef = React.useRef<Map<string, width>>(new Map<string, width>());
    const oldWidthRef = React.useRef<number>(0);
    
    const [currentTableWidth, setCurrentTableWidth] = React.useState<number>(0);
    const [scrolled, setScrolled] = React.useState<boolean>(false);
    const [trigger, setTrigger] = React.useState<number>(0);

    // Style consts
    const tableStyle = React.useMemo(() => ({...defaultTableStyle, ...props.TableStyle}),[props.TableStyle]);
    const headStyle = React.useMemo(() => ({...defaultHeadStyle, ...props.TheadStyle}),[props.TheadStyle]);
    const bodyStyle = React.useMemo(() => ({...defaultBodyStyle, ...props.TbodyStyle}),[props.TbodyStyle]);
    const rowStyle = React.useMemo(() => ({...defaultRowStyle, ...props.RowStyle}),[props.RowStyle]);

    // Send warning if styles are overridden
    React.useEffect(() => {
        if (props.TableStyle !== undefined)
            console.warn('TableStyle properties may be overridden if needed. consider using the defaults');
        if (props.TheadStyle !== undefined)
            console.warn('TheadStyle properties may be overridden if needed. consider using the defaults');
        if (props.TbodyStyle !== undefined)
            console.warn('TBodyStyle properties may be overridden if needed. consider using the defaults');
        if (props.RowStyle !== undefined)
            console.warn('RowStyle properties may be overridden if needed. consider using the defaults');
    }, []);
    

    // Measure widths and hide columns
    React.useLayoutEffect(() => {
        if (currentTableWidth <= 0) return;

        // Helper functions for the calculations
        const getWidthfromProps = (p: ReactTableProps.IColumn<T>, type: 'width'|'maxWidth'|'minWidth') => {
            // This priotizes rowstyling for width over header, since it was decided that they need to be the same
            if (p?.RowStyle?.[type] !== undefined) return p.RowStyle[type];
            if (p?.HeaderStyle?.[type] !== undefined) return p.HeaderStyle[type];
            return undefined;
        }

        // Construct base map
        const newMap = new Map<string, width>();
        React.Children.forEach(props.children, (element) => {
            if (React.isValidElement(element) && IsColumnProps(element.props)) {
                if (newMap.get(element.props.Key) != null) console.error("Multiple of the same key detected in table, this will cause issues.");
                newMap.set(element.props.Key, {minWidth: 100, maxWidth: 1000, width: 100})
            }
        });

        // If width is the same and keys are identical, we can skip the operation
        if (currentTableWidth === oldWidthRef.current && 
            (
                newMap.size === colWidthsRef.current.size && 
                ![...newMap.keys()].some(key => !colWidthsRef.current.has(key))
            )
        ) return;

        // Find and set widths for map
        ['minWidth', 'width', 'maxWidth'].forEach(type => {
            const widthsContainer = document.createElement("div");
            widthsContainer.style.height = '0px';
            widthsContainer.style.width = `${currentTableWidth}px`;

            // Append columns as divs for measurement
            const autoKeys: string[] = [];
            const measureKeys: string[] = [];
            React.Children.forEach(props.children, (element) => {
                if (React.isValidElement(element) && IsColumnProps(element.props)) {
                    let widthValue = getWidthfromProps(element.props, type as 'minWidth'|'width'|'maxWidth');
                    if (type === 'width' && widthValue == null) widthValue = 'auto';
                    if (widthValue != null) {
                        if (widthValue === 'auto') autoKeys.push(element.props.Key);
                        else {
                            const widthElement = document.createElement("div");
                            widthElement.id = element.props.Key + "_measurement";
                            widthElement.style.height = '0px';
                            if ((widthValue as string)?.length != null)
                                widthElement.style.width = widthValue as string;
                            else 
                                widthElement.style.width = `${widthValue}px`;
                            widthsContainer.appendChild(widthElement);
                            measureKeys.push(element.props.Key);
                        }

                    }
                }
            });
            document.body.appendChild(widthsContainer);

            // Handle Measurements
            let autoSpace = currentTableWidth;
            measureKeys.forEach(key => {
                const element = document.getElementById(key+"_measurement");
                if (element != null) {
                    const widthObj = newMap.get(key);
                    if (widthObj != null) {
                        autoSpace -= element.clientWidth;
                        widthObj[type as 'minWidth'|'width'|'maxWidth'] = element.clientWidth;
                    }
                    else console.error("Could not find width object for Key: " + key);
                }
                else console.error("Could not find measurement div with Key: " + key);
            });
            document.body.removeChild(widthsContainer);
        
            // Handle Autos (width type only)
            if (type === 'width' && autoKeys.length > 0) {
                const spacePerElement = Math.floor(autoSpace / autoKeys.length);
                autoKeys.forEach(key => {
                    const widthObj = newMap.get(key);
                    if (widthObj != null) widthObj[type] = spacePerElement;
                    else console.error("Could not find width object for Key: " + key);
                });
            }

            let remainingSpace = currentTableWidth;
            [...newMap.keys()].forEach(key => {
                const widthObj = newMap.get(key);
                if (widthObj != null) {
                    if (widthObj.minWidth <= remainingSpace) {
                        // This follows behavior consistent with MDN documentation on how these width types should behave
                        if (widthObj.minWidth > widthObj.width) widthObj.width = widthObj.minWidth;
                        if (widthObj.minWidth > widthObj.maxWidth) widthObj.maxWidth = widthObj.minWidth;
                        if (widthObj.width > widthObj.maxWidth) widthObj.width = widthObj.maxWidth;
                        // Constrain Width to remainingSpace
                        if (widthObj.width > remainingSpace) widthObj.width = remainingSpace;
                        remainingSpace -= widthObj.width;
                    }
                    else {
                        widthObj.minWidth = 0;
                        widthObj.width = 0;
                        widthObj.maxWidth = 0;
                    }
                }
                else console.error("Could not find width object for Key: " + key);
            });
        });
        
        colWidthsRef.current = newMap;
        oldWidthRef.current = currentTableWidth;
        setTrigger(c => c+1);
    }, [props.children, currentTableWidth]);


    const setTableWidth = React.useCallback(_.debounce(() => {
        if (bodyRef.current == null) return;
        // Note: certain body classes may break this check if they set overflow to scroll
        let newScroll = false;
        if (props.TbodyStyle?.overflowY === 'scroll' || props.TbodyStyle?.overflow === 'scroll') newScroll = true;
        else newScroll = bodyRef.current.clientHeight < bodyRef.current.scrollHeight;
        setScrolled(newScroll);
        setCurrentTableWidth((bodyRef.current?.clientWidth ?? 17) - (newScroll ? 0 : 17));
    }, 100), []);
    
    React.useEffect(() => {
        let resizeObserver: ResizeObserver;

        const intervalHandle = setInterval(() => {
            if (bodyRef?.current == null) return;
            resizeObserver = new ResizeObserver(() => {
                setTableWidth();
            });
            resizeObserver.observe(bodyRef.current);
            clearInterval(intervalHandle);
        }, 10);
        
        return () => {
            clearInterval(intervalHandle);
            if (resizeObserver != null && resizeObserver.disconnect != null) resizeObserver.disconnect();
        };
    }, []);
    
    const handleSort = React.useCallback((data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            if (data.colKey !== null) props.OnSort(data, event);
    }, [props.OnSort]);

    return (
        <table
            className={props.TableClass !== undefined ? props.TableClass : 'table table-hover'}
            style={tableStyle}>
            <Header<T>
                Class={props.TheadClass}
                Style={headStyle}
                SortKey={props.SortKey}
                Ascending={props.Ascending}
                LastColumn={props.LastColumn}
                OnSort={handleSort}
                ColWidths={colWidthsRef}
                Trigger={trigger}
                TriggerRerender={() => setTrigger(c => c+1)}>
                {props.children}
            </Header>
            <Rows<T>
                DragStart={props.OnDragStart}
                Data={props.Data}
                RowStyle={rowStyle}
                BodyStyle={bodyStyle}
                BodyClass={props.TbodyClass}
                OnClick={props.OnClick}
                Selected={props.Selected}
                KeySelector={props.KeySelector}
                BodyRef={bodyRef}
                BodyScrolled={scrolled}
                ColWidths={colWidthsRef}
                Trigger={trigger}>
                {props.children}
            </Rows>
            {
                props.LastRow !== undefined ? (
                    <tfoot style={props.TfootStyle} className={props.TfootClass}>
                        <tr style={props.RowStyle !== undefined ? { ...props.RowStyle } : {}}>
                            {props.LastRow}
                        </tr>
                    </tfoot>
                ) : null
            }
        </table>
    );
}

interface IRowProps<T> {
    Data: T[];
    RowStyle?: React.CSSProperties;
    BodyStyle?: React.CSSProperties;
    BodyClass?: string;
    OnClick?: (
        data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    DragStart?: (
        data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        e: React.DragEvent<Element>,
    ) => void;
    Selected?: (data: T, index: number) => boolean;
    KeySelector: (data: T, index?: number) => string | number;
    BodyRef?: React.MutableRefObject<HTMLTableSectionElement | null>;
    BodyScrolled: boolean;
    ColWidths: React.MutableRefObject<Map<string, width>>;
    Trigger: number;
}
    
function Rows<T>(props: React.PropsWithChildren<IRowProps<T>>) {
    const bodyStyle = React.useMemo(() => ({ ...props.BodyStyle, paddingRight: (props.BodyScrolled ? 0 : 17), display: "block" }), [props.BodyStyle, props.BodyScrolled]);

    const onClick = React.useCallback((e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, item: T, index: number) => {
        if (props.OnClick !== undefined)
            props.OnClick(
                {
                    colKey: undefined,
                    colField: undefined,
                    row: item,
                    data: null,
                    index: index,
                },
                e,
            );
    }, [props.OnClick]);
    
    return (
        <tbody style={bodyStyle} className={props.BodyClass} ref={props.BodyRef}>
        {props.Data.map((d, i) => {
            const style: React.CSSProperties = props.RowStyle !== undefined ? { ...props.RowStyle } : {};
            
            if (style.cursor === undefined && (props.OnClick !== undefined || props.DragStart !== undefined))
                style.cursor = 'pointer';
            
            if (props.Selected !== undefined && props.Selected(d, i)) style.backgroundColor = 'var(--warning)';
            
            const key = props.KeySelector(d, i);
            return (
                <tr key={key} style={style} onClick={(e) => onClick(e, d, i)}>
                    {React.Children.map(props.children, (element) => {
                        if (!React.isValidElement(element)) return null;
                        if (!IsColumnProps(element.props)) return null;
                        const colWidth = props.ColWidths.current.get(element.props.Key);
                        if (colWidth == null || colWidth.width === 0) return null;
                        let cursor = undefined;
                        if (element.props?.RowStyle?.cursor != null) cursor = element.props.RowStyle.cursor
                        else if (props?.OnClick != null) cursor = 'pointer';
                        else if (props?.DragStart != null) cursor = 'grab';
                        const style = {
                            ...defaultDataCellStyle,
                            ...(element.props?.RowStyle), 
                            width: colWidth.width, 
                            cursor: cursor
                        };
                        return (
                            <ColumnDataWrapper
                                key={element.key}
                                onClick={
                                    (props.OnClick != null) ? (e) =>
                                    props.OnClick!(
                                        {
                                            colKey: element.props.Key,
                                            colField: element.props?.Field,
                                            row: d,
                                            data: d[element.props?.Field as keyof T],
                                            index: i,
                                        },
                                        e,
                                    ) : undefined
                                }
                                dragStart={
                                    (props.DragStart != null) ? (e) =>
                                    props.DragStart!(
                                        {
                                            colKey: element.props.Key,
                                            colField: element.props?.Field,
                                            row: d,
                                            data: d[element.props?.Field as keyof T],
                                            index: i,
                                        },
                                        e,
                                    ) : undefined
                                }
                                style={style}
                                >
                                {element.props?.Content != null
                                    ? element.props.Content({
                                        item: d,
                                        key: element.props.Key,
                                        field: element.props?.Field,
                                        style: style,
                                        index: i,
                                    })
                                    : element.props?.Field != null
                                    ? d[element.props.Field as keyof T]
                                    : null}
                            </ColumnDataWrapper>
                        );
                    })}
                </tr>
            );
        })}
        </tbody>
    );
}

interface IHeaderProps<T> {
    Class?: string;
    Style?: React.CSSProperties;
    SortKey: string;
    Ascending: boolean;
    OnSort: (
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    ColWidths: React.MutableRefObject<Map<string, width>>;
    TriggerRerender: ()=>void;
    Trigger: number;
    LastColumn?: string | React.ReactNode;
}

function Header<T>(props: React.PropsWithChildren<IHeaderProps<T>>) {
    const headStyle = React.useMemo(() => ({ ...defaultHeadStyle, ...props.Style }), [props.Style]);

    // Consts for adjustable columns
    const [mouseDown, setMouseDown] = React.useState<number>(0);
    const [currentKeys, setCurrentKeys] = React.useState<[string, string] | undefined>(undefined);
    const [deltaW, setDeltaW] = React.useState<number>(0);
    const [tentativeLimits, setTentativeLimits] = React.useState<{min: number, max: number}>({min: -Infinity, max: Infinity});

    const getLeftKey = React.useCallback((key: string, colWidthsRef: React.MutableRefObject<Map<string, width>>) => {
        // Filtering down to shown adjustables only
        const keys = React.Children.map(props.children ?? [], (element) => {
            if (!React.isValidElement(element))
                return null;
            const keyWidth = colWidthsRef.current.get(key)?.width;
            if (keyWidth == null || keyWidth <= 0)
                return null;
            if (IsColumnProps(element.props) && IsColumnAdjustable(element.props))
                return (element.props as ReactTableProps.IColumn<T>).Key;
            return null;
        }).filter((item) => item !== null);

        const index = keys.indexOf(key);
        if (index <= 0) return undefined;

        return keys[index - 1];
    }, [props.children]);

    const calculateDeltaLimits = React.useCallback((mapKeys: [string, string] | undefined, colWidthsRef: React.MutableRefObject<Map<string, width>>) => {
        if (mapKeys === undefined) return ({min: -Infinity, max: Infinity});

        const widthObjLeft = colWidthsRef.current.get(mapKeys[0]);
        const widthObjRight = colWidthsRef.current.get(mapKeys[1]);

        if (widthObjLeft == null || widthObjRight == null) return ({min: -Infinity, max: Infinity});

        const limitByShrinkLeft = widthObjLeft.width - widthObjLeft.minWidth;
        const limitByGrowthLeft = widthObjLeft.maxWidth - widthObjLeft.width;
        const limitByShrinkRight = widthObjRight.width - widthObjRight.minWidth;
        const limitByGrowthRight = widthObjRight.maxWidth - widthObjRight.width;

        // Recall that a left movement is a negative deltaW
        const minDeltaW = -(limitByShrinkLeft < limitByGrowthRight ? limitByShrinkLeft : limitByGrowthRight);
        const maxDeltaW = limitByShrinkRight < limitByGrowthLeft ? limitByShrinkRight : limitByGrowthLeft;

        return ({min: minDeltaW, max: maxDeltaW});
    }, []);

    const getDeltaSign = React.useCallback((index: number) => {
        // Recall that a left movement is a negative deltaW
        if (index === 0) return 1;
        else if (index === 1) return -1;
        else return 0;
    }, []);

    const finishAdjustment = React.useCallback((adjustment: number, adjustKeys: [string,string], colWidthsRef: React.MutableRefObject<Map<string, width>>) => {
        const deltaLimits = calculateDeltaLimits(adjustKeys, colWidthsRef);

        let delta: number;
        if (adjustment > deltaLimits.max) delta = deltaLimits.max;
        else if (adjustment < deltaLimits.min) delta = deltaLimits.min;
        else delta = adjustment;

        if (Math.abs(delta) > 5) {
            const leftWidthObj = colWidthsRef.current.get(adjustKeys[0]);
            const rightWidthObj = colWidthsRef.current.get(adjustKeys[1]);
            if (leftWidthObj == null || rightWidthObj == null) {
                console.error(`Unable to finalize adjustment on keys ${adjustKeys[0]}, ${adjustKeys[1]}`);
            }
            else {
                leftWidthObj.width += (getDeltaSign(0) * delta);
                rightWidthObj.width += (getDeltaSign(1) * delta);
            }
        }

        setMouseDown(0);
        setTentativeLimits({min: -Infinity, max: Infinity});
        setCurrentKeys(undefined);
        setDeltaW(0);
    }, [calculateDeltaLimits, getDeltaSign]);

    const onMove = React.useCallback((e: MouseEvent) => {
        if (currentKeys === undefined) return;
        const w = e.screenX - mouseDown;
        setDeltaW(w);
    }, [mouseDown, currentKeys]);
    
    return (
        <thead
            className={props.Class}
            style={headStyle}
            onMouseMove={(e) => {
                onMove(e.nativeEvent);
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                if (currentKeys == null) return;
                finishAdjustment(deltaW, currentKeys, props.ColWidths);
                props.TriggerRerender();
            }}
            onMouseLeave={(e) => {
                e.stopPropagation();
                if (currentKeys == null) return;
                finishAdjustment(deltaW, currentKeys, props.ColWidths);
                props.TriggerRerender();
            }}
        >
        <tr style={{width: '100%', display: 'table'}}>
        {React.Children.map(props.children, (element) => {
            if (!React.isValidElement(element)) return null;
            if (!IsColumnProps(element.props)) return null;
            const colWidth = props.ColWidths.current.get(element.props.Key);
            if (colWidth == null || colWidth.width === 0) return null;
            // Handling temporary width changes due to being in mid-adjustments
            let currentWidth = colWidth.width;
            const keyIndex = currentKeys?.indexOf(element.props.Key) ?? -1;
            if (keyIndex > -1) {
                let delta: number;
                if (deltaW > tentativeLimits.max) delta = tentativeLimits.max;
                else if (deltaW < tentativeLimits.min) delta = tentativeLimits.min;
                else delta = deltaW;
                currentWidth += (getDeltaSign(keyIndex) * delta);
            }
            let cursor = undefined;
            if (element.props?.HeaderStyle?.cursor != null) cursor = element.props.HeaderStyle.cursor
            else if ((element.props?.AllowSort ?? true) as boolean) cursor = 'pointer';
            const style = {
                ...defaultDataHeadStyle,
                ...element.props?.HeaderStyle,
                width: currentWidth,
                cursor: cursor
            };
            let startAdjustment: React.MouseEventHandler<HTMLDivElement> | undefined;
            if (IsColumnAdjustable(element.props))
                startAdjustment = (e) => {
                    const leftKey = getLeftKey(element.props.Key, props.ColWidths);
                    if (leftKey != null) {
                        const newCurrentKeys: [string, string] = [leftKey, element.props.Key as string];
                        setCurrentKeys(newCurrentKeys);
                        setMouseDown(e.screenX);
                        setTentativeLimits(calculateDeltaLimits(newCurrentKeys, props.ColWidths));
                        setDeltaW(0);
                    }

                }
                return (
                    <ColumnHeaderWrapper
                        onSort={(e) =>
                            props.OnSort(
                                { colKey: element.props.Key, colField: element.props?.Field, ascending: props.Ascending },
                                e,
                            )
                        }
                        sorted={props.SortKey === element.props.Key && (element.props?.AllowSort ?? true)}
                        asc={props.Ascending}
                        colKey={element.props.Key}
                        key={element.props.Key}
                        allowSort={element.props?.AllowSort}
                        startAdjustment={startAdjustment}
                        style={style}
                    >
                        {' '}
                        {element.props.children ?? element.props.Key}{' '}
                    </ColumnHeaderWrapper>
                );
            })}
        <th style={{ width: 17, padding: 0, maxWidth: 17 }}>{props.LastColumn}</th>
        </tr>
        </thead>
    );
}