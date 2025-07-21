//******************************************************************************************************
//  ConfigurableTable.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  05/14/2025 - Collins Self
//       Generated original code.
//
//******************************************************************************************************

import { ConfigurableTable, ConfigurableColumn, Column } from "@gpa-gemstone/react-table";
import tableData from '../../test-data/table_test_data.json';
import React from "react";
import _ from "lodash";

type Book = {
    Title: string;
    Author: string;
    Volume: number;
    Category: string;
};

const ConfigurableTableTestComponent: React.FC<{ ComponentTestID: string }> = (props) => {
    const [data, setData] = React.useState<Book[]>([]);
    const [sortKey, setSortKey] = React.useState<keyof Book>('Title');
    const [asc, setAsc] = React.useState<boolean>(true);
    const [cols, setCols] = React.useState<string[]>([]);
    const [cols2, setCols2] = React.useState<string[]>([]);
    const [data2, setData2] = React.useState<Book[]>([]);
    const [sortKey2, setSortKey2] = React.useState<keyof Book>('Title');
    const [asc2, setAsc2] = React.useState<boolean>(true);

    React.useEffect(() => {
        setData(tableData.slice());
        setData2(tableData.slice());
    }, []);

    React.useEffect(() => {
        if (data.length == 0)
            return;
        const updatedCols = Object.keys(data[0]);
        if (!_.isEqual(updatedCols, cols))
            setCols(updatedCols);
    }, [sortKey, data]);

    React.useEffect(() => {
        if (data2.length == 0)
            return;
        const updatedCols = Object.keys(data2[0]);
        if (!_.isEqual(updatedCols, cols2))
            setCols2(updatedCols);
    }, [sortKey2, data2]);

    const handleRowClick = React.useCallback((rowClicked) => {
        alert(`${props.ComponentTestID}: ${rowClicked.row.Title}`);
    }, []);

    const headerHeight = 45;
    const bodyHeight = 300;
    const containerHeight = bodyHeight + headerHeight + 1;
    const containerWidth = 700;

    const renderedColumns = cols2.map(col =>
        col === 'Author' ?
        <ConfigurableColumn Key={col} Default={true} Label={col} key={col}>
            <Column<any> key={col}
                Key={col} Field={col}
                AllowSort={false} Adjustable={false}
                HeaderStyle={{ width: 'auto', minWidth: '20%' }}
                RowStyle={{ width: 'auto', minWidth: '20%' }}
            >{col}
            </Column>
        </ConfigurableColumn>
        : <ConfigurableColumn Key={col} Default={true} Label={col} key={col}>
            <Column<any> key={col}
                Key={col} Field={col}
                AllowSort={true} Adjustable={false}
                HeaderStyle={{ width: 'auto', minWidth: '20%' }}
                RowStyle={{ width: 'auto', minWidth: '20%' }}
            >{col}
            </Column>
        </ConfigurableColumn>
    )

    return (<>
        <div id={props.ComponentTestID + "-1"} className="border col p-0 m-0" style={{ maxHeight: `${containerHeight}px`, maxWidth: `${containerWidth}px` }}>
            <ConfigurableTable<Book>
                TableClass={`table table-hover`}
                RowStyle={{ fontSize: 'smaller', fontWeight: 'bolder' }}
                TheadStyle={{ fontSize: 'smaller', fontWeight: 'lighter', maxHeight: `${headerHeight}px` }}
                TbodyStyle={{ fontStyle: 'italic', maxHeight: `${bodyHeight}px` }}
                TfootStyle={{ fontStyle: 'bold' }}
                Data={data}
                SortKey={sortKey}
                Ascending={asc}
                OnSort={(clickedCol) => {
                    if (clickedCol.colKey === sortKey)
                        setAsc(!asc);
                    else
                        setSortKey(clickedCol.colKey as keyof Book);
                }}
                OnClick={handleRowClick}
                KeySelector={(d) => `${d.Volume}-${d.Title}`}
                ModalZIndex={30000}
                //SettingsPortal={}
                OnSettingsChange={() => { }}
                LocalStorageKey={props.ComponentTestID + '-1'}
            >
                <ConfigurableColumn Key="Title" Default={true} Label={'Title'}>
                    <Column<Book>
                        Key="Title"
                        AllowSort={true}
                        Field="Title"
                        HeaderStyle={{ width: '50%' }}
                        RowStyle={{ width: '50%' }}
                    >
                        Title
                    </Column>
                </ConfigurableColumn>
                <ConfigurableColumn Key="Author" Default={true} Label={'Author'}>
                    <Column<Book>
                        Key="Author"
                        AllowSort={false}
                        Field="Author"
                        HeaderStyle={{ width: 'auto' }}
                        RowStyle={{ width: 'auto' }}
                    >
                        Author
                    </Column>
                </ConfigurableColumn>
                <ConfigurableColumn Key="Volume" Default={true} Label={'Vol.'}>
                    <Column<Book>
                        Key="Volume"
                        AllowSort={true}
                        Field="Volume"
                        HeaderStyle={{ width: 'auto' }}
                        RowStyle={{ width: 'auto' }}
                    >
                        Volume
                    </Column>
                </ConfigurableColumn>
                <ConfigurableColumn Key="Category" Default={true} Label={'Category'}>
                    <Column<Book>
                        Key="Category"
                        AllowSort={true}
                        Field="Category"
                        HeaderStyle={{ width: 'auto' }}
                        RowStyle={{ width: 'auto' }}
                    >
                        Category
                    </Column>
                </ConfigurableColumn>
            </ConfigurableTable>
        </div>
        <div id={props.ComponentTestID + "-2"} className="border col p-0 m-0 ml-3" style={{ maxHeight: `${containerHeight}px`, maxWidth: `${containerWidth}px` }}>
            <ConfigurableTable<Book>
                TableClass={`table table-hover`}
                RowStyle={{ fontSize: 'smaller', fontWeight: 'bolder' }}
                TheadStyle={{ fontSize: 'smaller', fontWeight: 'lighter', maxHeight: `${headerHeight}px` }}
                TbodyStyle={{ fontStyle: 'italic', maxHeight: `${bodyHeight}px` }}
                TfootStyle={{ fontStyle: 'bold' }}
                Data={data2}
                SortKey={sortKey2}
                Ascending={asc2}
                OnSort={(clickedCol) => {
                    if (clickedCol.colKey === sortKey2)
                        setAsc2(!asc2);
                    else
                        setSortKey2(clickedCol.colKey as keyof Book);
                }}
                OnClick={(rowClicked) => {
                    alert(`${props.ComponentTestID}: ${rowClicked.row.Title}`);
                }}
                KeySelector={(d) => `${d.Volume}-${d.Title}`}
                ModalZIndex={30000}
                //SettingsPortal={}
                OnSettingsChange={() => {}}
                LocalStorageKey={props.ComponentTestID + '-2'}
            >
                {renderedColumns}
        </ConfigurableTable>
    </div>
    <p id='testing-col-state' className='d-none'>{...cols2}</p>
    <p id='testing-localstorage-state' className='d-none'>{localStorage.getItem(props.ComponentTestID + '-2')}</p>
    <p id='testing-renderedCols-state' className='d-none'>{renderedColumns}</p>
    </>);
}

export default ConfigurableTableTestComponent;
