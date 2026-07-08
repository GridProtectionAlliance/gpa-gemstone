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
import { ColumnHeaderWrapper } from './Column';
import { CreateGuid, useGetContainerPosition } from '@gpa-gemstone/helper-functions';
import { Search } from '@gpa-gemstone/react-interactive';
import FilterableColumn, { FilterableColumnHeader } from './FilterableColumn';

export type width = {
    width: number,
    minWidth: number,
    maxWidth?: number
}

const defaultHeadStyle: React.CSSProperties = {
    fontSize: 'auto',
    tableLayout: 'fixed',
    display: 'table',
    width: '100%'
};

const defaultDataHeadStyle: React.CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    borderTop: 'none',
    width: 'auto'
};

const IsColumnProps = (props: unknown) => ((props as ReactTableProps.IColumn<unknown>)?.['Key'] != null);
const IsColumnAdjustable = (props: unknown) => {
    const propValue = (props as ReactTableProps.IColumn<unknown>)?.['Adjustable'];
    if (propValue === false || propValue === true) return propValue as boolean;
    return false;
}

interface IProps<T> {
    Class?: string;
    Style?: React.CSSProperties;
    SortKey: string;
    Ascending: boolean;
    OnSort: (
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    ColWidths: React.MutableRefObject<Map<string, width>>;
    TriggerRerender: () => void;
    Trigger: number;
    SetLastColumnWidth: (width: number) => void;
    LastColumn?: string | React.ReactNode;
    SetFilters?: (filters: Search.IFilter<T>[]) => void;
    Filters?: Search.IFilter<T>[];
}

const Header = <T,>(props: React.PropsWithChildren<IProps<T>>) => {
    const headStyle = React.useMemo(() => ({ ...defaultHeadStyle, ...props.Style }), [props.Style]);
    const lastColRef = React.useRef<HTMLDivElement | null>(null);
    const { width: lastColWidth } = useGetContainerPosition(lastColRef);

    // Consts for adjustable columns
    const [mouseDown, setMouseDown] = React.useState<number>(0);
    const [currentKeys, setCurrentKeys] = React.useState<[string, string] | undefined>(undefined);
    const [deltaW, setDeltaW] = React.useState<number>(0);
    const [tentativeLimits, setTentativeLimits] = React.useState<{ min: number, max: number }>({ min: -Infinity, max: Infinity });

    // Consts for filterable columns
    const [filters, setFilters] = React.useState<Search.IFilter<T>[]>((props.Filters ?? []));
    const [guid] = React.useState<string>(CreateGuid());

    const getLeftKey = React.useCallback((key: string, colWidthsRef: React.MutableRefObject<Map<string, width>>) => {
        // Filtering down to shown adjustables only

        const mapCallback = (element: React.ReactNode) => {
            if (!React.isValidElement(element))
                return null;
            const keyWidth = colWidthsRef.current.get(key)?.width;
            if (keyWidth == null || keyWidth <= 0)
                return null;
            if (IsColumnProps(element.props) && IsColumnAdjustable(element.props))
                return (element.props as ReactTableProps.IColumn<T>).Key;
            return null;
        }

        const children = props.children ?? [];

        const keys = (React.Children.map(children, mapCallback) ?? []).filter((item) => item !== null);

        const index = keys.indexOf(key);
        if (index <= 0) return undefined;

        return keys[index - 1];
    }, [props.children]);

    const calculateDeltaLimits = React.useCallback((mapKeys: [string, string] | undefined, colWidthsRef: React.MutableRefObject<Map<string, width>>) => {
        if (mapKeys === undefined) return ({ min: -Infinity, max: Infinity });

        const widthObjLeft = colWidthsRef.current.get(mapKeys[0]);
        const widthObjRight = colWidthsRef.current.get(mapKeys[1]);

        if (widthObjLeft == null || widthObjRight == null) return ({ min: -Infinity, max: Infinity });

        const limitByShrinkLeft = widthObjLeft.width - widthObjLeft.minWidth;
        const limitByGrowthLeft = widthObjLeft.maxWidth == null ? Number.MAX_SAFE_INTEGER : (widthObjLeft.maxWidth - widthObjLeft.width);
        const limitByShrinkRight = widthObjRight.width - widthObjRight.minWidth;
        const limitByGrowthRight = widthObjRight.maxWidth == null ? Number.MAX_SAFE_INTEGER : (widthObjRight.maxWidth - widthObjRight.width);

        // Recall that a left movement is a negative deltaW
        const minDeltaW = -(limitByShrinkLeft < limitByGrowthRight ? limitByShrinkLeft : limitByGrowthRight);
        const maxDeltaW = limitByShrinkRight < limitByGrowthLeft ? limitByShrinkRight : limitByGrowthLeft;

        return ({ min: minDeltaW, max: maxDeltaW });
    }, []);

    const getDeltaSign = React.useCallback((index: number) => {
        // Recall that a left movement is a negative deltaW
        if (index === 0) return 1;
        else if (index === 1) return -1;
        else return 0;
    }, []);

    const finishAdjustment = React.useCallback((adjustment: number, adjustKeys: [string, string], colWidthsRef: React.MutableRefObject<Map<string, width>>) => {
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
        setTentativeLimits({ min: -Infinity, max: Infinity });
        setCurrentKeys(undefined);
        setDeltaW(0);
    }, [calculateDeltaLimits, getDeltaSign]);

    const onMove = React.useCallback((e: MouseEvent) => {
        if (currentKeys === undefined) return;
        const w = e.screenX - mouseDown;
        setDeltaW(w);
    }, [mouseDown, currentKeys]);

    const updateFilters = React.useCallback((flts: Search.IFilter<T>[], fld: string | number | symbol | undefined) => {
        setFilters((fls) => {
            const newFilters = fls.filter(item => item.FieldName !== fld).concat(flts);
            if (props.SetFilters == null)
                console.error("Attempted to set filters from column when no set filter arguement to table was provided. Data has not been filtered!");
            else props.SetFilters(newFilters);
            return newFilters;
        });
    }, [props.SetFilters]);

    React.useEffect(() => setFilters(props.Filters ?? []), [props.Filters]);

    React.useEffect(() => props.SetLastColumnWidth(lastColWidth), [lastColWidth, props.SetLastColumnWidth]);

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
            <tr style={{ width: '100%', display: 'table' }}>
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
                            {
                                ((element as React.ReactElement).type === FilterableColumn) ?
                                    <FilterableColumnHeader
                                        Label={element.props?.children}
                                        Filter={filters.filter(f => f.FieldName === element.props?.Field?.toString())}
                                        SetFilter={(f) => updateFilters(f, element.props?.Field)}
                                        Field={element.props?.Field}
                                        Type={element.props?.Type}
                                        Options={element.props?.Enum}
                                        ExpandedLabel={element.props?.ExpandedLabel}
                                        Guid={guid}
                                        Unit={element.props?.Unit}
                                    /> :
                                    (element.props.children ?? element.props.Key)
                            }
                            {' '}
                        </ColumnHeaderWrapper>
                    );
                })}
                {props.LastColumn !== undefined ?
                    <th style={{ width: lastColWidth, padding: 0, maxWidth: lastColWidth }}>
                        <div ref={lastColRef} style={{ width: 'max-content' }}>
                            {props.LastColumn}
                        </div>
                    </th>
                    : null}
            </tr>
        </thead>
    );
}

export default Header;