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
//
//  ******************************************************************************************************
import * as React from 'react';
import * as _ from 'lodash';
import Column, { ColumnDataWrapper, ColumnHeaderWrapper, IColumnProps } from './Column';
import AdjustableColumn, { AdjustableColumnDataWrapper, AdjustableColumnHeaderWrapper } from './AdjustableColumn';

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
    OnClick?: (
        data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
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
    OnSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>): void;
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
    * Note: Display style overwritten to "block"
    */
    TbodyStyle?: React.CSSProperties;
    /**
    * Class of the tbody component
    */
    TbodyClass?: string;
    /**
    * style of the tfoot component
    */
    TfootStyle?: React.CSSProperties;
    /**
    * Class of the tfoot component
    */
    TfootClass?: string;

    /**
    * determines if a row should be styled as selected
    * @param data the item to be checked
    * @returns true if the row should be styled as selected
    */
    Selected?: (data: T, index: number) => boolean;
    /**
    *
    * @param data the information of the row including the item of the row
    * @param e the event triggering this
    * @returns
    */
    OnDragStart?: (
        data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        e: React.DragEvent<Element>,
    ) => void;
    /**
    * The default style for the tr element
    */
    RowStyle?: React.CSSProperties;
    /**
    * a Function that retrieves a unique key used for React key properties
    * @param data the item to be turned into a key
    * @returns a unique Key
    */
    KeySelector: (data: T, index?: number) => string | number;
    
    /**
    * Optional Element to display in the last row of the Table
    * use this for displaying warnings when the Table content gets cut off.
    * Data appears in the tfoot element
    */
    LastRow?: string | React.ReactNode;
    /**
    * Optional Element to display on upper Right corner
    */
    LastColumn?: string | React.ReactNode;
    
    /**
    * Optional Callback that gets called when there is not enough space to display columns
    * @param disabled takes in string of disabled keys
    */
    ReduceWidthCallback?: (disabled: string[]) => void;
}

interface IAutoWidth {
    maxColWidth: number;
    width: Map<string | number, number>;
    minWidth?: number;
    maxWidth?: number;
    enabled: boolean;
    adjustement: number | undefined;
    isAuto: boolean;
    isUndefined: boolean;
}

const defaultTableStyle: React.CSSProperties = {
    padding: 0,
    height: '100%',
    tableLayout: 'fixed',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 0,
};

const defaultHeadStyle: React.CSSProperties = {
    width: "calc(100% - 15px)"
};

