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
import { Search } from '../SearchBar'

interface IProps<T> { 
    SetFilter: (evt: Search.IFilter<T>[]) => void,
    Filter: Search.IFilter<T>[],
    FieldName: string,
    ApproxMatches?: boolean,
}

export function TextFilter<T>(props: IProps<T>) {
    const [txt, setTxt] = React.useState<string>('');

    React.useEffect(() => {
        if (props.Filter.length === 0) {
            setTxt('');
            return;
        }

        if (props.ApproxMatches || props.ApproxMatches === undefined)
            setTxt(props.Filter[0].SearchText.substring(1, props.Filter[0].SearchText.length -1 ));
        else
            setTxt(props.Filter[0].SearchText);
    }, [props.Filter]);

    React.useEffect(() => {
        let handle: NodeJS.Timeout|null = null;

        if ((txt == null || txt.trim().length === 0) && props.Filter.length !== 0) 
            handle = setTimeout(() =>  props.SetFilter([]), 500);

        if (txt != null && txt.trim().length > 0 && (props.Filter.length === 0 || props.Filter[0].SearchText !== txt.trim()))
            handle = setTimeout(() => props.SetFilter([{
                  FieldName: props.FieldName,
                  isPivotColumn: false, 
                  SearchText: (props.ApproxMatches === undefined || props.ApproxMatches? '%' + txt.trim() + '%' : txt.trim()),
                  Operator: 'LIKE', 
                  Type: 'string'
                }]), 500);

        return () => { if (handle !== null) clearTimeout(handle); };    
    }, [txt])

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