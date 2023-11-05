//  ******************************************************************************************************
//  Table.tsx - Gbtc
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
//
//  ******************************************************************************************************

import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import { GetNodeSize, findLastIndex, React as ReactExtension} from '@gpa-gemstone/helper-functions';
import * as React from 'react';

export interface Column<T> {
    key: string;
    label: string | React.ReactNode;
    field?: keyof T;
    headerStyle?: React.CSSProperties;
    rowStyle?: React.CSSProperties;
    content?(item: T, key: string, field: keyof T | undefined, style: React.CSSProperties, index: number): React.ReactNode;
    allowResize?: boolean;
}


export interface TableProps<T> {
    /**
     * List of Collumns in this Table
     */
    cols: Column<T>[];
    /**
     * List of T objects used to generate rows
     */
    data: T[];
    onClick?: (data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T] | null, index: number }, event: any) => void;
    /**
     * Key of the collumn to sort by
     */
    sortKey: string;
    /**
     * Boolen to indicate whether the sort is ascending or descending
     */
    ascending: boolean;
    onSort(data: { colKey: string; colField?: keyof T; ascending: boolean }, event: any): void;
    tableClass?: string;
    tableStyle?: React.CSSProperties;
    theadStyle?: React.CSSProperties;
    theadClass?: string;
    tbodyStyle?: React.CSSProperties;
    tbodyClass?: string;
    selected?(data: T): boolean;
    onDragStart?: ((data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void);
    rowStyle?: React.CSSProperties;
    keySelector?: (data: T) => string;
    /**
     * Flag indicating if the collumns are resizable
     * Default is <code>false</code>
     */
    allowResize?: boolean
    /**
     * Optional Element to display in the last row of the Table
     * use this for displaying warnings when the Table content gets cut off
     */
    lastRow?: string | React.ReactNode;
    /**
     * Minimum width of a collumn when allowResize is true
     */
    MinColWidth?: number;
}

interface IWidth { header: number|undefined, row: number|undefined }

