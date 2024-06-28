//  ******************************************************************************************************
//  index.tsx - Gbtc
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
//  02/12/2021 - C. lackner
//       Moved table to seperate File.
//
//  ******************************************************************************************************

import Table, {TableProps,Rows, Column} from './Table';
import {SelectTable, ISelectTableProps} from './SelectTable';
import { SearchableTable } from './SearchableTable';
import { DynamicTableProps, DynamicTable } from './DynamicTable';
import Paging from './Paging';
import AdjustableTable from './AdjustableTable/Table';
import UpdatedColumn from './AdjustableTable/Column';
import AdjustableColumn from './AdjustableTable/AdjustableColumn';

const ReactTable = {
	Table: AdjustableTable,
	Column: UpdatedColumn,
	AdjustableColumn: AdjustableColumn,
}

export {
	ReactTable,
	TableProps, SelectTable, ISelectTableProps, SearchableTable, DynamicTable, DynamicTableProps , Rows, Column, Paging
}

export default Table;
