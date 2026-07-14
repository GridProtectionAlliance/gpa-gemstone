//  ******************************************************************************************************
//  Rows.tsx - Gbtc
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
import { ColumnDataWrapper } from './Column';

export type width = {
    width: number,
    minWidth: number,
    maxWidth?: number
}

interface IProps<T> {
    /**
     * Records rendered as table rows.
     */
    Data: T[];
    /**
     * Optional CSS styles applied to each row.
     */
    RowStyle?: React.CSSProperties;
    /**
     * Optional CSS styles applied to the table body.
     */
    BodyStyle?: React.CSSProperties;
    /**
     * Optional class name applied to the table body.
     */
    BodyClass?: string;
    /**
     * Optional handler fired when a row or cell is clicked.
     * @param data - Row and column information for the clicked location.
     * @param e - Mouse event raised by the row or cell.
     */
    OnClick?: (
        data: { colKey?: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void;
    /**
     * Optional handler fired when dragging begins from a table cell.
     * @param data - Row and column information for the dragged location.
     * @param e - Drag event raised by the cell.
     */
    DragStart?: (
        data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T] | null; index: number },
        e: React.DragEvent<Element>,
    ) => void;
    /**
     * Optional callback that determines whether a row uses selected styling.
     * @param data - Record represented by the row.
     * @param index - Position of the record in the table data.
     * @returns Whether the row is selected.
     */
    Selected?: (data: T, index: number) => boolean;
    /**
     * Produces a stable React key for a row.
     * @param data - Record represented by the row.
     * @param index - Optional position of the record in the table data.
     * @returns Key used to identify the rendered row.
     */
    KeySelector: (data: T, index?: number) => string | number;
    /**
     * Optional mutable reference attached to the table body.
     */
    BodyRef?: React.MutableRefObject<HTMLTableSectionElement | null>;
    /**
     * Indicates whether the table body currently has a vertical scrollbar.
     */
    BodyScrolled: boolean;
    /**
     * Mutable column widths shared with the table header.
     */
    ColWidths: React.MutableRefObject<Map<string, width>>;
    /**
     * Value changed by the parent to request recalculation of row layout.
     */
    Trigger: number;
}

const defaultDataCellStyle: React.CSSProperties = {
    overflowX: 'hidden',
    display: 'inline-block',
    width: 'auto'
};

/**
 * Renders table records into interactive rows and data cells.
 * @param props - Records, columns, widths, row state, and interaction handlers.
 * @returns Configured table body rows.
 */
const Rows = <T,>(props: React.PropsWithChildren<IProps<T>>) => {
    const bodyStyle = React.useMemo(() => ({ ...props.BodyStyle, display: "block" }), [props.BodyStyle]);

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
                            else if (props?.OnClick != null) {
                                cursor = 'pointer';
                            }
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
                                        (e) => {
                                            if (props.OnClick == null) return;
                                            return props.OnClick(
                                                {
                                                    colKey: element.props.Key,
                                                    colField: element.props?.Field,
                                                    row: d,
                                                    data: d[element.props?.Field as keyof T],
                                                    index: i,
                                                },
                                                e,
                                            )
                                        }
                                    }
                                    dragStart={
                                        props.DragStart == null ? undefined :
                                            (e) => {
                                                if (props.DragStart == null) return;
                                                return props.DragStart(
                                                    {
                                                        colKey: element.props.Key,
                                                        colField: element.props?.Field,
                                                        row: d,
                                                        data: d[element.props?.Field as keyof T],
                                                        index: i,
                                                    },
                                                    e,
                                                )
                                            }
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

export const IsColumnProps = (props: unknown) => ((props as ReactTableProps.IColumn<unknown>)?.['Key'] != null);

export default Rows;