function Table<T>(props: TableProps<T>) {
    const measuredWidth = React.useRef(new Map<string, IWidth>());
    const incWidthChange = React.useRef(0);

    const minimumColWidth = props.MinColWidth ?? 100;

    const [resizingCol, setResizingCol] = React.useState<number | null>(null);
    const allowResize = props.allowResize ?? false;
    const [fixedWidths, setFixedWidths] = React.useState<Map<string, IWidth>>(new Map<string, IWidth>());
    const [positionX, setPositionX] = React.useState<number>(0);
    const [totalWidth, setTotalWidth] = React.useState<number>(0);

    ReactExtension.useEffectWithPrevious((prevWidth: number) => {
        if (totalWidth === 0 || prevWidth === 0) return;
        if (props.allowResize === undefined || !props.allowResize) return;
        const change = prevWidth - totalWidth;
        if (Math.abs(change + incWidthChange.current) < 10) {
            incWidthChange.current = incWidthChange.current + change;
            return;
        }
        incWidthChange.current = 0;

        const measuredPrevTotal = Array.from(measuredWidth.current.keys()).reduce((s, k) => {
                return s + (measuredWidth.current.get(k)?.header ?? 0);
        }, 0);

        const updatedWidth = _.cloneDeep(fixedWidths);
        let diff = measuredPrevTotal - totalWidth;
        
        //return;
        let keys = props.cols
            .filter(c => (c.allowResize ?? true) && updatedWidth.has(c.key) &&
                updatedWidth.get(c.key).header > minimumColWidth && updatedWidth.get(c.key).row > minimumColWidth).map(c => c.key);

        while (keys.length > 0 && Math.abs(diff) > 1) {
            const deltaCol = diff / keys.length;
            keys.forEach(k => {
                const dCol = determineMaxMovement(updatedWidth.get(k), deltaCol);
                updatedWidth.get(k).header -= dCol;
                updatedWidth.get(k).row -= dCol;
                diff = diff - dCol;
            });
            keys = keys.filter(c => updatedWidth.get(c).header > minimumColWidth && updatedWidth.get(c).row > minimumColWidth)
        }
        setFixedWidths(updatedWidth);
    }, totalWidth)

    const handleSort = React.useCallback((
        data: { colKey: string; colField?: keyof T; ascending: boolean },
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
        if (data.colKey !== null)
            props.onSort(data, event);
    }, [props.onSort]);


    const handleResizeSelect = React.useCallback((i: number, e: MouseEvent) => {
        if (props.allowResize ?? false) {
            setResizingCol(i);
            setPositionX(e.clientX);
        }
    }, [props.allowResize]);

    const handleMouseUp = React.useCallback((i) => {
        if (resizingCol === null) return;
        setResizingCol(null);
    }, [resizingCol]);

    const handleMouseMove = React.useCallback((e) => {
        if (resizingCol === null) return;
        let dW = positionX - e.clientX 
        if (dW == 0) return;


        // try to reduce index on left by dW
        let wLeft = 0, whLeft = 0;
        let wRight = 0, whRight = 0;

        if (!measuredWidth.current.has(props.cols[resizingCol-1].key) ||
            !measuredWidth.current.has(props.cols[resizingCol].key))
            return;

        
        whLeft = measuredWidth.current.get(props.cols[resizingCol - 1].key).header;
        whRight = measuredWidth.current.get(props.cols[resizingCol].key).header;
        wLeft = measuredWidth.current.get(props.cols[resizingCol - 1].key).row;
        wRight = measuredWidth.current.get(props.cols[resizingCol].key).row;

        if (dW > 0)
            dW = determineMaxMovement(measuredWidth.current.get(props.cols[resizingCol - 1].key), dW);
        else
            dW = -determineMaxMovement(measuredWidth.current.get(props.cols[resizingCol].key), -dW);

        if (dW === 0)
            return;

        setPositionX(e.clientX);
        setFixedWidths((d) => {

            const u = new Map<string, IWidth>(d);

            if (!u.has(props.cols[resizingCol - 1].key))
                u.set(props.cols[resizingCol - 1].key, { header: undefined, row: undefined });
            else {
                whLeft = u.get(props.cols[resizingCol - 1].key).header;
                wLeft = u.get(props.cols[resizingCol - 1].key).row;
            } 
            if (!u.has(props.cols[resizingCol].key))
                u.set(props.cols[resizingCol].key, { header: undefined, row: undefined });
            else {
                whRight = u.get(props.cols[resizingCol].key).header;
                wRight = u.get(props.cols[resizingCol].key).row;
            } 

            u.get(props.cols[resizingCol - 1].key).header = whLeft - dW;
            u.get(props.cols[resizingCol].key).header = whRight + dW;
            u.get(props.cols[resizingCol - 1].key).row = wLeft - dW;
            u.get(props.cols[resizingCol].key).row = wRight + dW;

            return u;
        });

    }, [resizingCol, positionX]);

    const determineMaxMovement = (w: IWidth, dW: number) => {
        if (dW < 0)
            return dW;
        if (w.header <= minimumColWidth || w.row <= minimumColWidth)
            return 0;
        if (w.row === undefined || w.row === 0)
            return Math.min(dW, (w.header - minimumColWidth))
        if (w.header === undefined || w.header === 0)
            return Math.min(dW, (w.row - minimumColWidth))

        let ratio = w.header / w.row;
        if (ratio > 1)
            return Math.min(dW, (w.row - minimumColWidth))
        return Math.min(dW, (w.header - minimumColWidth))
    }

    const measureRowWidth = React.useCallback((key: string, width: number) => {
        if (measuredWidth.current.has(key))
            measuredWidth.current.get(key).row = width;
        else
            measuredWidth.current.set(key, { header: undefined, row: width });

        const canResize = props.cols.find(c => c.key === key)?.allowResize ?? true;
        if ((!fixedWidths.has(key) || fixedWidths.get(key).row === undefined))
            setFixedWidths((d) => {
                const u = new Map<string, IWidth>(d);
                u.set(key, { header: u.get(key)?.header, row: width })
                return u;
            });
            
        }, [props.cols, fixedWidths]);

    const measureHeaderWidth = React.useCallback((key: string, width: number) => {
        if (measuredWidth.current.has(key))
            measuredWidth.current.get(key).header = width;
        else
            measuredWidth.current.set(key, { header: width, row: undefined });

        if ((!fixedWidths.has(key) || fixedWidths.get(key).header === undefined))
            setFixedWidths((d) => {
                const u = new Map<string, IWidth>(d);
                u.set(key, { row: u.get(key)?.row, header: width })
                return u;
            });
    }, [props.cols, fixedWidths]);

    return (
        <table className={props.tableClass !== undefined ? props.tableClass : ''}
            style={props.tableStyle} onMouseLeave={handleMouseUp} onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Header<T> Class={props.theadClass}
                Style={props.theadStyle}
                Cols={props.cols}
                SortKey={props.sortKey}
                Ascending={props.ascending} Click={(d, e) => handleSort(d, e)}
                SetResizeColIndex={handleResizeSelect}
                AllowResize={allowResize}
                MeasureWidth={measureHeaderWidth}
                Width={fixedWidths}
            />
            <Rows<T>
                MeasureWidth={measureRowWidth}
                Width={fixedWidths}
                DragStart={props.onDragStart}
                Data={props.data} Cols={props.cols}
                RowStyle={props.rowStyle}
                BodyStyle={props.tbodyStyle}
                BodyClass={props.tbodyClass}
                Click={(data, e) => (props.onClick === undefined ? null : props.onClick(data, e))}
                Selected={props.selected} KeySelector={props.keySelector}
                SetTBodyWidth={setTotalWidth}
            />
            {props.lastRow !== undefined ? <tr style={(props.rowStyle !== undefined) ? { ...props.rowStyle } : {}} key={-1}>
                {props.lastRow}
            </tr> : null}
        </table>
    );
}

