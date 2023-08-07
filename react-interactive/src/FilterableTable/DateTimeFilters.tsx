// ******************************************************************************************************
//  DateTimeFilters.tsx - Gbtc
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
import { DatePicker } from '@gpa-gemstone/react-forms';

interface IProps<T> {
    SetFilter: (evt: Search.IFilter<T>[]) => void;
    Filter: Search.IFilter<T>[],
    FieldName: string
}

const momentDateFormat = "MM/DD/YYYY";
const momentTimeFormat = "HH:mm:ss.SSS"; // Also is the gemstone format

type FilterTypes = 'before' | 'after' | 'between';
interface IValue { Value: string }

export function DateFilter<T>(props: IProps<T>) {
    const [date, setDate] = React.useState<string>('');
    const [secondDate, setSecondDate] = React.useState<string>('')
    const [operator, setOperator] = React.useState<FilterTypes>('after');

    React.useEffect(() => {
        if (props.Filter.length === 0) {
            setDate('');
            setSecondDate('');
        }
        if (props.Filter.length > 1) {
            const f1 = props.Filter.find(f => f.Operator === '>' || f.Operator === '>=')
            if (f1 == null)
                setDate('')
            else
                setDate(f1.SearchText)
            const f2 = props.Filter.find(f => f.Operator === '<' || f.Operator === '<=')
            if (f2 == null)
                setSecondDate('')
            else
                setSecondDate(f2.SearchText)
        }
        if (props.Filter.length === 1) {
            setSecondDate('');
            if (props.Filter[0].Operator === '>' || props.Filter[0].Operator === '>=')
                setOperator('after');
            else
                setOperator('before');
            setDate(props.Filter[0].SearchText);
        }
    }, [props.Filter])


    React.useEffect(() => {
        let handle:any = null;

        if (date === '' && secondDate === '' && props.Filter.length !== 0) 
            handle = setTimeout(() => props.SetFilter([]),500);
        if (date === '' && secondDate === '')
            return () => { if (handle !== null) clearTimeout(handle); };
            
        if (operator === 'between') 
            handle = setTimeout(() =>props.SetFilter([
                {
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: '>=',
                    Type: 'datetime',
                    SearchText: date
                },
                {
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: '<=',
                    Type: 'datetime',
                    SearchText: secondDate
                }
            ]), 500);
        
        else 
            handle = setTimeout(() =>props.SetFilter([{
                FieldName: props.FieldName,
                isPivotColumn: false,
                Operator: (operator === 'after'? '>' : '<'),
                Type: 'datetime',
                SearchText: date
            }]),500);
        
        return () => { if (handle !== null) clearTimeout(handle); };
    }, [operator, date, secondDate])

    return <>
        <tr>
            <td>
                <select className='form-control' value={operator} onChange={(evt) => {
                    const value = evt.target.value as FilterTypes;
                    setOperator(value);
                }}>
                    <option value='before'>Before</option>
                    <option value='after'>After</option>
                    <option value='between'>Between</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>
                <input type={'date'} className='form-control' value={date} onChange={(evt) => {
                    const value = evt.target.value as string;
                    setDate(value);
                }} />
            </td>
        </tr>
        {operator === 'between' ? <>
            <tr>
                <td>
                   and
                </td>
            </tr>
            <tr>
                <td>
                    <input type={'date'} className='form-control' value={secondDate} onChange={(evt) => {
                        const value = evt.target.value as string;
                        setSecondDate(value);
                    }} />
                </td>
            </tr>
        </> : null}
    </>
}

export function TimeFilter<T>(props: IProps<T>) {
    const [time, setTime] = React.useState<string>('');
    const [secondTime, setSecondTime] = React.useState<string>('')
    const [operator, setOperator] = React.useState<FilterTypes>('after');

    React.useEffect(() => {
        if (props.Filter.length === 0) {
            setTime('');
            setSecondTime('');
        }
        if (props.Filter.length > 1) {
            const f1 = props.Filter.find(f => f.Operator === '>' || f.Operator === '>=')
            if (f1 == null)
                setTime('')
            else
                setTime(f1.SearchText)
            const f2 = props.Filter.find(f => f.Operator === '<' || f.Operator === '<=')
            if (f2 == null)
                setSecondTime('')
            else
                setSecondTime(f2.SearchText)
        }
        if (props.Filter.length === 1) {
            setSecondTime('');
            if (props.Filter[0].Operator === '>' || props.Filter[0].Operator === '>=')
                setOperator('after');
            else
                setOperator('before');
            setTime(props.Filter[0].SearchText);
        }
    }, [props.Filter])


    React.useEffect(() => {
        let handle:any = null;

        if (time === '' && secondTime === '' && props.Filter.length !== 0)
            handle = setTimeout(() => props.SetFilter([]),500);
        if (time === '' && secondTime === '')
            return () => { if (handle !== null) clearTimeout(handle); };
        if (operator === 'between') 
            handle = setTimeout(() =>props.SetFilter([
                {
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: '>=',
                    Type: 'datetime',
                    SearchText: time
                },
                {
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: '<=',
                    Type: 'datetime',
                    SearchText: secondTime
                }
            ]),500);
        
        else 
            handle = setTimeout(() => props.SetFilter([{
                FieldName: props.FieldName,
                isPivotColumn: false,
                Operator: (operator === 'after' ? '>' : '<'),
                Type: 'datetime',
                SearchText: time
            }]),500)

        return () => { if (handle !== null) clearTimeout(handle); };
        
    }, [operator, time, secondTime])

    return <>
        <tr onClick={(evt) => { evt.preventDefault(); }}>
            <td>
                <select className='form-control' value={operator} onChange={(evt) => {
                    const value = evt.target.value as FilterTypes;
                    setOperator(value);
                }}>
                    <option value='before'>Before</option>
                    <option value='after'>After</option>
                    <option value='between'>Between</option>
                </select>
            </td>
        </tr>
        <tr onClick={(evt) => { evt.preventDefault(); }}>
            <td>
                <input type={'time'} className='form-control' value={time} onChange={(evt) => {
                    const value = evt.target.value as string;
                    setTime(value);
                }} />
            </td>
        </tr>
        {operator === 'between' ? <>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    and
                </td>
            </tr>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    <input type={'time'} className='form-control' value={secondTime} onChange={(evt) => {
                        const value = evt.target.value as string;
                        setSecondTime(value);
                    }} />
                </td>
            </tr>
        </> : null}
    </>
}

