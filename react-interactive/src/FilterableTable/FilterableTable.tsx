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
import { NumberFilter } from './NumberFilter';
import { DateFilter, TimeFilter } from './DateTimeFilters';


interface IOptions { Value: string | number, Label: string }

interface IFilterableCollumn<T> extends Column<T> { 
    Type?: Search.FieldType, 
    Enum?: IOptions[] 
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
                    />
                }))}
                data={props.data}
                onClick={props.onClick}
                sortKey={props.sortKey}
                ascending={props.ascending}
                onSort={props.onSort}
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
    Filter: Search.IFilter<T>[],
    SetFilter: (flt: Search.IFilter<T>[]) => void,
    Field: string | number | symbol | undefined,
    Options?: IOptions[]
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
                    }} onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); }}
                >
                    <table className="table" style={{ margin: 0 }}>
                        <tbody>
                            {props.Type === 'boolean' ? <BooleanFilter
                                SetFilter={props.SetFilter}
                                Filter={props.Filter}
                                FieldName={props.Field?.toString() ?? ''} /> : null}
                            {props.Type === 'string' ? <TextFilter
                                SetFilter={props.SetFilter}
                                Filter={props.Filter}
                                FieldName={props.Field?.toString() ?? ''} /> : null}
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
                            /> : null}

                        </tbody>
                    </table>
                </div>                
                </> : null}
        </div>
    </>;
}