interface IRowProps<T> {
    Data: T[],
    Cols: Column<T>[],
    RowStyle?: React.CSSProperties,
    BodyStyle?: React.CSSProperties,
    BodyClass?: string,
    Click: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    DragStart?: ((data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void)
    Selected?: ((data: T) => boolean);
    KeySelector?: (data: T) => string;
    Width: Map<string, IWidth>;
    MeasureWidth: (key: string, width: number,) => void;
    SetTBodyWidth: (w: number) => void;
}
function Rows<T>(props: IRowProps<T>) {
    const tbody = React.useRef(null);

    React.useLayoutEffect(() => {
        if (tbody.current == null)
            return;
        const w = GetNodeSize(tbody.current)?.width ?? 0;
        props.SetTBodyWidth(w);
    });

    if (props.Data.length === 0) return null;

    const rows = props.Data.map((item, rowIndex) => {
        const cells = props.Cols.map((colData) => {
            return <Cell<T>
                key={colData.key}
                Style={colData.rowStyle}
                DataKey={colData.key}
                DataField={colData.field}
                Object={item}
                RowIndex={rowIndex}
                Content={colData.content}
                Click={(data, e) => props.Click(data, e)}
                DragStart={props.DragStart}
                MeasureWidth={(w) => props.MeasureWidth(colData.key, w)}
                Width={props.Width.get(colData.key)?.row}
            />
        });

        const style: React.CSSProperties = (props.RowStyle !== undefined) ? { ...props.RowStyle } : {};

        if (style.cursor === undefined)
            style.cursor = 'pointer';

        if (props.Selected !== undefined && props.Selected(item))
            style.backgroundColor = 'yellow';

        function ToKey(index: number, data: T): string {
            if (props.KeySelector === undefined)
                return index.toString();
            return props.KeySelector(data);

        }

        return (
            <tr style={style} key={ToKey(rowIndex, item)}>
                {cells}
            </tr>
        );
    });

    return (
        <tbody ref={tbody} style={props.BodyStyle} className={props.BodyClass}>{rows}</tbody>
    );
}

interface ICellProps<T> {
    Style?: React.CSSProperties,
    DataKey: string,
    DataField?: keyof T,
    Object: T,
    RowIndex: number,
    Content?: ((item: T, key: string, field: keyof T | undefined, style: React.CSSProperties, index: number) => React.ReactNode),
    Click: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    DragStart?: (data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number }, e: any) => void,
    Width: number|undefined,
    MeasureWidth: (width: number) => void
}

function Cell<T>(props: ICellProps<T>) {
    const tdRef = React.useRef(null);
    const css = React.useMemo(() => (props.Style !== undefined) ? {
        ...props.Style,
        width: (props.Width !== undefined) ? props.Width : props.Style.width
    } : {
        width: (props.Width !== undefined) ? props.Width : undefined
    }, [props.Width, props.Style]);


    if (props.DragStart !== undefined) css.cursor = "grab";

    const getFieldValue = () => props.DataField !== undefined ? props.Object[props.DataField] : null;

    const getFieldContent = () => props.Content !== undefined ? props.Content(props.Object, props.DataKey, props.DataField, css, props.RowIndex) : getFieldValue();

    React.useEffect(() => {
        if (tdRef.current == null)
            return;
        const w = GetNodeSize(tdRef.current)?.width ?? 0;
        props.MeasureWidth(w - 1);
    })

    return (
        <td
            ref={tdRef}
            style={css}
            onClick={(e) => props.Click({ colKey: props.DataKey, colField: props.DataField, row: props.Object, data: getFieldValue(), index: props.RowIndex }, e)}
            draggable={props.DragStart !== undefined}
            onDragStart={(e) => { if (props.DragStart !== undefined) props.DragStart({ colKey: props.DataKey, colField: props.DataField, row: props.Object, data: getFieldValue(), index: props.RowIndex }, e); }}
        >
            {getFieldContent() as string}
        </td>
    );
}

