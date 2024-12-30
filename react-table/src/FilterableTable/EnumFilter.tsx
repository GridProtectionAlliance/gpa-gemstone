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
import { Search } from '@gpa-gemstone/react-interactive';

/**
* Represents an option with a value and label.
*/
interface IOptions { Value: string | number, Label: string }

/**
* Represents the properties expected by the EnumFilter component.
*/
interface IProps<T> { 
    /**
    * Function to set the filter based on Search.IFilter<T> array.
    * @param evt - Event handler that updates the filter.
    */
    SetFilter: (evt: Search.IFilter<T>[]) => void,
    /**
    * Array of filters of type Search.IFilter<T>.
    */
    Filter: Search.IFilter<T>[],
    /**
     * Name of filtering field.
     */
    FieldName: string,
    /**
     * The array of IOptions[] for filtering.
     */
    Options: IOptions[]
    }

    /**
     * Extended interface from IOptions to include Selected boolean property.
     */
interface IOptionsExtended extends IOptions { Selected: boolean }

/**
 * Component to handle enum filtering based on provided filter props.
 * @param {IProps<T>} props - Props passed to EnumFilter.
 * @returns JSX element representing EnumFilter component.
 */
export function EnumFilter<T>(props: IProps<T>) {
    // State for options with selection.
    const [options, setOptions] = React.useState<IOptionsExtended[]>([]);

    // Update options based on props.Options changes.
    React.useEffect(() => {
        if (props.Options.length !== options.length)
            setOptions(props.Options.map(item => ({ ...item, Selected: true })));
        else if (props.Options.some((o,i) => o.Label !== options[i].Label || o.Value !== options[i].Value))
            setOptions(props.Options.map(item => ({ ...item, Selected: true })));
    }, [props.Options])

    // Updates filter based on selected option changes.
    React.useEffect(() => {
        if (props.Filter.length !== 0 && (options.filter((x) => x.Selected).length === options.length)) {
            props.SetFilter([]);
            return;
        }
        if (options.some(item => !item.Selected))
            props.SetFilter([{
                FieldName: props.FieldName,
                IsPivotColumn: false,
                Operator: 'IN',
                Type: 'enum',
                SearchText: `(${options.filter(o => o.Selected).map(x => x.Value).join(',')})`
            }]);

    }, [options])

    // Updates options based on filter changes.
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

    // Renders option checkboxes.
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
            <tr key={i} onClick={() => { setOptions((old) => old.map((o) => ({ ...o, Selected: (o.Value === f.Value ? !o.Selected : o.Selected) }))); }}>
                <td>
                    <input type="checkbox" checked={f.Selected} onChange={() => null} />
                </td>
                <td>{f.Label}</td>
            </tr>
        ))}
    </>
}
