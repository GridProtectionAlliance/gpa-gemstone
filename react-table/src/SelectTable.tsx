// ******************************************************************************************************
//  SelectTable.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  01/22/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as _ from 'lodash';
import Table, {Column, TableProps} from './Table';

export interface ISelectTableProps<T> {
    cols: Column<T>[];
    data: T[];
    sortKey: string;
    ascending: boolean;
    tableClass?: string;
    tableStyle?: React.CSSProperties;
    theadStyle?: React.CSSProperties;
    theadClass?: string;
    tbodyStyle?: React.CSSProperties;
    tbodyClass?: string;
    rowStyle?: React.CSSProperties;
    onSelection: (selected: T[]) => void;
    KeyField: keyof T;
    selectAllCounter?: number;
}

export function SelectTable<T extends {}>(props: ISelectTableProps<T>) {
    const didMountRef = React.useRef(false);

    const [data, setData] = React.useState<T[]>(props.data);
    const [selected, setSelected] = React.useState<any[]>([]);

    const [sortKey, setSortKey] = React.useState<string>(props.sortKey);
    const [ascending, setAscending] = React.useState<boolean>(props.ascending);

    React.useEffect(() => {
        if (didMountRef.current)
            selectAll();
        else
            didMountRef.current = true;
    }, [props.selectAllCounter]);

    React.useEffect(() => {
        if (props.data.length !== data.length)
            setData(props.data);
    }, [props.data]);

    React.useEffect(() => {
        setSelected((d) => d.filter(keyItem => data.findIndex(item => item[props.KeyField] === keyItem) > -1))
    }, [data]);

    React.useEffect(() => {
        const sortColumn = props.cols.filter(col => col.key === sortKey)[0];

        if (sortColumn === undefined || sortColumn.field === undefined)
            return;

        const sortField: keyof T = sortColumn.field;
        setData((lst) => (_.orderBy(lst, [sortField], [(ascending ? "asc" : "desc")])))
    }, [ascending, sortKey]);

    React.useEffect(() => {
        props.onSelection(data.filter(item => selected.findIndex(key => key === item[props.KeyField]) > -1));
    }, [selected])

    function handleClick(
        d: { colKey: string; row: T; data: any },
        event: React.MouseEvent < HTMLTableHeaderCellElement, MouseEvent >,
    ) {
        const sIndex = selected.findIndex(item => item === d.row[props.KeyField]);
        if (sIndex === -1)
            setSelected((od) => [...od, d.row[props.KeyField]])
        else
            setSelected((od) => od.filter(item => item !== d.row[props.KeyField]));
    }

    function selectAll() {
        setSelected((d) => {if (d.length === data.length) return []; else return data.map(row => row[props.KeyField]); });
    }

    function handleSort(
        d: { colKey: string; ascending: boolean },
    ) {
        if (d.colKey === sortKey)
            setAscending(!ascending);
        else
            setSortKey(d.colKey);
    }

    const tableProps: TableProps<T> = {
        cols: [
            { key: 'gemstone-checkbox', field: props.KeyField, label: '', headerStyle: { width: '4em' }, rowStyle: { width: '4em' }, content: (item: T, key: string, field: keyof T|undefined, style: React.CSSProperties) => {
                const index = selected.findIndex(i => i === item[props.KeyField])
                if ( index > -1)
                    return <div style={{ marginTop: '16px', textAlign: 'center' }}><i className="fa fa-check-square-o fa-3x"></i></div>
                return null
            }},
            ...props.cols
        ],
        data,
        onClick: handleClick,
        sortKey,
        ascending,
        onSort: handleSort,
        tableClass: props.tableClass,
        tableStyle: props.tableStyle,
        theadStyle: props.theadStyle,
        theadClass: props.theadClass,
        tbodyStyle: props.tbodyStyle,
        tbodyClass: props.tbodyClass,
        selected: (d: T) => false,
        rowStyle: props.rowStyle
    };

    return <Table {...tableProps} />;
}
