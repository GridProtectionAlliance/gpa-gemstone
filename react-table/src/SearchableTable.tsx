// ******************************************************************************************************
//  SearchableTable.tsx - Gbtc
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
//  07/12/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import Table, {TableProps} from './Table';

interface ISearchableTableProps<T> extends TableProps<T> {
  /**
   * Function used to filter data
   * @param item: The T to be matched
   * @param search: The string to search by
   * @returns: true if the item should be shown in the Table
   */
  matchSearch: (item: T, search: string) => boolean;
}

/**
 * A Table with an input Field to search on top
 */
export function SearchableTable<T>(props: ISearchableTableProps<T>) {
  const [data, setData] = React.useState<T[]>(props.data);
  const [searchTextAS, setSearchTextAS] = React.useState<string>('');

  React.useEffect(() => {
    setData(props.data.filter(s => props.matchSearch(s,searchTextAS)))
  }, [props.data, searchTextAS]);

  return <>
    <input className="form-control" placeholder="Search filter for select box ..." value={searchTextAS} onChange={(e) => setSearchTextAS(e.target.value)} />
    <Table {...props} data={data} />
  </>
}
