// ******************************************************************************************************
//  DynamicTable.tsx - Gbtc
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
//  07/26/2021 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import { Column, Header, Rows } from './Table';

export interface DynamicTableProps<T> {
  /**
   * List of T objects used to generate rows
   */
  data: T[];
  onClick: (data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T]|null, index: number }, event: any) => void;
  /**
   * Key of the collumn to sort by
   */
  sortKey: string;
  /**
   * Boolen to indicate whether the sort is ascending or descending
   */
  ascending: boolean;
  onSort(data: { colKey: string; colField?: keyof T; ascending: boolean }): void;
  tableClass?: string;
  tableStyle?: React.CSSProperties;
  theadStyle?: React.CSSProperties;
  theadClass?: string;
  tbodyStyle?: React.CSSProperties;
  tbodyClass?: string;
  selected?(data: T): boolean;
  rowStyle?: React.CSSProperties;
  keySelector?: (data: T) => string;
}

export function DynamicTable<T>(props: DynamicTableProps<T>) {
    if (props.data.length <= 0) return null;

    const cols: Column<T>[] = [];
    const keys = Object.keys(props.data[0]);
    for (const key of keys) {
        cols.push({ key, label: key, field: key as keyof T})
    }

  return (
    <table className={props.tableClass !== undefined ? props.tableClass : ''} style={props.tableStyle}>
      <Header<T> Class={props.theadClass} Style={props.theadStyle} Cols={cols} SortKey={props.sortKey} Ascending={props.ascending} Click={(d,e) => handleSort(d)} />
      <Rows<T> Data={props.data} Cols={cols} RowStyle={props.rowStyle} BodyStyle={props.tbodyStyle} BodyClass={props.tbodyClass} Click={(data,e) => props.onClick(data, e)} Selected={props.selected} KeySelector={props.keySelector} />
    </table>
  );

  function handleSort(
    data: { colKey: string; colField?: keyof T; ascending: boolean }
  ) {
    if (data.colKey !== null)
      props.onSort(data);
  }
}
