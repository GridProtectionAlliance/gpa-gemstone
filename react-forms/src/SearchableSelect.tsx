// ******************************************************************************************************
//  SearchableSelect.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  03/17/2024 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import HelperMessage from './HelperMessage';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import StylableSelect, { IOption as IStylableOption } from './StylableSelect';
import styled, { keyframes } from 'styled-components';
interface IOption { Value: string; Label: string }

interface IProps<T> {
    /**
      * Record to be used in form
      * @type {T}
    */
    Record: T;
    /**
      * Field of the record to be edited
      * @type {keyof T}
    */
    Field: keyof T;
    /**
    * Setter function to update the Record
    * @param record - Updated Record
    */
    Setter: (record: T) => void;
    /**
    * Flag to allow custom input values
    * @type {boolean}
    * @optional
    */
    AllowCustom?: boolean
    /**
    * Function to perform a search and return a promise with a list of IOption and an optional callback
    * @param search - Search string
    * @returns {[promise: Promise<IOption[]>, callback?: () => void]}
    */
    Search: (search: string) => [promise: Promise<IOption[]>, callback?: () => void];
    /**
    * Label to display for the form, defaults to the Field prop
    * @type {string}
    * @optional
   */
    Label?: string;
    /**
    * Flag to disable the input field
    * @type {boolean}
    * @optional
    */
    Disabled?: boolean;
    /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
    */
    Help?: string | JSX.Element;
    /**
    * CSS styles to apply to the form group
    * @type {React.CSSProperties}
    * @optional
    */
    Style?: React.CSSProperties;
}

export default function SearchableSelect<T>(props: IProps<T>) {
    const [search, setSearch] = React.useState<string>((props.Record[props.Field] as any).toString());
    const [results, setResults] = React.useState<IStylableOption[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        setLoading(true);
        const [h, c] = props.Search(search);
        h.then((d: IOption[]) => { setResults(d.map(o => ({ Value: o.Value, Element: <p>{o.Label}</p> }))); setLoading(false); });
        return c;
    }, [search])

    const options = React.useMemo(() => {
        const r = [] as IStylableOption[];
        if (props.AllowCustom ?? false)
            r.push({ Value: search, Element: <p>{search}</p> });
        r.push({
            Value: props.Record[props.Field], Element: <div className='input-group'>
                <input
                    type="text"
                    className="form-control"
                    value={search}
                    onChange={(d) => setSearch(d.target.value)}
                    onBlur={((props.AllowCustom ?? false) ? () => props.Setter({ ...props.Record, [props.Field]: search }) : () => setSearch((props.Record[props.Field] as any).toString()))}
                />
                <div className="input-group-append">
                    <span className="input-group-text"><Icon /></span>
                </div>s
            </div>
        })
        r.push(...results.filter(f => f.Value !== search && f.Value !== props.Record[props.Field]));
        if (!(props.AllowCustom ?? false))
            r.push({ Value: 'search-' + props.Record[props.Field], Element: <p>{props.Record[props.Field]}</p> });
        return r;
    }, [search, props.Record[props.Field], results, props.Disabled, loading]);

    const update = React.useCallback((record: T) => {
        if ((record[props.Field] as any).toString().startsWith('search-') as boolean)
            return;
        props.Setter(record); setSearch((record[props.Field] as any).toString())
    }, [props.Setter, props.Field])

    return <StylableSelect<T>
        Record={props.Record}
        Field={props.Field}
        Setter={update}
        Label={props.Label}
        Disabled={props.Disabled}
        Help={props.Help}
        Style={props.Style}
        Options={options}
    />;
}


const spin = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;


const Icon = styled.div`
	animation: ${spin} 1s linear infinite;
	border: 5px solid #f3f3f3;
	border-Top: 5px solid #555;
	border-Radius: 50%;
	width: 25px;
	height: 25px
`;

