// ******************************************************************************************************
//  EnumFilter.tsx - Gbtc
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

interface IOptions { Value: string | number, Label: string }

interface IProps<T> { 
    SetFilter: (evt: Search.IFilter<T>[]) => void,
    Filter: Search.IFilter<T>[],
    FieldName: string,
    Options: IOptions[]
    }

interface IOptionsExtended extends IOptions { Selected: boolean }

export function EnumFilter<T>(props: IProps<T>) {
    const [options, setOptions] = React.useState<IOptionsExtended[]>([]);

    React.useEffect(() => {
        if (props.Options.length !== options.length)
            setOptions(props.Options.map(item => ({ ...item, Selected: true })));
        else if (props.Options.some((o,i) => o.Label !== options[i].Label || o.Value !== options[i].Value))
            setOptions(props.Options.map(item => ({ ...item, Selected: true })));
    }, [props.Options])

    React.useEffect(() => {
        if (props.Filter.length !== 0 && (options.filter((x) => x.Selected).length === options.length)) {
            props.SetFilter([]);
            return;
        }
        if (options.some(item => !item.Selected))
            props.SetFilter([{
                FieldName: props.FieldName,
                isPivotColumn: false,
                Operator: 'IN',
                Type: 'enum',
                SearchText: `(${options.filter(o => o.Selected).map(x => x.Value).join(',')})`
            }]);

    }, [options])

    React.useEffect(() => {
        if (props.Filter.length === 0)
            setOptions((opt) => opt.map(item => ({ ...item, Selected: true })))
        else {
            let list = props.Filter[0].SearchText.replace('(', '').replace(')', '').split(',');
            list = list.filter(x => x !== "")
            const hasChanged = options.some(item => {
                const i = list.findIndex(l => l === item.Value);
                if (i < 0 && item.Selected)
                    return true;
                if (i >= 0 && !item.Selected)
                    return true;
                return false;
            })
            if (hasChanged)
                setOptions((opt) => opt.map((item) => ({ ...item, Selected: list.findIndex(l => l == item.Value) >= 0 })));
        }
    }, [props.Filter])

    return <>
        <tr onClick={(evt) => {
            evt.preventDefault();
            const isChecked = options.filter((x) => x.Selected).length === options.length
            setOptions((old) => old.map((o) => ({ ...o, Selected: !isChecked })));
        }}
        >
            <td>
                <input
                    type="checkbox"
                    checked={options.filter((x) => x.Selected).length === options.length}
                    onChange={() => null}
                />
            </td>
            <td>All</td>
        </tr>
        {options.map((f, i) => (
            <tr key={i} onClick={(evt) => { setOptions((old) => old.map((o) => ({ ...o, Selected: (o.Value === f.Value ? !o.Selected : o.Selected) }))); }}>
                <td>
                    <input type="checkbox" checked={f.Selected} onChange={() => null} />
                </td>
                <td>{f.Label}</td>
            </tr>
        ))}
    </>
}
