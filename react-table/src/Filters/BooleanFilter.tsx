// ******************************************************************************************************
//  BooleanFilter.tsx - Gbtc
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
import { Search } from '@gpa-gemstone/react-interactive';

/**
 * Interface defining the properties expected by the BooleanFilter component.
 */
interface IFilterProps<T> {
    /**
    * Function to set the filter based on Search.IFilter<T> array.
    * @param evt - Event handler that updates the filter.
    */
    SetFilter: (evt: Search.IFilter<T>[]) => void;
    /**
    * Array of filters of type Search.IFilter<T>.
    */
    Filter: Search.IFilter<T>[],
    /**
    * Name of the field for filtering.
    */
    FieldName: string
}

/**
 * Component to handle boolean filtering based on provided filter props.
 * @param {IFilterProps<T>} props - Props passed to the BooleanFilter component.
 * @returns JSX element representing the BooleanFilter component.
 */
export function BooleanFilter<T>(props: IFilterProps<T>) {
    const [selected, setSelected] = React.useState<boolean>(false);
    const [notSelected, setNotSelected] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (props.Filter.length === 0) {
            setSelected(true);
            setNotSelected(true);
            return;
        }

        setSelected(props.Filter[0].SearchText === '1')
        setNotSelected(props.Filter[0].SearchText !== '1')

    }, [props.Filter]);

    React.useEffect(() => {
        if (!selected && !notSelected) {
            setSelected(true);
            setNotSelected(true);
        }
    }, [selected, notSelected])

    React.useEffect(() => {
        if (selected && !notSelected && (props.Filter.length === 0 || props.Filter[0].SearchText !== '1')) {
            props.SetFilter([{ FieldName: props.FieldName, IsPivotColumn: false, SearchText: '1', Operator: '=', Type: 'boolean' }]);
        }
        if (!selected && notSelected && (props.Filter.length === 0 || props.Filter[0].SearchText !== '0')) {
            props.SetFilter([{ FieldName: props.FieldName, IsPivotColumn: false, SearchText: '0', Operator: '=', Type: 'boolean' }]);
        }
        if (selected && notSelected && props.Filter.length > 0)
            props.SetFilter([]);
    }, [selected, notSelected])

    return <>
        <tr onClick={(evt) => { evt.preventDefault(); setSelected((s) => !s) }}>
            <td>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => null}
                />
            </td>
            <td>Selected</td>
        </tr>
        <tr
            onClick={(evt) => { evt.preventDefault(); setNotSelected((v)=> !v) }}
        >
            <td>
                <input
                    type="checkbox"
                    checked={notSelected}
                    onChange={() => null}
                />
            </td>
            <td>Not Selected</td>
        </tr>
    </>
}