interface IHeaderProps<T> {
    Class?: string,
    Style?: React.CSSProperties,
    Cols: Column<T>[],
    SortKey: string,
    Ascending: boolean,
    ResizeColIndex?: number,
    SetResizeColIndex: (index: number, e: MouseEvent) => void,
    Click: (data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLElement, MouseEvent>) => void
    AllowResize: boolean,
    Width: Map<string, IWidth>,
    MeasureWidth: (key: string, width: number) => void
}
export function Header<T>(props: IHeaderProps<T>) {
    const [lastResize, setLastResize] = React.useState<number>(-1);
    const [firstResize, setFirstResize] = React.useState<number>(-1);

    React.useEffect(() => {
        const last = findLastIndex(props.Cols, (c:Column<T>) => c.allowResize === undefined || c.allowResize);
        const first = props.Cols.findIndex(c => c.allowResize === undefined || c.allowResize);
        setFirstResize(first);
        setLastResize(last);
    }, [props.Cols])

    const allowResize = React.useCallback((col, i) => {
        if (i == 0 || !props.AllowResize) return false;
        if (firstResize > -1 && i <= firstResize) return false;
        if (lastResize > -1 && i > lastResize) return false;
        return true;
    }, [firstResize, lastResize])

    return (<thead className={props.Class} style={props.Style}>
        <tr>{props.Cols.map((col, i) => <HeaderCell
            key={col.key}
            HeaderStyle={col.headerStyle}
            DataKey={col.key}
            Click={(e) => props.Click({ colKey: col.key, colField: col.field, ascending: props.Ascending }, e)}
            Label={col.label} SortKey={props.SortKey} Ascending={props.Ascending}
            PullBorder={allowResize(col, i) ? (e) => { props.SetResizeColIndex(i,e) } : undefined}
            MeasureWidth={(width) => props.MeasureWidth(col.key, width)}
            Width={props.Width.get(col.key)?.header}
        />)}
        </tr>
    </thead>)

}

interface IHeaderCellProps {
    HeaderStyle?: React.CSSProperties,
    DataKey: string,
    Click: (e: any) => void,
    Label: string | React.ReactNode,
    SortKey: string,
    Ascending: boolean,
    PullBorder?: (e: MouseEvent) => void,
    Width?: number,
    MeasureWidth: (width: number) => void
}
function HeaderCell(props: IHeaderCellProps) {
    const thRef = React.useRef(null);
    const [showBorder, setShowBorder] = React.useState(false);

    const style = React.useMemo(() => (props.HeaderStyle !== undefined) ? {
        ...props.HeaderStyle,
        width: (props.Width !== undefined) ? props.Width : props.HeaderStyle.width
    } : {
        width: (props.Width !== undefined) ? props.Width : undefined
    }, [props.Width, props.HeaderStyle]);

    if (style.cursor === undefined && props.DataKey !== null) {
        style.cursor = 'pointer';
    }

    if (style.position === undefined) {
        style.position = 'relative';
    }

    React.useEffect(() => {
        if (thRef.current == null)
            return;
        const w = GetNodeSize(thRef.current)?.width;
        if (w === undefined) return;
        props.MeasureWidth(w-1);
    })

    const onHover = React.useCallback(() => { setShowBorder(true); }, [])
    const onLeave = React.useCallback(() => { setShowBorder(false); }, [])
    const onClick: React.MouseEventHandler = React.useCallback((e) => { if (showBorder) { props.PullBorder!(e.nativeEvent); e.stopPropagation() } }, [showBorder])

    return (
        <th
            ref = {thRef}
            style={style}
            onClick={(e) => props.Click(e)}
        >
            {props.PullBorder != undefined ? <div style={{
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
                onMouseDown={onClick}
            ></div> : null}
            <RenderAngleIcon SortKey={props.SortKey} Key={props.DataKey} Ascending={props.Ascending} />
            <div style={{
                marginLeft: (props.SortKey === props.DataKey ? 25 : 0),
            }}>{props.Label}</div>
        </th>
    );
}

interface IRenderAngleProps {
    SortKey: string,
    Key: string,
    Ascending: boolean
}

function RenderAngleIcon(props: IRenderAngleProps) {

    const AngleIcon: React.FunctionComponent<{ ascending: boolean }> = (a) => a.ascending ? SVGIcons.ArrowDropUp : SVGIcons.ArrowDropDown;

    if (props.SortKey === null)
        return null;

    if (props.SortKey !== props.Key)
        return null;

    return <div style={{ position: 'absolute', width: 25 }}>
        <AngleIcon ascending={props.Ascending} />
    </div>
}