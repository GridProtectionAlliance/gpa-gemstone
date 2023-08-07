// ******************************************************************************************************
//  NumberFilter.tsx - Gbtc
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
//  03/02/2022 - C Lackner
//       Generated original version of source code.
// ******************************************************************************************************
import * as React from 'react';
import { Search } from '../SearchBar'

interface IProps<T> { 
    SetFilter: (evt: Search.IFilter<T>[]) => void,
    Filter: Search.IFilter<T>[],
    FieldName: string,
    Unit?: IUnit[]
}

export interface IUnit { 
    label: string,
    GetValue: (value: number) => number, 
    GetFilter: (filter: number) => number
}

type FilterType = 'less than' | 'greater than' | 'between' | 'equal to'

export function NumberFilter<T>(props: IProps<T>) {
        const [value, setValue] = React.useState<string>('');
        const [secondValue, setSecondValue] = React.useState<string>('')
        const [operator, setOperator] = React.useState<FilterType>('less than');
        const [unitIndex, setUnitIndex] = React.useState<number>(0);

        React.useEffect(() => {
            if (props.Filter.length === 0) {
                setValue('');
                setSecondValue('');
            }
            if (props.Filter.length > 1) {
                const f1 = props.Filter.find(f => f.Operator === '>' || f.Operator === '>=')
                if (f1 == null)
                    setValue('')
                else
                    setValue(f1.SearchText)
                const f2 = props.Filter.find(f => f.Operator === '<' || f.Operator === '<=')
                if (f2 == null)
                    setSecondValue('')
                else
                    setSecondValue(f2.SearchText)
            }
            if (props.Filter.length === 1) {
                setSecondValue('');
                if (props.Filter[0].Operator === '>' || props.Filter[0].Operator === '>=')
                    setOperator('greater than');
                else if (props.Filter[0].Operator === '=')
                    setOperator('equal to');
                else
                    setOperator('less than');
                setValue(props.Filter[0].SearchText);
            }
        }, [props.Filter])
    
    
        React.useEffect(() => {
            let handle:any = null;
            if (value === '' && secondValue === '' && props.Filter.length !== 0)
                handle = setTimeout(() => props.SetFilter([]), 500);
            if (value === '' && secondValue === '')
                return () => { if (handle !== null) clearTimeout(handle); };  
            if (operator === 'between') 
                handle = setTimeout(() => props.SetFilter([
                    {
                        FieldName: props.FieldName,
                        isPivotColumn: false,
                        Operator: '>=',
                        Type: 'number',
                        SearchText: value
                    },
                    {
                        FieldName: props.FieldName,
                        isPivotColumn: false,
                        Operator: '<=',
                        Type: 'number',
                        SearchText: secondValue
                    }
                ]), 500);
            
            else 
                handle = setTimeout(() => props.SetFilter([{
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: transformSymbol(operator),
                    Type: 'number',
                    SearchText: value
                }]),500);
            
            return () => { if (handle !== null) clearTimeout(handle); };  
        }, [operator, value, secondValue])
    
        function transformSymbol(s: FilterType) {
            if (s === 'less than')
                return '<';
            if (s === 'greater than')
                return '>';
            return '='
        }

        const hasUnit = props.Unit !== undefined && unitIndex >= 0 && unitIndex < props.Unit.length;
        return <>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    <select className='form-control' value={operator} onChange={(evt) => {
                        const v = evt.target.value as FilterType;
                        setOperator(v);
                    }}>
                        <option value='less than'>Less than ({'<'})</option>
                        <option value='equal to'>Equal to (=)</option>
                        <option value='greater than'>Greater than ({'>'})</option>
                        <option value='between'>In range</option>
                    </select>
                </td>
            </tr>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    <input type={'number'} className='form-control' 
                    value={props.Unit !== undefined && hasUnit? props.Unit[unitIndex].GetValue(parseFloat(value)).toString() ?? '' : value}
                    onChange={(evt) => {
                        let v = evt.target.value as string;
                        if (props.Unit !== undefined && unitIndex >= 0 && unitIndex < props.Unit.length)
                        {
                            v = props.Unit[unitIndex].GetFilter(parseFloat(v)).toString();
                        }
                        setValue(v);
                    }} />
                </td>
                {props.Unit !== undefined?
                <td>
                    <select className='form-control' value={props.Unit[unitIndex]?.label ?? ''} onChange={(evt) => {
                            const v = evt.target.value;
                            setUnitIndex(props.Unit?.findIndex(u => u.label === v) ?? -1)
                        }}>
                        {props.Unit.map((u) => <option value={u.label} key={u.label}>{u.label}</option>)}
                    </select>
                </td> : null
                }
            </tr>
            {operator === 'between' ? <>
                <tr onClick={(evt) => { evt.preventDefault(); }}>
                    <td>
                        and
                    </td>
                </tr>
                <tr onClick={(evt) => { evt.preventDefault(); }}>
                    <td>
                        <input type={'number'} className='form-control' 
                        value={props.Unit !== undefined && hasUnit? props.Unit[unitIndex].GetValue(parseFloat(secondValue)).toString() : secondValue}
                         onChange={(evt) => {
                            let v = evt.target.value as string;
                            if (props.Unit !== undefined && unitIndex >= 0 && unitIndex < props.Unit.length)
                            {
                                v = props.Unit[unitIndex].GetFilter(parseFloat(v)).toString();
                            }
                            setSecondValue(v);
                        }} />
                    </td>
                </tr>
                {props.Unit !== undefined?
                <td>
                    <select className='form-control' value={props.Unit[unitIndex]?.label ?? ''} onChange={(evt) => {
                            const v = evt.target.value;
                            setUnitIndex(props.Unit?.findIndex(u => u.label === v) ?? -1)
                        }}>
                        {props.Unit.map((u) => <option value={u.label} key={u.label}>{u.label}</option>)}
                    </select>
                </td> : null
                }
            </> : null}
        </>
    }