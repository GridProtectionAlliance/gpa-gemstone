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
//       Generated original code.
//
//******************************************************************************************************

import { Column, Table } from "@gpa-gemstone/react-table";
import tableData from '../../test-data/table_test_data.json';
import React from "react";
import { tableTestContainerWidth } from "./ConfigurableTable";

export interface IBook {
    Title: string;
    Author: string;
    Volume: number;
    Category: string;
};

const headerHeight = 45;
const bodyHeight = 300;
const containerHeight = bodyHeight + headerHeight + 1;

export const TABLE_TEST_ID = 'table-test-id';

/**
 * This is not a visually functional table (data sorting, etc. ) but it sets data like one
 */
const TableTestingComponent = () => {
    const data = tableData.slice();
    const [sortKey, setSortKey] = React.useState<keyof IBook>('Title');
    const [asc, setAsc] = React.useState<boolean>(true);

    return (
        <div className="row m-0">
            <div className="col p-0">
                <div id={TABLE_TEST_ID} style={{ maxHeight: `${containerHeight}px`, maxWidth: `${tableTestContainerWidth}px` }}>
                    <Table<IBook>
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
                                setSortKey(clickedCol.colKey as keyof IBook);
                        }}
                        OnClick={(rowClicked) => {
                            alert(`${TABLE_TEST_ID}: ${rowClicked.row.Title}`);
                        }}
                        KeySelector={(d) => `${d.Volume}-${d.Title}`}
                    >
                        <Column<IBook>
                            Key="Title"
                            AllowSort={true}
                            Field="Title"
                            HeaderStyle={{ width: '50%' }}
                            RowStyle={{ width: '50%' }}
                        >
                            Title
                        </Column>
                        <Column<IBook>
                            Key="Author"
                            AllowSort={false}
                            Field="Author"
                            HeaderStyle={{ width: 'auto' }}
                            RowStyle={{ width: 'auto' }}
                        >
                            Author
                        </Column>
                        <Column<IBook>
                            Key="Volume"
                            AllowSort={true}
                            Field="Volume"
                            HeaderStyle={{ width: 'auto' }}
                            RowStyle={{ width: 'auto' }}
                        >
                            Vol.
                        </Column>
                        <Column<IBook>
                            Key="Category"
                            AllowSort={true}
                            Field="Category"
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
