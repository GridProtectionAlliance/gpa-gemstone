// ******************************************************************************************************
//  TextFilter.tsx - Gbtc
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

interface IProps<T> { 
    SetFilter: (evt: Search.IFilter<T>[]) => void,
    Filter: Search.IFilter<T>[],
    FieldName: string,
    ApproxMatches?: boolean,
}

/**
 * Component for rendering a text input filter.
 * @param props - Props for configuring and managing the text filter.
 * @returns JSX for rendering a text input filter with wildcard options.
 */
export function TextFilter<T>(props: IProps<T>) {
    const [txt, setTxt] = React.useState<string>('');

    // Handles changes in the Filter prop.
    React.useEffect(() => {
        // Resets text input if there is no filter.
        if (props.Filter.length === 0) {
            setTxt('');
            return;
        }

        if ((props.ApproxMatches ?? true))
            setTxt(props.Filter[0].SearchText.substring(1, props.Filter[0].SearchText.length -1 ));
        else
            setTxt(props.Filter[0].SearchText);
    }, [props.Filter]);

    // Handles text input chanages.
    React.useEffect(() => {
        let handle: NodeJS.Timeout|null = null;

        // Clears filter if txt is empty AND filter is not empty.
        if ((txt == null || txt.trim().length === 0) && props.Filter.length !== 0) 
            handle = setTimeout(() =>  props.SetFilter([]), 500);

        // Applies filter based on specifications.
        if (txt != null && txt.trim().length > 0 && (props.Filter.length === 0 || props.Filter[0].SearchText !== txt.trim()))
            handle = setTimeout(() => props.SetFilter([{
                  FieldName: props.FieldName,
                  IsPivotColumn: false, 
                  SearchText: (props.ApproxMatches === undefined || props.ApproxMatches? '%' + txt.trim() + '%' : txt.trim()),
                  Operator: 'LIKE', 
                  Type: 'string'
                }]), 500);

        // Cleans function to clear timeout.
        return () => { if (handle !== null) clearTimeout(handle); };    
    }, [txt])

    // renders text input filter and addl information
    return <>
        <tr onClick={(evt) => { evt.preventDefault();}}>
            <td>
                <input className='form-control' value={txt.replace('$_', '_')} placeholder={"Search"} onChange={(evt) => {
                    const value = evt.target.value as string;
                    setTxt(value.replace('_', '$_'));
                }} />
            </td>
        </tr>
        <tr>
            <td> <label>Wildcard (*) can be used</label> </td>
        </tr>
        
    </>
}