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
    OnClick?: (data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null, index: number }, event: any) => void;
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
    Selected?: (data: T, index: number) => boolean;
    /**
     * 
     * @param data the information of the row including the item of the row
     * @param e the event triggering this
     * @returns 
     */
    OnDragStart?: (data: { colKey?: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void;
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
     * use this for displaying warnings when the Table content gets cut off
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
    maxColWidth: number,
    width: Map<string | number, number>,
    minWidth?: number,
    maxWidth?: number,
    enabled: boolean,
    adjustement: number | undefined
}

const defaultTableStyle: React.CSSProperties = {
    padding: 0,
    width: '100%',
    height: '100%',
    tableLayout: 'fixed',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 0
}

export default function AdjustableTable<T>(props: React.PropsWithChildren<TableProps<T>>) {
    const tblref = React.useRef<HTMLTableElement>(null);
  const throtleRef = React.useRef<NodeJS.Timeout | null>(null);
  const colCountRef = React.useRef<NodeJS.Timeout | null>(null);

    const autoWidth = React.useRef<Map<string, IAutoWidth>>(new Map<string, IAutoWidth>());
    const [autoWidthVersion, setAutoWidthVersion] = React.useState<number>(0);
    const [currentTableWidth, setCurrentTableWidth] = React.useState<number>(0);

  const setTableWidth = React.useCallback(
    _.debounce(() => {
      setCurrentTableWidth(tblref.current?.offsetWidth ?? 0);
    }, 500),
    [],
  );

    React.useEffect(() => {
        const element = tblref?.current;

        if (element == null) return;

        const observer = new ResizeObserver(() => {
            setTableWidth()
        });

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [])

  React.useEffect(() => {
    autoWidth.current = new Map<string, IAutoWidth>();
    setAutoWidthVersion(0);
  }, [currentTableWidth]);

    React.useEffect(() => {
        let t = 0;
        autoWidth.current.forEach((v) => {
            t = t + v.maxColWidth;
        });

        if (colCountRef.current !== null)
            clearTimeout(colCountRef.current)
        if (t > (currentTableWidth-17) && currentTableWidth > 0) {
            const hideKeys: string[] = [];
            const showKeys: string[] = [];
            let t = 0;
            autoWidth.current.forEach((v, k) => {
                t = t + v.maxColWidth;
                if (t < (currentTableWidth-17))
                    showKeys.push(k);
                else
                    hideKeys.push(k);
            });
            colCountRef.current = setTimeout(() => {
                hideKeys.forEach(k => autoWidth.current.get(k)!.enabled = false);
                showKeys.forEach(k => autoWidth.current.get(k)!.enabled = true);
                setAutoWidthVersion((v) => v + 1);
        props.ReduceWidthCallback!(hideKeys);
            }, 500);
    } else if (currentTableWidth > 0) {
      props.ReduceWidthCallback!([]);
    }
  }, [autoWidthVersion]);

  React.useEffect(() => {
    // if there are keys in the map not present in children, map is old
    let oldMap = false;
    React.Children.forEach(props.children, (element) => {
      if (!React.isValidElement(element)) return;
      if (
        (element as React.ReactElement<any>).type === Column ||
        (element as React.ReactElement<any>).type === AdjustableColumn
      ) {
        autoWidth.current.forEach((value, key) => {
          oldMap = element.props.Key !== key ? true : false;
        });
      }
    });
    if (oldMap) {
      autoWidth.current.clear();
      setAutoWidthVersion(0);
    }
  }, [props.children]);

  const handleSort = React.useCallback(
    (
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
        if (data.colKey !== null)
            props.OnSort(data, event);
    }, [props.OnSort]);

    const setWidth = React.useCallback((colKey: string, key: string | number, width: number) => {
    
        if (!autoWidth.current.has(colKey))
      autoWidth.current.set(colKey, {
        maxColWidth: width,
        width: new Map<string | number, number>([[key, width]]),
        enabled: true,
        adjustement: 0,
      });
        else if (!(autoWidth.current.get(colKey)?.width.has(key) ?? false)) {
            autoWidth.current.get(colKey)?.width.set(key, width);
            if (width > (autoWidth.current.get(colKey)?.maxColWidth ?? 9e10))
                autoWidth.current.get(colKey)!.maxColWidth = width;
    } else if (autoWidth.current.get(colKey)!.width.get(key) == width) {
            return;
        } else {
            autoWidth.current.get(colKey)!.width.set(key, width);
            if (width == autoWidth.current.get(colKey)?.maxColWidth)
                autoWidth.current.get(colKey)!.maxColWidth = Math.max(...autoWidth.current.get(colKey)!.width.values());
        }
        //cancel ref
    //Add a Timer - runs within 10 ms from when the Timer started to avoid React thinking this is an indinfinte loop....
    if (throtleRef.current !== null) clearTimeout(throtleRef.current);
        throtleRef.current = setTimeout(() => {
            setAutoWidthVersion((v) => v + 1);
        }, 10);
    }, []);

    const setAdjustment = React.useCallback((colKey: string, w: number) => {
        if (!autoWidth.current.has(colKey))
      autoWidth.current.set(colKey, {
        maxColWidth: 0,
        width: new Map<string | number, number>(),
        enabled: true,
        adjustement: w,
      });
    else autoWidth.current.get(colKey)!.adjustement = autoWidth.current.get(colKey)?.adjustement ?? 0 + w;

        //cancel ref
    //Add a Timer - runs within 10 ms from when the Timer started to avoid React thinking this is an indinfinte loop....
    if (throtleRef.current !== null) clearTimeout(throtleRef.current);

        throtleRef.current = setTimeout(() => {
            setAutoWidthVersion((v) => v + 1);
        }, 10);
  }, []);

    const setMinWidth = React.useCallback((colKey: string, w: number) => {
        if (!autoWidth.current.has(colKey))
      autoWidth.current.set(colKey, {
        maxColWidth: 0,
        width: new Map<string | number, number>(),
        enabled: true,
        adjustement: 0,
        minWidth: w,
      });
    else if (autoWidth.current.get(colKey)?.minWidth == w) return;

        autoWidth.current.get(colKey)!.minWidth = w;

        //cancel ref
    //Add a Timer - runs within 10 ms from when the Timer started to avoid React thinking this is an indinfinte loop....
    if (throtleRef.current !== null) clearTimeout(throtleRef.current);
        throtleRef.current = setTimeout(() => {
            setAutoWidthVersion((v) => v + 1);
        }, 10);
  }, []);

    const setMaxWidth = React.useCallback((colKey: string, w: number) => {
        if (!autoWidth.current.has(colKey))
      autoWidth.current.set(colKey, {
        maxColWidth: 0,
        width: new Map<string | number, number>(),
        enabled: true,
        adjustement: 0,
        maxWidth: w,
      });
    else if (autoWidth.current.get(colKey)?.maxWidth == w) return;

        autoWidth.current.get(colKey)!.maxWidth = w;

        //cancel ref
    //Add a Timer - runs within 10 ms from when the Timer started to avoid React thinking this is an indinfinte loop....
    if (throtleRef.current !== null) clearTimeout(throtleRef.current);
        throtleRef.current = setTimeout(() => {
            setAutoWidthVersion((v) => v + 1);
        }, 10);
  }, []);

    return (
        <table
            className={props.TableClass !== undefined ? props.TableClass : 'table table-hover'}
      style={props.TableStyle ?? defaultTableStyle}
      ref={tblref}
        >
      <Header<T>
        Class={props.TheadClass}
                Style={props.TheadStyle}
                SortKey={props.SortKey}
                Ascending={props.Ascending}
                OnSort={handleSort}
                SetWidth={(k, w) => setWidth(k, -1, w)}
                SetMaxWidth={setMaxWidth}
                SetMinWidth={setMinWidth}
                AutoWidth={autoWidth}
                AutoWidthVersion={autoWidthVersion}
                LastColumn={props.LastColumn}
                SetAdjustment={setAdjustment}
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
            >
                {props.children}
            </Rows>
      {props.LastRow !== undefined ? (
        <tr style={props.RowStyle !== undefined ? { ...props.RowStyle } : {}} key={-1}>
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
    OnClick?: (data: { colKey?: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    DragStart?: ((data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void)
    Selected?: ((data: T, index: number) => boolean);
    KeySelector: (data: T, index?: number) => string | number;
    AutoWidthVersion: number,
    AutoWidth: React.MutableRefObject<Map<string, IAutoWidth>>,
    SetWidth: (key: string, itemKey: string|number, width: number) => void
}

function Rows<T>(props: React.PropsWithChildren<IRowProps<T>>) {
    if (props.Data.length === 0) return null;

    const onClick = React.useCallback((e, item: T, index: number) => {
        if (props.OnClick !== undefined)
            props.OnClick({
                colKey: undefined,
                colField: undefined,
                row: item,
                data: null,
                index: index
            }, e)
    }, [props.OnClick])

    return (
        <tbody style={props.BodyStyle} className={props.BodyClass}>
            {props.Data.map((d, i) => {
                const style: React.CSSProperties = (props.RowStyle !== undefined) ? { ...props.RowStyle } : {};

                if (style.cursor === undefined && (props.OnClick !== undefined || props.DragStart !== undefined))
                    style.cursor = 'pointer';

                if (props.Selected !== undefined && props.Selected(d, i))
                    style.backgroundColor = 'yellow';

                const key = props.KeySelector(d, i);
                return <tr key={key} style={ style } onClick={(e) => onClick(e, d, i)}>
                    {React.Children.map(props.children, (element) => {
                        if (!React.isValidElement(element))
                            return null;
                        if ((element as React.ReactElement<any>).type === Column)
                            if (props.AutoWidth.current.get(element.props.Key)?.enabled ?? true)
                  return (
                    <ColumnDataWrapper
                                    key={element.key}
                      onClick={(e) =>
                        props.OnClick!(
                          {
                            colKey: element.props.Key,
                            colField: element.props.Field,
                            row: d,
                            data: d[element.props.Field as keyof T],
                            index: i,
                          },
                          e,
                        )
                      }
                      dragStart={(e) =>
                        props.DragStart!(
                          {
                            colKey: element.props.Key,
                            colField: element.props.Field,
                            row: d,
                            data: d[element.props.Field as keyof T],
                            index: i,
                          },
                          e,
                        )
                      }
                                    setWidth={(w) => props.SetWidth(element.props.Key, key, Math.floor(w))}
                                    style={element.props.RowStyle}
                      width={
                        props.AutoWidth.current.get(element.props.Key)?.width.has(key) ?? false
                          ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth
                          : undefined
                      }
                                    enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
                                > {element.props.Content !== undefined ? element.props.Content({
                                        item: d,
                                        key: element.props.Key,
                                        field: element.props.Field,
                                        style: style,
                                    index: i
                                }) : (element.props.Field !== undefined ? d[element.props.Field as keyof T] : null)}
                                </ColumnDataWrapper>
                        if ((element as React.ReactElement<any>).type === AdjustableColumn)
                            if (props.AutoWidth.current.get(element.props.Key)?.enabled ?? true)
                                return <AdjustableColumnDataWrapper
                                    adjustment={props.AutoWidth.current.get(element.props.Key)?.adjustement}
                                    key={element.key}
                      onClick={(e) =>
                        props.OnClick!(
                          {
                            colKey: element.props.Key,
                            colField: element.props.Field,
                            row: d,
                            data: d[element.props.Field as keyof T],
                            index: i,
                          },
                          e,
                        )
                      }
                      dragStart={(e) =>
                        props.DragStart!(
                          {
                            colKey: element.props.Key,
                            colField: element.props.Field,
                            row: d,
                            data: d[element.props.Field as keyof T],
                            index: i,
                          },
                          e,
                        )
                      }
                                    setWidth={(w) => props.SetWidth(element.props.Key, key, Math.floor(w))}
                                    style={element.props.RowStyle}
                      width={
                        props.AutoWidth.current.get(element.props.Key)?.width.has(key) ?? false
                          ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth
                          : undefined
                      }
                                    enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
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
            })}
        </tbody>

}

interface IHeaderProps<T> {
    Class?: string,
    Style?: React.CSSProperties,
    SortKey: string,
    Ascending: boolean,
    OnSort: (data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>) => void
    LastColumn?: string | React.ReactNode,
    AutoWidthVersion: number,
    AutoWidth: React.MutableRefObject<Map<string, IAutoWidth>>,
    SetWidth: (key: string, width: number) => void,
    SetMinWidth: (key: string, width: number) => void,
    SetMaxWidth: (key: string, width: number) => void,
    SetAdjustment: (key: string, width: number) => void

}

function Header<T>(props: React.PropsWithChildren<IHeaderProps<T>>) {
    const trRef = React.useRef(null);

    const [mouseDown, setMouseDown] = React.useState<number>(0)
    const [currentKeys, setCurrentKeys] = React.useState<[string, string] | undefined>(undefined);
    const [deltaW, setDeltaW] = React.useState<number>(0);

    const calculateAdjustment = (key: string) => {
        let adj = 0;
        if (currentKeys !== undefined && currentKeys[0] == key)
            adj = -deltaW;
        else if (currentKeys !== undefined && currentKeys[1] == key)
            adj = deltaW;

        return (props.AutoWidth.current.get(key)?.adjustement ?? 0) + adj;
    };


    const finishAdjustment = (e: MouseEvent) => {
        const d = deltaW;
        if (currentKeys === undefined)
            return;

        if (Math.abs(d) > 5) {
            let leftAdjustment = -d;
            let rightAdjustment = d;

            const minLeft = props.AutoWidth.current.get(currentKeys[0])?.minWidth ?? 100;
            const minRight = props.AutoWidth.current.get(currentKeys[1])?.minWidth ?? 100;
            const maxLeft = props.AutoWidth.current.get(currentKeys[0])?.maxWidth ?? 9e10;
            const maxRight = props.AutoWidth.current.get(currentKeys[1])?.maxWidth ?? 9e10;

            const widthLeft = props.AutoWidth.current.get(currentKeys[0])?.maxColWidth ?? 0 + (props.AutoWidth.current.get(currentKeys[0])?.adjustement ?? 0);
            const widthRight = props.AutoWidth.current.get(currentKeys[1])?.maxColWidth ?? 0 + (props.AutoWidth.current.get(currentKeys[1])?.adjustement ?? 0);

            if (minLeft > widthLeft + leftAdjustment)
                leftAdjustment = minLeft - widthLeft;

            if (minRight > widthRight + rightAdjustment)
                rightAdjustment = minRight - widthRight;

            if (maxLeft < widthLeft + leftAdjustment)
                leftAdjustment = maxLeft - widthLeft;

            if (maxRight < widthRight + rightAdjustment)
                rightAdjustment = maxRight - widthRight;
         
            if (Math.abs(leftAdjustment) > Math.abs(rightAdjustment)) 
                leftAdjustment = - rightAdjustment;
            
            if (Math.abs(leftAdjustment) < Math.abs(rightAdjustment)) 
                rightAdjustment = - leftAdjustment;
            props.SetAdjustment(currentKeys[0], leftAdjustment)
            props.SetAdjustment(currentKeys[1], rightAdjustment)
        }
      
        setMouseDown(0);
        setCurrentKeys(undefined);
        setDeltaW(0);
    }

    const getLeftKey = React.useCallback((key: string) => {
        const keys = React.Children.map(props.children ?? [], (element) => {
        if (!React.isValidElement(element)) return null;
            if ((element as React.ReactElement<any>).type === AdjustableColumn)
                return (element.props as IColumnProps<T>).Key;
            return null;
        }).filter(item => item !== null);

        const index = keys.indexOf(key);
        if (index < 1)
            return undefined;

        return keys[index-1];
    }, [props.children]);

    const onMove = React.useCallback((e: MouseEvent) => {
        if (currentKeys === undefined)
            return;
        const w = mouseDown - e.screenX;
        setDeltaW(w);
    }, [mouseDown, currentKeys])

    return (<thead
        className={props.Class}
        style={props.Style}
        onMouseMove={(e) => { onMove(e.nativeEvent); e.stopPropagation(); }}
        onMouseUp={(e) => { finishAdjustment(e.nativeEvent); e.stopPropagation(); }}
        onMouseLeave={(e) => { finishAdjustment(e.nativeEvent); e.stopPropagation(); }}
    >
        <tr ref={trRef} >
            {React.Children.map(props.children, (element) => {
                if (!React.isValidElement(element))
                    return null;
                if ((element as React.ReactElement<any>).type === Column)
                    if (props.AutoWidth.current.get(element.props.Key)?.enabled ?? true)
                        return <ColumnHeaderWrapper
                            enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
                            setWidth={(w) => props.SetWidth(element.props.Key, w)}
                            onSort={(e) => props.OnSort({ colKey: element.props.Key, colField: element.props.Field, ascending: props.Ascending }, e)}
                            sorted={props.SortKey === element.props.Key && (element.props.AllowSort ?? true)}
                            asc={props.Ascending}
                            colKey={element.props.Key}
                            key={element.props.Key}
                            allowSort={element.props.AllowSort}
                            width={(props.AutoWidth.current.get(element.props.Key)?.width.has(-1) ?? false) ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth : undefined}
                            style={element.props.HeaderStyle ?? element.props.RowStyle}> {element.props.children ?? element.props.Key} </ColumnHeaderWrapper>
                if ((element as React.ReactElement<any>).type === AdjustableColumn)
                    if (props.AutoWidth.current.get(element.props.Key)?.enabled ?? true)
                        return <AdjustableColumnHeaderWrapper
                            enabled={props.AutoWidth.current.get(element.props.Key)?.enabled ?? true}
                            setWidth={(w) => props.SetWidth(element.props.Key, w)}
                            setMinWidth={(w) => props.SetMinWidth(element.props.Key, Math.round(w))}
                            minWidth={props.AutoWidth.current.get(element.props.Key)?.minWidth}
                            setMaxWidth={(w) => props.SetMaxWidth(element.props.Key, Math.round(w))}
                            maxWidth={props.AutoWidth.current.get(element.props.Key)?.maxWidth}
                            onSort={(e) => props.OnSort({ colKey: element.props.Key, colField: element.props.Field, ascending: props.Ascending }, e)}
                            sorted={props.SortKey === element.props.Key && (element.props.AllowSort ?? true)}
                            key={element.props.Key}
                            colKey={element.props.Key}
                            asc={props.Ascending}
                            allowSort={element.props.AllowSort}
                            width={(props.AutoWidth.current.get(element.props.Key)?.width.has(-1) ?? false) ? props.AutoWidth.current.get(element.props.Key)?.maxColWidth : undefined}
                            startAdjustment={(e) => {
                                if (getLeftKey(element.props.Key) !== undefined)
                                    setCurrentKeys([getLeftKey(element.props.Key) as string, element.props.Key as string])
                                setMouseDown(e.screenX)
                                setDeltaW(0);
                            }}
                            adjustment={calculateAdjustment(element.props.Key)}
                            style={element.props.HeaderStyle ?? element.props.RowStyle}> {element.props.children ?? element.props.Key}
                        </AdjustableColumnHeaderWrapper> 
                return null;
            })}
            <th style={{ width: 17, padding: 0 }}>{props.LastColumn}</th>
        </tr>
    </thead>)

}