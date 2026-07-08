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
import * as  _ from 'lodash';
import * as ReactTableProps from './Types';
import { GetScrollbarWidth } from '@gpa-gemstone/helper-functions';
import Rows, { IsColumnProps, width } from './Rows';
import Header from './Header';

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

export function Table<T>(props: React.PropsWithChildren<ReactTableProps.ITable<T>>) {
    const bodyRef = React.useRef<HTMLTableSectionElement | null>(null);
    const colWidthsRef = React.useRef<Map<string, width>>(new Map<string, width>());
    const oldWidthRef = React.useRef<number>(0);

    const [lastColumnWidth, setLastColumnWidth] = React.useState<number>(0);
    const [currentTableWidth, setCurrentTableWidth] = React.useState<number>(0);
    const [scrolled, setScrolled] = React.useState<boolean>(false);
    const [trigger, setTrigger] = React.useState<number>(0);

    // Style consts
    const tableStyle = React.useMemo(() => ({ ...defaultTableStyle, ...props.TableStyle }), [props.TableStyle]);
    const headStyle = React.useMemo(() => ({ ...defaultHeadStyle, ...props.TheadStyle }), [props.TheadStyle]);
    const bodyStyle = React.useMemo(() => ({ ...defaultBodyStyle, ...props.TbodyStyle }), [props.TbodyStyle]);
    const rowStyle = React.useMemo(() => ({ ...defaultRowStyle, ...props.RowStyle }), [props.RowStyle]);

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
        const getWidthfromProps = (p: ReactTableProps.IColumn<T>, type: 'width' | 'maxWidth' | 'minWidth') => {
            // This priotizes rowstyling for width over header, since it was decided that they need to be the same
            if (p?.RowStyle?.[type] !== undefined)
                return p.RowStyle[type];
            if (p?.HeaderStyle?.[type] !== undefined)
                return p.HeaderStyle[type];
            return undefined;
        }

        // Construct base map
        const newMap = new Map<string, width>();
        React.Children.forEach(props.children, (element) => {
            if (React.isValidElement(element) && IsColumnProps(element.props)) {
                if (newMap.get(element.props.Key) != null) console.error("Multiple of the same key detected in table, this will cause issues.");
                newMap.set(element.props.Key, { minWidth: 10, maxWidth: undefined, width: 100 })
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
                    let widthValue = getWidthfromProps(element.props, type as 'minWidth' | 'width' | 'maxWidth');
                    if (type === 'width' && widthValue == null)
                        widthValue = 'auto';
                    if (widthValue != null) {
                        if (widthValue === 'auto')
                            autoKeys.push(element.props.Key);
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
                const element = document.getElementById(key + "_measurement");
                const elementWidth = element?.getBoundingClientRect().width;
                if (elementWidth != null) {
                    const widthObj = newMap.get(key);
                    if (widthObj != null) {
                        autoSpace -= elementWidth;
                        widthObj[type as 'minWidth' | 'width' | 'maxWidth'] = elementWidth;
                    }
                    else console.error("Could not find width object for Key: " + key);
                }
                else console.error("Could not find measurement div with Key: " + key);
            });
            document.body.removeChild(widthsContainer);

            // Handle Autos (width type only)
            if (type === 'width' && autoKeys.length > 0) {
                const spacePerElement = autoSpace / autoKeys.length;
                autoKeys.forEach(key => {
                    const widthObj = newMap.get(key);
                    if (widthObj != null)
                        widthObj[type] = spacePerElement;
                    else console.error("Could not find width object for Key: " + key);
                });
            }
        });

        let remainingSpace = currentTableWidth;
        [...newMap.keys()].forEach(key => {
            const widthObj = newMap.get(key);
            if (widthObj != null) {
                if (widthObj.minWidth <= remainingSpace) {
                    // This follows behavior consistent with MDN documentation on how these width types should behave
                    if (widthObj.minWidth > widthObj.width)
                        widthObj.width = widthObj.minWidth;

                    if (widthObj.maxWidth != null && widthObj.minWidth > widthObj.maxWidth)
                        widthObj.maxWidth = widthObj.minWidth;

                    if (widthObj.maxWidth != null && widthObj.width > widthObj.maxWidth)
                        widthObj.width = widthObj.maxWidth;

                    // Constrain Width to remainingSpace
                    if (widthObj.width > remainingSpace)
                        widthObj.width = remainingSpace;

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

        colWidthsRef.current = newMap;
        oldWidthRef.current = currentTableWidth;
        setTrigger(c => c + 1);
    }, [props.children, currentTableWidth]);

    React.useEffect(() => {
        let resizeObserver: ResizeObserver;

        const setTableWidth = () => {
            if (bodyRef.current == null) return;

            // Note: certain body classes may break this check if they set overflow to scroll
            let newScroll = false;
            const dims = bodyRef.current?.getBoundingClientRect(); //use getBoundClientRect() to get un rounded values
            if (props.TbodyStyle?.overflowY === 'scroll' || props.TbodyStyle?.overflow === 'scroll') newScroll = true;
            else newScroll = dims?.height < bodyRef.current.scrollHeight

            setScrolled(newScroll);

            // Pick whichever is larger so we dont double subtract
            const scrollbar = newScroll ? GetScrollbarWidth() : 0;
            const last = props.LastColumn !== undefined ? lastColumnWidth : 0;
            const spacer = Math.max(scrollbar, last);

            setCurrentTableWidth((dims.width ?? 17) - spacer);
        }

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
    }, [lastColumnWidth]);

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
                SetFilters={props.SetFilters}
                Filters={props.Filters}
                Trigger={trigger}
                TriggerRerender={() => setTrigger(c => c + 1)}
                SetLastColumnWidth={setLastColumnWidth}
            >
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
