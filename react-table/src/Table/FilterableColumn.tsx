// ******************************************************************************************************
//  FilterableColumn.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  12/05/2024 - G. Santos
//       Generated original version of source code.
// ******************************************************************************************************

import * as ReactTableProps from './Types';
import * as React from 'react';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Search } from '@gpa-gemstone/react-interactive';
import { BooleanFilter } from '../Filters/BooleanFilter';
import { TextFilter } from '../Filters/TextFilter';
import { EnumFilter } from '../Filters/EnumFilter';
import { NumberFilter, IUnit } from '../Filters/NumberFilter';
import { DateFilter, DateTimeFilter, TimeFilter } from '../Filters/DateTimeFilters';

/**
 * Wrapper to make any column configurable
 */
export default function FilterableColumn<T>(props: React.PropsWithChildren<ReactTableProps.IFilterableCollumn<T>>) {
    return <>{props.children}</>
}

export interface IHeaderProps<T> {
    Label: string | React.ReactNode,
    Type?: Search.FieldType,
    Unit?: IUnit[],
    Filter: Search.IFilter<T>[],
    SetFilter: (flt: Search.IFilter<T>[]) => void,
    Field: string | number | symbol | undefined,
    Options?: ReactTableProps.IOptions[],
    ExpandedLabel?: string,
    Guid: string,
}

// Table column header details
export function FilterableColumnHeader<T>(props: IHeaderProps<T>) {
    const [show, setShow] = React.useState<boolean>(false);

    return <>
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <div style={{ marginRight: 25 }} >
            {props.Label}
            </div>
            {props.Type !== undefined ? <>
                <div style={{ width: 25, position: 'absolute', right: 12, top: 12 }}>
                    {props.Filter.length > 0? <ReactIcons.Filter/> : null}
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
                    onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); }}
                >
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
