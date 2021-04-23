﻿// ******************************************************************************************************
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
import Table, {TableProps} from './Table';

export interface ISelectTableProps<T> {
	cols: {
		key: keyof T;
		label: string;
		headerStyle?: React.CSSProperties;
		rowStyle?: React.CSSProperties;
		content?(item: T, key: keyof T, style: React.CSSProperties): React.ReactNode;
	  }[];
	data: T[];
	sortField: string;
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

export function SelectTable<T>(props: ISelectTableProps<T>) {
	const didMountRef = React.useRef(false);
	
    const [data, setData] = React.useState<T[]>(props.data);
    const [selected, setSelected] = React.useState<any[]>([]);

    const [sortField, setSortField] = React.useState<string>(props.sortField);
    const [ascending, setAscending] = React.useState<boolean>(props.ascending);

	React.useEffect(() => {
		if (didMountRef.current)
			selectAll();
		else
			didMountRef.current = true;
	},[props.selectAllCounter]);
	
    React.useEffect(() => {
        if (props.data.length !== data.length)
            setData(props.data);
    }, [props.data]);

    React.useEffect(() => {
        setSelected((d) => d.filter(keyItem => data.findIndex(item => item[props.KeyField] === keyItem) > -1))
    }, [data]);

    React.useEffect(() => {
        setData((lst) => (_.orderBy(lst, [sortField], [(ascending ? "asc" : "desc")])))
    }, [ascending, sortField]);

    React.useEffect(() => {
        props.onSelection(data.filter(item => selected.findIndex(key => key === item[props.KeyField]) > -1));
    }, [selected])

    function handleClick(
        d: { col: keyof T; row: T; data: any },
        event: React.MouseEvent < HTMLTableHeaderCellElement, MouseEvent >,
    ) {
        const sIndex = selected.findIndex(item => item === d.row[props.KeyField]);
        if (sIndex === -1)
            setSelected((od) => [...od, d.row[props.KeyField]])
        else
            setSelected((od) => od.filter(item => item !== d.row[props.KeyField]));
    }

	function selectAll() {
		setSelected((d) => {if (d.length === data.length) return []; else return _.cloneDeep(data); });
	}
	
    function handleSort(
        d: { col: keyof T; ascending: boolean },
    ) {
        if (d.col === sortField)
            setAscending(!ascending);
        else 
            setSortField(d.col as string);
    }

    const tableProps: TableProps<T> = {
        cols: [
            { key: props.KeyField, label: '', headerStyle: { width: '4em' }, rowStyle: { width: '4em' }, content: (item: T, key: keyof T, style: React.CSSProperties) => (selected.findIndex(i => i === item[props.KeyField]) > -1 ? <div style={{ marginTop: '16px', textAlign: 'center' }}><i className="fa fa-check-square-o fa-3x" aria-hidden="true"></i></div> : null) },
            ...props.cols
        ],
        data,
        onClick: handleClick,
        sortField,
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