export function DateTimeFilter<T>(props: IProps<T>) {
    const [dateTime, setDateTime] = React.useState<string>('');
    const [secondDateTime, setSecondDateTime] = React.useState<string>('')

    const val: IValue = React.useMemo(() => ({Value: dateTime}), [dateTime])
    const val2: IValue = React.useMemo(() => ({Value: secondDateTime}), [secondDateTime])

    const [operator, setOperator] = React.useState<FilterTypes>('after');

    React.useEffect(() => {
        if (props.Filter.length === 0) {
            setDateTime('');
            setSecondDateTime('');
        }
        if (props.Filter.length > 1) {
            const f1 = props.Filter.find(f => f.Operator === '>' || f.Operator === '>=')
            if (f1 == null)
                setDateTime('')
            else
                setDateTime(f1.SearchText)
            const f2 = props.Filter.find(f => f.Operator === '<' || f.Operator === '<=')
            if (f2 == null)
                setSecondDateTime('')
            else
                setSecondDateTime(f2.SearchText)
        }
        if (props.Filter.length === 1) {
            setSecondDateTime('');
            if (props.Filter[0].Operator === '>' || props.Filter[0].Operator === '>=')
                setOperator('after');
            else
                setOperator('before');
                setDateTime(props.Filter[0].SearchText);
        }
    }, [props.Filter])


    React.useEffect(() => {
        let handle:any = null;

        if (dateTime === '' && secondDateTime === '' && props.Filter.length !== 0)
            handle = setTimeout(() => props.SetFilter([]),500);
        if (dateTime === '' && secondDateTime === '')
            return () => { if (handle !== null) clearTimeout(handle); };
        if (operator === 'between') 
            handle = setTimeout(() =>props.SetFilter([
                {
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: '>=',
                    Type: 'datetime',
                    SearchText: dateTime
                },
                {
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: '<=',
                    Type: 'datetime',
                    SearchText: secondDateTime
                }
            ]),500);
        
        else 
            handle = setTimeout(() => props.SetFilter([{
                FieldName: props.FieldName,
                isPivotColumn: false,
                Operator: (operator === 'after' ? '>' : '<'),
                Type: 'datetime',
                SearchText: dateTime
            }]),500)

        return () => { if (handle !== null) clearTimeout(handle); };
        
    }, [operator, dateTime, secondDateTime])

    return <>
        <tr onClick={(evt) => { evt.preventDefault(); }}>
            <td>
                <select className='form-control' value={operator} onChange={(evt) => {
                    const value = evt.target.value as FilterTypes;
                    setOperator(value);
                }}>
                    <option value='before'>Before</option>
                    <option value='after'>After</option>
                    <option value='between'>Between</option>
                </select>
            </td>
        </tr>
        <tr onClick={(evt) => { evt.preventDefault(); }}>
            <td>
                <DatePicker<IValue> Record={val} Field="Value"
                    Setter={(r) => setDateTime(r.Value)}
                    Label=''
                    Type='datetime-local'
                    Valid={(record) => { return true; }} Format={momentDateFormat + ' ' + momentTimeFormat} 
                />
            </td>
        </tr>
        {operator === 'between' ? <>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    and
                </td>
            </tr>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                <DatePicker<IValue> Record={val2} Field="Value"
                    Setter={(r) => setSecondDateTime(r.Value)}
                    Label=''
                    Type='datetime-local'
                    Valid={(record) => { return true; }} Format={momentDateFormat + ' ' + momentTimeFormat} 
                />
                </td>
            </tr>
        </> : null}
    </>
}