export default function AdjustableTable<T>(props: React.PropsWithChildren<TableProps<T>>) {
    const bodyRef = React.useRef<HTMLTableSectionElement | null>(null);
    const throtleRef = React.useRef<NodeJS.Timeout | null>(null);
    const colCountRef = React.useRef<NodeJS.Timeout | null>(null);
    
    const autoWidth = React.useRef<Map<string, IAutoWidth>>(new Map<string, IAutoWidth>());
    const [autoWidthVersion, setAutoWidthVersion] = React.useState<number>(0);
    const [currentTableWidth, setCurrentTableWidth] = React.useState<number>(0);
    const [scrolled, setScrolled] = React.useState<boolean>(false);
    const [extraWidthPerRow, setExtraWidthPerRow] = React.useState<number>(0);


    const [fullWidth, setFullWidth] = React.useState<number>(100);
    const measurementDivs = React.useRef<HTMLDivElement>(null);

    // Send warning if styles are overridden
    React.useEffect(() => {
        if (props.TableStyle !== undefined)
            console.warn('TableStyle properties may be overridden if needed. consider using the defaults');
        if (props.TheadStyle !== undefined)
            console.warn('TheadStyle properties may be overridden if needed. consider using the defaults');
    }, [])
    

    // Check which columns need to be hidden. If anything needs to be hidden try to deal with it here and 
    React.useLayoutEffect(() => {


    });

    const tableStyle = React.useMemo(() => ({...defaultTableStyle, ...props.TableStyle}),[props.TableStyle]);


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
    
    React.useEffect(() => {
        autoWidth.current = new Map<string, IAutoWidth>();
        setAutoWidthVersion(0);
    }, [currentTableWidth]);
    
    React.useEffect(() => {
        let totalMaxWidth = 0;
        autoWidth.current.forEach((v) => {
            totalMaxWidth += v.maxColWidth;
        });
        if (totalMaxWidth > currentTableWidth && currentTableWidth > 0) {
            const hideKeys: string[] = [];
            const showKeys: string[] = [];
            let t = 0;
            let colW = 0;

            autoWidth.current.forEach((v, k) => {
                t = t + v.maxColWidth;
                if (t < currentTableWidth) {
                    showKeys.push(k);
                    colW += v.maxColWidth;
                }
                else hideKeys.push(k);
            });
            
            const numEnabledColumns = showKeys.length;

            if (Array.from(autoWidth.current.values()).filter(autoWidth => !autoWidth.enabled).length == hideKeys.length) {
                return;
            }
            if (colCountRef.current !== null) clearTimeout(colCountRef.current);

            colCountRef.current = setTimeout(() => {
                hideKeys.forEach((k) => (autoWidth.current.get(k)!.enabled = false));
                showKeys.forEach((k) => (autoWidth.current.get(k)!.enabled = true));

                const numOfColsWithAutoCSS = Array.from(autoWidth.current.values()).filter(autoWidth => autoWidth.isAuto && autoWidth.enabled).length;
                const numOfColsWithUndefinedCSS = Array.from(autoWidth.current.values()).filter(autoWidth => autoWidth.isUndefined && autoWidth.enabled).length;

                let colsToDivideBy = numEnabledColumns; // Split the extra across all cols

                if (numOfColsWithAutoCSS > 0) {         // Split only on the css auto-cols and no css undefined cols
                    colsToDivideBy = numOfColsWithAutoCSS;
                }
                if (numOfColsWithUndefinedCSS > 0 && numOfColsWithAutoCSS == 0) { // Split only on the css undefined if there are no auto-cols
                    colsToDivideBy = numOfColsWithUndefinedCSS;
                }
                const extraSpace = (currentTableWidth - colW) / colsToDivideBy;
                setExtraWidthPerRow(Math.floor(extraSpace));
                props.ReduceWidthCallback?.(hideKeys);
                setAutoWidthVersion((v) => v + 1);
            }, 500);
        } else if (currentTableWidth > 0) {
            const numEnabledColumns = Array.from(autoWidth.current.values()).filter(autoWidth => autoWidth.enabled).length;
            const numOfColsWithAutoCSS = Array.from(autoWidth.current.values()).filter(autoWidth => autoWidth.isAuto && autoWidth.enabled).length;
            const colsToDivideBy = (numOfColsWithAutoCSS > 0) ? numOfColsWithAutoCSS : numEnabledColumns; 

            const extraSpace = (currentTableWidth - totalMaxWidth - numEnabledColumns) / colsToDivideBy;
            setExtraWidthPerRow(extraSpace);

            props.ReduceWidthCallback?.([]);
        }
    }, [autoWidthVersion]);
    
    React.useEffect(() => {
        // if there are keys in the map not present in children, map is old
        const children = React.Children.toArray(props.children);
        const childKeys: string[] = [];
        const mapKeys = autoWidth.current.keys();
        
        children.forEach(child => {
            if (!React.isValidElement(child)) return;
            if ((child as React.ReactElement<any>).type === Column ||
            (child as React.ReactElement<any>).type === AdjustableColumn)
            childKeys.push(child.props.Key);
        });
        for (const key of mapKeys) {
            if (childKeys.includes(key)) {
                continue;
            } else {
                autoWidth.current.clear();
                setAutoWidthVersion(0);
                break;
            }
        }
    }, [props.children]);
    
    const handleSort = React.useCallback((data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            if (data.colKey !== null) props.OnSort(data, event);
    }, [props.OnSort]);
    
    const setWidth = React.useCallback((colKey: string, key: string | number, width: number, isAuto: boolean, isUndefined: boolean) => {
        const flooredWidth = Math.floor(width);
        if (!autoWidth.current.has(colKey)) {                                     // does the column exist
            autoWidth.current.set(colKey, {                                       // if not, add it.
                maxColWidth: flooredWidth,
                width: new Map<string | number, number>([[key, flooredWidth]]),
                enabled: true,
                adjustement: 0,
                isAuto: isAuto,
                isUndefined: isUndefined
            })
        } else if (!(autoWidth.current.get(colKey)?.width.has(key) ?? false)) {   // it exists but the key does not
            autoWidth.current.get(colKey)?.width.set(key, flooredWidth);                 // add the width for this key
            autoWidth.current.get(colKey)!.isAuto = isAuto;
            if (flooredWidth > (autoWidth.current.get(colKey)?.maxColWidth ?? 9e10))     // if width is > to max col
                autoWidth.current.get(colKey)!.maxColWidth = flooredWidth;                   // set max to width
            
        } else if (autoWidth.current.get(colKey)!.width.get(key) == flooredWidth) {    // width == newW
            autoWidth.current.get(colKey)!.isAuto = isAuto;
            return;
            
        } else {
            autoWidth.current.get(colKey)!.width.set(key, flooredWidth);                 // otherwise, it exists, just set the width
            autoWidth.current.get(colKey)!.isAuto = isAuto;
            if (flooredWidth == autoWidth.current.get(colKey)?.maxColWidth)            // check against max
            autoWidth.current.get(colKey)!.maxColWidth = Math.max(...autoWidth.current.get(colKey)!.width.values());
        }

        //cancel ref
        //Add a Timer - runs within 10 ms from when the Timer started to avoid React thinking this is an indinfinte loop....
        if (throtleRef.current !== null) clearTimeout(throtleRef.current);
        throtleRef.current = setTimeout(() => {
            setAutoWidthVersion((v) => v + 1);
        }, 10);
    }, []);
    
    function getWidthfromProps(p: IColumnProps<T>): number| string | undefined {
        if (p.RowStyle?.width !== undefined && p.RowStyle?.width != 'auto') return p.RowStyle.width;
        if (p.HeaderStyle?.width !== undefined && p.HeaderStyle?.width != 'auto') return p.HeaderStyle.width;
        return undefined;
    }

    function getMinWidthfromProps(p: IColumnProps<T>): number| string {
        if (p.RowStyle?.minWidth !== undefined && p.RowStyle?.minWidth != 'auto') return p.RowStyle.minWidth;
        if (p.HeaderStyle?.minWidth !== undefined && p.HeaderStyle?.minWidth != 'auto') return p.HeaderStyle.minWidth;
        return 100;
    }

    function getMaxWidthfromProps(p: IColumnProps<T>): number| string | undefined {
        if (p.RowStyle?.maxWidth !== undefined && p.RowStyle?.maxWidth != 'auto') return p.RowStyle.maxWidth;
        if (p.HeaderStyle?.maxWidth !== undefined && p.HeaderStyle?.maxWidth != 'auto') return p.HeaderStyle.maxWidth;
        return undefined;
    }

    return (
        <>
        <div ref={measurementDivs} style={{height: 0, width: fullWidth}}>
        {React.Children.map(props.children, (element,index) => {
            if (!React.isValidElement(element)) return null;
            if ((element as React.ReactElement<any>).type === Column || (element as React.ReactElement<any>).type === AdjustableColumn) {
                return <>
                {getWidthfromProps(element.props) !== undefined? <div id={"w-" + element.props.Key} style={{height: 0, width: getWidthfromProps(element.props)}} /> : null}
                {getMinWidthfromProps(element.props) !== undefined? <div id={"min-" + element.props.Key} style={{height: 0, width: getMinWidthfromProps(element.props)}} /> : null}
                {getMaxWidthfromProps(element.props) !== undefined? <div id={"max-" + element.props.Key} style={{height: 0, width: getMaxWidthfromProps(element.props)}} /> : null}
                </>
            }
            return null;
            })}
        </div>
        <table
        className={props.TableClass !== undefined ? props.TableClass : 'table table-hover'}
        style={tableStyle}
        >
        <Header<T>
            Class={props.TheadClass}
            Style={props.TheadStyle}
            SortKey={props.SortKey}
            Ascending={props.Ascending}
            OnSort={handleSort}
            SetTotalWidth={setTableWidth}
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
        Selected={props.Selected}
        KeySelector={props.KeySelector}
        AutoWidth={autoWidth}
        AutoWidthVersion={autoWidthVersion}
        SetWidth={setWidth}
        ExtraWidth={extraWidthPerRow}
        BodyRef={bodyRef}
        BodyScrolled={scrolled}
        >
        {props.children}
        </Rows>
        {props.LastRow !== undefined ? (
            <tfoot style={props.TfootStyle} className={props.TfootClass}>
                <tr style={props.RowStyle !== undefined ? { ...props.RowStyle } : {}}>
                    {props.LastRow}
                </tr>
            </tfoot>
        ) : null}
        </table>
        </>
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
    AutoWidthVersion: number;
    AutoWidth: React.MutableRefObject<Map<string, IAutoWidth>>;
    SetWidth: (key: string, itemKey: string | number, width: number, isAuto: boolean, isUndefined: boolean) => void;
    ExtraWidth: number,
    BodyRef?: React.MutableRefObject<HTMLTableSectionElement | null>;
    BodyScrolled: boolean
}
    
function Rows<T>(props: React.PropsWithChildren<IRowProps<T>>) {
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

    const bodyStyle = React.useMemo(() => ({ ...props.BodyStyle, paddingRight: (props.BodyScrolled ? 0 : 17), display: "block" }), [props.BodyStyle, props.BodyScrolled]);
    
    return (
        <tbody style={bodyStyle} className={props.BodyClass} ref={props.BodyRef}>
        {props.Data.map((d, i) => {
            const style: React.CSSProperties = props.RowStyle !== undefined ? { ...props.RowStyle } : {};
            
            if (style.cursor === undefined && (props.OnClick !== undefined || props.DragStart !== undefined))
                style.cursor = 'pointer';
            
            if (props.Selected !== undefined && props.Selected(d, i)) style.backgroundColor = 'yellow';
            
            const key = props.KeySelector(d, i);
            return (
                <tr key={key} style={style} onClick={(e) => onClick(e, d, i)}>
                {React.Children.map(props.children, (element) => {
                    if (!React.isValidElement(element)) return null;
                    if ((element as React.ReactElement<any>).type === Column)
                        if (props.AutoWidth.current.get(element.props.Key)?.enabled ?? true)
                            return (
                        <ColumnDataWrapper
                            key={element.key}
                            extraWidth={props.ExtraWidth} // extraW = there is an auto, but not this one ? 0
                            onClick={
                                (props.OnClick !== undefined && props.OnClick !== null) ? (e) =>
                                props.OnClick!(
                                    {
                                        colKey: element.props.Key,
                                        colField: element.props.Field,
                                        row: d,
                                        data: d[element.props.Field as keyof T],
                                        index: i,
                                    },
                                    e,
                                ) : undefined
                            }
                            dragStart={
                                (props.DragStart !== undefined && props.DragStart !== null) ? (e) =>
                                props.DragStart!(
                                    {
                                        colKey: element.props.Key,
                                        colField: element.props.Field,
                                        row: d,
                                        data: d[element.props.Field as keyof T],
                                        index: i,
                                    },
                                    e,
                                ) : undefined
                            }
                            setWidth={(w: number, a: boolean, u: boolean) => props.SetWidth(element.props.Key, key, w, a, u)}
                            style={element.props.RowStyle}
                            width={
                                props.AutoWidth.current.get(element.props.Key)?.width.has(key) ?? false
                                ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth // if not auto <-
                                : undefined // otherwise get the extrawidth
                            }
                            enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
                            >
                            {element.props.Content !== undefined
                                ? element.props.Content({
                                    item: d,
                                    key: element.props.Key,
                                    field: element.props.Field,
                                    style: style,
                                    index: i,
                                })
                                : element.props.Field !== undefined
                                ? d[element.props.Field as keyof T]
                                : null}
                        </ColumnDataWrapper>
                        );
                        if ((element as React.ReactElement<any>).type === AdjustableColumn)
                            if (props.AutoWidth.current.get(element.props.Key)?.enabled ?? true)
                                return (
                                    <AdjustableColumnDataWrapper
                                        adjustment={props.AutoWidth.current.get(element.props.Key)?.adjustement}
                                        key={element.key}
                                        onClick={
                                        (props.OnClick !== undefined && props.OnClick !== null) ? (e) =>
                                            props.OnClick!(
                                                {
                                                    colKey: element.props.Key,
                                                    colField: element.props.Field,
                                                    row: d,
                                                    data: d[element.props.Field as keyof T],
                                                    index: i,
                                                },
                                                e,
                                            ) : undefined
                                        }
                                        dragStart={
                                        (props.DragStart !== undefined && props.DragStart !== null) ? (e) =>
                                            props.DragStart!(
                                                {
                                                    colKey: element.props.Key,
                                                    colField: element.props.Field,
                                                    row: d,
                                                    data: d[element.props.Field as keyof T],
                                                    index: i,
                                                },
                                                e,
                                            ) : undefined
                                        }
                                        setWidth={(w: number, a: boolean, u: boolean) => props.SetWidth(element.props.Key, key, w, a, u)}
                                        style={element.props.RowStyle}
                                        width={
                                            props.AutoWidth.current.get(element.props.Key)?.width.has(key) ?? false
                                            ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth
                                            : undefined
                                        }
                                        enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
                                        extraWidth={props.ExtraWidth}
                                    >
                                        {' '}
                                        {element.props.Content !== undefined
                                            ? element.props.Content({
                                                item: d,
                                                key: element.props.Key,
                                                field: element.props.Field,
                                                style: style,
                                                index: i,
                                            })
                                            : element.props.Field !== undefined
                                            ? d[element.props.Field as keyof T]
                                        : null}
                                    </AdjustableColumnDataWrapper>
                                );
                            return null;
                        })}
                    </tr>
                );
            })
        }
        </tbody>
    );
}

interface IHeaderProps<T> {
    Class?: string;
    Style?: React.CSSProperties;
    SortKey: string;
    Ascending: boolean;
    SetTotalWidth: (w: number) => void;
    OnSort: (
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
}

function Header<T>(props: React.PropsWithChildren<IHeaderProps<T>>) {
    const trRef = React.useRef<HTMLTableRowElement>(null);

    const style = React.useMemo(() => ({ ...defaultHeadStyle, ...props.Style }), [props.Style]);

    React.useLayoutEffect(() => { 
        if (trRef.current == null) return;
        props.SetTotalWidth(trRef.current.clientWidth);
    });
    /*
    const [mouseDown, setMouseDown] = React.useState<number>(0);
    const [currentKeys, setCurrentKeys] = React.useState<[string, string] | undefined>(undefined);
    const [deltaW, setDeltaW] = React.useState<number>(0);
    const [tentativeLimits, setTentativeLimits] = React.useState<{min: number, max: number}>({min: -Infinity, max: Infinity});

    
    const calculateDeltaLimits = React.useCallback((mapKeys: [string, string] | undefined, autoWidthRef: React.MutableRefObject<Map<string, IAutoWidth>>) => {
        if (mapKeys === undefined) return ({min: -Infinity, max: Infinity});

        const maxLeftAdjustment = (autoWidthRef.current.get(mapKeys[0])?.maxColWidth ?? 0) + 
            (autoWidthRef.current.get(mapKeys[0])?.adjustement ?? 0);
        const minWidthLeftAdjusted = (autoWidthRef.current.get(mapKeys[0])?.minWidth ?? 100) - maxLeftAdjustment;
        const maxWidthLeftAdjusted = (autoWidthRef.current.get(mapKeys[0])?.maxWidth ?? 9e10) - maxLeftAdjustment;

        const maxRightAdjustment = (autoWidthRef.current.get(mapKeys[1])?.maxColWidth ?? 0) + 
            (autoWidthRef.current.get(mapKeys[1])?.adjustement ?? 0);
        const minWidthRightAdjusted = (autoWidthRef.current.get(mapKeys[1])?.minWidth ?? 100) - maxRightAdjustment;
        const maxWidthRightAdjusted = (autoWidthRef.current.get(mapKeys[1])?.maxWidth ?? 9e10) - maxRightAdjustment;

        // Recall that a right movement is the result of a negative value on deltaW
        const minDeltaW = Math.abs(minWidthLeftAdjusted) < Math.abs(maxWidthRightAdjusted) ? minWidthLeftAdjusted : -maxWidthRightAdjusted;
        const maxDeltaW = Math.abs(minWidthRightAdjusted) < Math.abs(maxWidthLeftAdjusted) ? -minWidthRightAdjusted : maxWidthLeftAdjusted;

        return ({min: minDeltaW, max: maxDeltaW});
    }, []);

    const calculateAdjustment = (key: string) => {
        let adj = 0;
        let delta: number;

        if (deltaW > tentativeLimits.max) delta = tentativeLimits.max;
        else if (deltaW < tentativeLimits.min) delta = tentativeLimits.min;
        else delta = deltaW;

        if (currentKeys !== undefined && currentKeys[0] == key) adj = delta;
        else if (currentKeys !== undefined && currentKeys[1] == key) adj = -delta;
        return (props.AutoWidth.current.get(key)?.adjustement ?? 0) + adj;
    };

    const finishAdjustment = () => {
        if (currentKeys === undefined) return;

        if (Math.abs(deltaW) > 5) {
            const deltaLimits = calculateDeltaLimits(currentKeys, props.AutoWidth);
            let delta: number;
            if (deltaW > deltaLimits.max) delta = deltaLimits.max;
            else if (deltaW < deltaLimits.min) delta = deltaLimits.min;
            else delta = deltaW;
            props.SetAdjustment(currentKeys[0], delta);
            props.SetAdjustment(currentKeys[1], -delta);
        }

        setMouseDown(0);
        setTentativeLimits({min: -Infinity, max: Infinity});
        setCurrentKeys(undefined);
        setDeltaW(0);
    };

    const getLeftKey = React.useCallback((key: string) => {
        const keys = React.Children.map(props.children ?? [], (element) => {
            if (!React.isValidElement(element)) {
                return null;
            }
            if (!(props.AutoWidth.current.get((element.props as IColumnProps<T>).Key)!.enabled) ?? true) {
                return null;
            }
            if ((element as React.ReactElement<any>).type === AdjustableColumn) {
                return (element.props as IColumnProps<T>).Key;
            }
            return null;
        }).filter((item) => item !== null);

        const index = keys.indexOf(key);
        if (index < 1) return undefined;

        return keys[index - 1];
    }, [props.children]);

    const onMove = React.useCallback((e: MouseEvent) => {
        if (currentKeys === undefined) return;
        const w = e.screenX - mouseDown;
        setDeltaW(w);
    }, [mouseDown, currentKeys]);
    */
    
    return (
        <thead
            className={props.Class}
            style={style}
            onMouseMove={(e) => {
                //onMove(e.nativeEvent);
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                //finishAdjustment();
                e.stopPropagation();
            }}
            onMouseLeave={(e) => {
                //finishAdjustment();
                e.stopPropagation();
            }}
        >
        <tr ref={trRef} style={{width: '100%', display: 'table'}}>
        {React.Children.map(props.children, (element) => {
            if (!React.isValidElement(element)) return null;
            if ((element as React.ReactElement<any>).type === Column)
                <ColumnHeaderWrapper
                    onSort={(e) =>
                        props.OnSort(
                            { colKey: element.props.Key, colField: element.props.Field, ascending: props.Ascending },
                            e,
                        )
                    }
                    sorted={props.SortKey === element.props.Key && (element.props.AllowSort ?? true)}
                    asc={props.Ascending}
                    colKey={element.props.Key}
                    key={element.props.Key}
                    allowSort={element.props.AllowSort}
                    style={element.props.HeaderStyle ?? element.props.RowStyle}
                >
                    {' '}
                    {element.props.children ?? element.props.Key}{' '}
                </ColumnHeaderWrapper>
            
            if ((element as React.ReactElement<any>).type === AdjustableColumn)
                {/*<AdjustableColumnHeaderWrapper
                    enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
                    setWidth={(w: number, a: boolean, u: boolean) => props.SetWidth(element.props.Key, w, a, u)}
                    setMinWidth={(w) => props.SetMinWidth(element.props.Key, Math.round(w))}
                    minWidth={props.AutoWidth.current.get(element.props.Key)?.minWidth}
                    setMaxWidth={(w) => props.SetMaxWidth(element.props.Key, Math.round(w))}
                    maxWidth={props.AutoWidth.current.get(element.props.Key)?.maxWidth}
                    extraWidth={props.ExtraWidth}
                    onSort={(e) =>
                        props.OnSort(
                            { colKey: element.props.Key, colField: element.props.Field, ascending: props.Ascending },
                            e
                        )
                    }
                    sorted={props.SortKey === element.props.Key && (element.props.AllowSort ?? true)}
                    key={element.props.Key}
                    colKey={element.props.Key}
                    asc={props.Ascending}
                    allowSort={element.props.AllowSort}
                    width={
                        props.AutoWidth.current.get(element.props.Key)?.width.has(-1) ?? false
                        ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth
                        : undefined
                    }
                    startAdjustment={(e) => {
                        let newCurrentKeys: [string, string] | undefined;
                        //if (getLeftKey(element.props.Key) !== undefined) newCurrentKeys = [getLeftKey(element.props.Key) as string, element.props.Key as string];
                        //setCurrentKeys(newCurrentKeys);
                        //setMouseDown(e.screenX);
                        //setTentativeLimits(calculateDeltaLimits(newCurrentKeys, props.AutoWidth));
                        //setDeltaW(0);
                    }}
                    adjustment={0}
                    style={element.props.HeaderStyle ?? element.props.RowStyle}
                >
                    {' '}
                    {element.props.children ?? element.props.Key}
                    </AdjustableColumnHeaderWrapper>*/}
                
                return null;
            })}
        </tr>
        </thead>
    );
}