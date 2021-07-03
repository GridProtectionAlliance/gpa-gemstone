//  ******************************************************************************************************
//  Table.tsx - Gbtc
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
//
//  ******************************************************************************************************

import * as React from 'react';
import {CreateGuid} from '@gpa-gemstone/helper-functions';

interface Column<T> {
  key: string;
  label: string;
  field?: keyof T;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  content?(item: T, key: string, field: keyof T|undefined, style: React.CSSProperties, index: number): React.ReactNode;
}

export interface TableProps<T> {
  cols: Column<T>[];
  data: T[];
  onClick: (data: { colKey: string; colField?: keyof T; row: T; data: T[keyof T]|null, index: number }, event: any) => void;
  sortKey: string;
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
}

export default function Table<T> (props: TableProps<T>) {
  return (
    <table className={props.tableClass !== undefined ? props.tableClass : ''} style={props.tableStyle}>
      <Header<T> Class={props.theadClass} Style={props.theadStyle} Cols={props.cols} SortKey={props.sortKey} Ascending={props.ascending} Click={(d,e) => handleSort(d,e)} />
      <Rows<T> Data={props.data} Cols={props.cols} RowStyle={props.rowStyle} BodyStyle={props.tbodyStyle} BodyClass={props.tbodyClass} Click={(data,e) => props.onClick(data, e)} Selected={props.selected} />
    </table>
  );

  function handleSort(
    data: { colKey: string; colField?: keyof T; ascending: boolean },
    event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
  ) {
    if (data.colKey !== null)
      props.onSort(data);
  }
}

function Rows<T>(props: {
  Data: T[],
  Cols: Column<T>[],
  RowStyle?: React.CSSProperties,
  BodyStyle?: React.CSSProperties,
  BodyClass?: string,
  Click :( data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number },e : React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void,
  Selected?: ((data: T) => boolean),
}) {
  if (props.Data.length === 0) return null;
  const rows = props.Data.map((item, rowIndex) => {
    const cells = props.Cols.map((colData) => {
      return <Cell<T> key={colData.key} Style={colData.rowStyle} DataKey={colData.key} DataField={colData.field} Object={item} RowIndex={rowIndex} Content={colData.content} Click={(data,e) => props.Click(data,e)} />
    });

    const style: React.CSSProperties = (props.RowStyle !== undefined) ? { ...props.RowStyle } : {};

    if (style.cursor === undefined)
      style.cursor = 'pointer';

    if (props.Selected !== undefined && props.Selected(item))
      style.backgroundColor = 'yellow';

    return (
      <tr style={style} key={CreateGuid()}>
        {cells}
      </tr>
    );
  });

  return (
    <tbody style={props.BodyStyle} className={props.BodyClass}>{rows}</tbody>
  );
}

function Cell<T>(props: {
  Style?: React.CSSProperties,
  DataKey: string,
  DataField?: keyof T,
  Object: T,
  RowIndex: number,
  Content?: ((item: T, key: string, field: keyof T|undefined, style: React.CSSProperties, index: number) => React.ReactNode),
  Click :( data: { colKey: string, colField?: keyof T, row: T, data: T[keyof T] | null, index: number },e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void
}) {
  const css: React.CSSProperties = (props.Style !== undefined) ? { ...props.Style } : {};

  const getFieldValue = () => props.DataField !== undefined ? props.Object[props.DataField] : null;

  const getFieldContent = () => props.Content !== undefined ? props.Content(props.Object, props.DataKey, props.DataField, css, props.RowIndex) : getFieldValue();

  return (
    <td
      style={css}
      onClick={(e) => props.Click({colKey: props.DataKey, colField: props.DataField, row: props.Object, data: getFieldValue(), index: props.RowIndex }, e)}
    >
      {getFieldContent()}
    </td>
  );
}

function Header<T>(props: {
  Class?: string,
  Style?: React.CSSProperties,
  Cols: Column<T>[],
  SortKey: string,
  Ascending: boolean,

  Click: (data: { colKey: string; colField?: keyof T; ascending: boolean }, event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void
}) {

  return (<thead className={props.Class} style={props.Style}><tr>{props.Cols.map((col) => <HeaderCell<T> key={col.key} HeaderStyle={col.headerStyle} DataKey={col.key} Click={(e) => props.Click({colKey: col.key, colField: col.field, ascending: props.Ascending},e)} Label={col.label} SortKey={props.SortKey} Ascending={props.Ascending} />)}</tr></thead>)

}

function HeaderCell<T> (props: {HeaderStyle?: React.CSSProperties, DataKey: string, Click: (e: any) => void, Label: string, SortKey: string, Ascending: boolean}) {
  const style: React.CSSProperties = (props.HeaderStyle !== undefined) ? props.HeaderStyle : {};

  if (style.cursor === undefined && props.DataKey !== null) {
    style.cursor = 'pointer';
  }

  if (style.position === undefined) {
    style.position = 'relative';
  }

  return (
    <th
      style={style}
      onClick={(e) => props.Click(e)}
    >

      <RenderAngleIcon<T> SortKey={props.SortKey} Key={props.DataKey} Ascending={props.Ascending} />
      <div style={{marginLeft: 10}}>{props.Label}</div>
    </th>
  );
}

function RenderAngleIcon<T>(props:{
  SortKey: string,
  Key: string,
  Ascending: boolean
}) {

  const AngleIcon: React.FunctionComponent<{ ascending: boolean }> = () => (
    <div
      style={{ position: 'absolute', top: 10, transform: (props.Ascending ? 'rotate(0deg)' : 'rotate(180deg)') }}>{ '^'}</div>
  );

  if (props.SortKey === null)
    return null;

  if (props.SortKey !== props.Key)
    return null;

  return <AngleIcon ascending={props.Ascending} />
};