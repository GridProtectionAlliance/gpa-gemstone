//******************************************************************************************************
//  Table.tsx - Gbtc
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
//       Updated to use Great Books of the Western World data.
//
//******************************************************************************************************

import { Column, Table } from "@gpa-gemstone/react-table";
import tableData from '../../test-data/table_test_data.json';
import React from "react";

type Book = {
    title: string;
    author: string;
    volume: number;
    category: string;
};

const TableTestingComponent: React.FC<{ ComponentTestID: string }> = (props) => {
    const [data, setData] = React.useState<Book[]>([]);
    const [sortKey, setSortKey] = React.useState<keyof Book>('title');
    const [asc, setAsc] = React.useState<boolean>(true);

    React.useEffect(() => {
        setData(tableData.slice(40));
    }, []);

    return (
        <div className="row h-30 border m-3 d-flex justify-content-center align-items-center">
            <div className="container-fluid d-flex flex-column align-items-center">
                <div className="row" style={{ flex: 1, overflow: 'hidden', justifyContent: 'center' }}>
                    <Table<Book>
                        TableClass={`${props.ComponentTestID} table table-hover`}
                        RowStyle={{ fontSize: 'smaller' }}
                        TheadStyle={{ fontSize: 'smaller' }}
                        TbodyStyle={{
                            fontStyle: 'italic',
                            flex: 1, // Make sure tbody takes available space and scrolls if needed
                            overflowY: 'auto', // Enable vertical scrolling
                            maxHeight: '300px', // Set a max height for the body
                        }}
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
                        OnClick={(rowClicked) => {
                            alert(`${props.ComponentTestID}: ${rowClicked.row.title}`);
                        }}
                        KeySelector={(d) => `${d.volume}-${d.title}`}
                    >
                        <Column<Book>
                            Key="title"
                            AllowSort={true}
                            Field="title"
                            HeaderStyle={{ width: '20%' }}
                            RowStyle={{ width: '20%' }}
                        >
                            Title
                        </Column>
                        <Column<Book>
                            Key="author"
                            AllowSort={true}
                            Field="author"
                            HeaderStyle={{ width: 'auto' }}
                            RowStyle={{ width: 'auto' }}
                        >
                            Author
                        </Column>
                        <Column<Book>
                            Key="volume"
                            AllowSort={true}
                            Field="volume"
                            HeaderStyle={{ width: 'auto' }}
                            RowStyle={{ width: 'auto' }}
                        >
                            Vol.
                        </Column>
                        <Column<Book>
                            Key="category"
                            AllowSort={true}
                            Field="category"
                            HeaderStyle={{ width: 'auto' }}
                            RowStyle={{ width: 'auto' }}
                        >
                            Category
                        </Column>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default TableTestingComponent;
