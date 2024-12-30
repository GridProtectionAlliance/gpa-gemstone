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

import Paging from './Paging';
import * as ReactTableProps from './AdjustableTable/Types';
import { AdjustableTable } from './AdjustableTable/Table';
import { Column, AdjustableColumn } from './AdjustableTable/Column';
import FilterableTable from './FilterableTable/FilterableTable';
import FilterableColumn from './FilterableTable/FilterableColumn';
import ConfigurableTable from './ConfigurableTable/ConfigurableTable';
import ConfigurableColumn from './ConfigurableTable/ConfigurableColumn';

const ReactTable = {
	Table: AdjustableTable,
	Column: Column,
	AdjustableColumn: AdjustableColumn,
}

const ConfigTable = {
  Table: ConfigurableTable,
  Configurable: ConfigurableColumn,
}

export {
	ReactTable,
	ReactTableProps,
	ConfigTable,
	FilterableTable, FilterableColumn,
	Paging
}
