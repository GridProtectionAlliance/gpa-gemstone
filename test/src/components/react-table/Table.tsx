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
/**
 * This is not a visually functional table (data sorting, etc. ) but it sets data like one
 */
const TableTestingComponent: React.FC<{ ComponentTestID: string }> = (props) => {
    const [data, setData] = React.useState<Book[]>([]);
    const [sortKey, setSortKey] = React.useState<keyof Book>('title');
    const [asc, setAsc] = React.useState<boolean>(true);

    React.useEffect(() => {
        setData(tableData.slice());
    }, []);

    const headerHeight = 45;
    const bodyHeight = 300;
    const containerHeight = bodyHeight + headerHeight + 1;
    const containerWidth = 700;

    return (
        <div className="border" style={{ maxHeight: `${containerHeight}px`, maxWidth: `${containerWidth}px` }}>
            <Table<Book>
                TableClass={`${props.ComponentTestID} table table-hover`}
                RowStyle={{ fontSize: 'smaller' }}
                TheadStyle={{ fontSize: 'smaller', maxHeight: `${headerHeight}px` }}
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
                OnClick={(rowClicked) => {
                    alert(`${props.ComponentTestID}: ${rowClicked.row.title}`);
                }}
                KeySelector={(d) => `${d.volume}-${d.title}`}
            >
                <Column<Book>
                    Key="title"
                    AllowSort={true}
                    Field="title"
                    HeaderStyle={{ width: 'auto' }}
                    RowStyle={{ width: 'auto' }}
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
    );
};

export default TableTestingComponent;
