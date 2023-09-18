// ******************************************************************************************************
//  FilterableTable.tsx - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  03/02/2022 - C. Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Table, { TableProps, Column } from '@gpa-gemstone/react-table';
import {Search} from '../SearchBar';
import { SVGIcons } from '@gpa-gemstone/gpa-symbols';
import { BooleanFilter } from './BooleanFilter';
import { TextFilter } from './TextFilter';
import { EnumFilter } from './EnumFilter';
import { NumberFilter, IUnit } from './NumberFilter';
import { DateFilter, DateTimeFilter, TimeFilter } from './DateTimeFilters';
import { CreateGuid} from '@gpa-gemstone/helper-functions';

interface IOptions { Value: string | number, Label: string }

     
interface IFilterableCollumn<T> extends Column<T> { 
    Type?: Search.FieldType, 
    Enum?: IOptions[],
    ExpandedLabel?: string,
    Unit?: IUnit[]
}

interface IProps<T> extends TableProps<T> {
    SetFilter: (filters: Search.IFilter<T>[]) => void,
    cols: IFilterableCollumn<T>[],
    DefaultFilter?: Search.IFilter<T>[]
}

/**
 * Table with Filters in the column Headers
 */
export default function FilterableTable<T>(props: IProps<T>) {
    const [filters, setFilters] = React.useState<Search.IFilter<T>[]>((props.DefaultFilter === undefined ? [] : props.DefaultFilter));
    const [guid] = React.useState<string>(CreateGuid());

    function updateFilters(flts: Search.IFilter<T>[], fld: string | number | symbol| undefined) {
        setFilters((fls) => {
            const otherFilters = fls.filter(item => item.FieldName !== fld);
            return otherFilters.concat(flts);
        })
    }

    React.useEffect(() => { props.SetFilter(filters); }, [filters]);

    return (
        <>
            <Table
                cols={props.cols.map(c => ({
                    ...c, label: <Header
                        Label={c.label}
                        Filter={filters.filter(f => f.FieldName === c.field?.toString())}
                        SetFilter={(f) => updateFilters(f, c.field)}
                        Field={c.field}
                        Type={c.Type}
                        Options={c.Enum}
                        ExpandedLabel={c.ExpandedLabel}
                        Guid={guid}
                        Unit={c.Unit}
                    />
                }))}
                data={props.data}
                onClick={props.onClick}
                sortKey={props.sortKey}
                ascending={props.ascending}
                onSort={(d,evt) => {
                    // make sure we do not sort when clicking on the filter
                    const $div = evt.target.closest(`div[data-tableid="${guid}"]`);
                    if ($div === null)
                        props.onSort(d,evt);
                }}
                tableClass={props.tableClass}
                tableStyle={props.tableStyle}
                theadStyle={props.theadStyle}
                theadClass={props.theadClass}
                tbodyStyle={props.tbodyStyle}
                tbodyClass={props.tbodyClass}
                selected={props.selected}
                rowStyle={props.rowStyle}
                keySelector={props.keySelector}
            />

        </>
    );

}

interface IHeaderProps<T> {
    Label: string | React.ReactNode,
    Type?: Search.FieldType,
    Unit?: IUnit[],
    Filter: Search.IFilter<T>[],
    SetFilter: (flt: Search.IFilter<T>[]) => void,
    Field: string | number | symbol | undefined,
    Options?: IOptions[],
    ExpandedLabel?: string,
    Guid: string,
}

function Header<T>(props: IHeaderProps<T>) {
    const [show, setShow] = React.useState<boolean>(false);

    return <>
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <div style={{ marginRight: 25 }} >
            {props.Label}
            </div>
            {props.Type !== undefined ? <>
                <div style={{ width: 25, position: 'absolute', right: 12, top: 12 }}>
                    {props.Filter.length > 0? SVGIcons.Filter : null}
                </div>
                <div
                    style={{
                        maxHeight: window.innerHeight * 0.50,
                        overflowY: 'auto',
                        padding: '10 5',
                        display: show ? 'block' : 'none', 
                        position: 'absolute',
                        backgroundColor: '#fff',
                        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                        zIndex: 401,
                        minWidth: 'calc(100% - 50px)',
                        marginLeft: -25
                    }} data-tableid={props.Guid}
                >
                    {/*onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); }}*/}
                    <table style={{ margin: 0 }}>
                        <tbody>
                            {((props.ExpandedLabel !== null) && (props.ExpandedLabel !== "") && (props.ExpandedLabel !== undefined)) ? 
                                <tr>
                                    <th colSpan={props.Type === 'boolean' ? 2 : 1}>
                                        <label>{props.ExpandedLabel}</label>
                                    </th>
                                </tr>
                            : null} 
                            {props.Type === 'boolean' ? <BooleanFilter
                                SetFilter={props.SetFilter}
                                Filter={props.Filter}
                                FieldName={props.Field?.toString() ?? ''}
                            /> : null}
                            {props.Type === 'string' ? <TextFilter
                                SetFilter={props.SetFilter}
                                Filter={props.Filter}
                                FieldName={props.Field?.toString() ?? ''}
                            /> : null}
                            {props.Type === 'enum' && props.Options !== undefined ? <EnumFilter
                                FieldName={props.Field?.toString() ?? ''}
                                Filter={props.Filter}
                                SetFilter={props.SetFilter}
                                Options={props.Options}
                            /> : null}
                            {props.Type === 'date' ? <DateFilter
                                FieldName={props.Field?.toString() ?? ''}
                                Filter={props.Filter}
                                SetFilter={props.SetFilter}
                            /> : null}
                            {props.Type === 'time' ? <TimeFilter
                                FieldName={props.Field?.toString() ?? ''}
                                Filter={props.Filter}
                                SetFilter={props.SetFilter}
                            /> : null}
                            {props.Type === 'number' ? <NumberFilter
                                FieldName={props.Field?.toString() ?? ''}
                                Filter={props.Filter}
                                SetFilter={props.SetFilter}
                                Unit={props.Unit}
                            /> : null}
                            {props.Type === 'datetime' ? <DateTimeFilter
                                FieldName={props.Field?.toString() ?? ''}
                                Filter={props.Filter}
                                SetFilter={props.SetFilter}
                            /> : null}
                        </tbody>
                    </table>
                </div>                
                </> : null}
        </div>
    </>;
}
