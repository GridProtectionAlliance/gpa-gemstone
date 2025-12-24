// ******************************************************************************************************
//  FilterCreator.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  12/23/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { EnumSetter, IOptions, Search } from './SearchBar';
import { DatePicker } from '@gpa-gemstone/react-forms';


interface IProps<T> {
    Filter: Search.IFilter<T>,
    Setter: (filter: React.SetStateAction<Search.IFilter<T>>) => void,
    Field: Search.IField<T> | undefined,
    Enum?: EnumSetter<T>
}

const FilterCreator = <T,>(props: IProps<T>) => {
    const [options, setOptions] = React.useState<IOptions[]>([]);

    React.useEffect(() => {
        if (props.Field === undefined)
            return;
        if (props.Field.enum !== undefined)
            setOptions(props.Field.enum);
        if (props.Enum !== undefined)
            return props.Enum(setOptions, props.Field);
        if (props.Field.enum === undefined)
            setOptions([]);
    }, [props.Field, props.Enum]);

    if (props.Field === undefined)
        return null;

    if (props.Field.type === "string") {
        return (
            <>
                <label>Column type is string. Wildcard (*) can be used with 'LIKE' and 'NOT LIKE'</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            const value = evt.target.value as 'LIKE' | 'NOT LIKE' | '=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            <option value='LIKE'>LIKE</option>
                            <option value='='>=</option>
                            <option value='NOT LIKE'>NOT LIKE</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input className='form-control' value={props.Filter.SearchText.replace('$_', '_')} onChange={(evt) => {
                            const value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: value.replace('_', '$_') }));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type === "integer" || props.Field.type === "number") {
        return (
            <>
                <label>Column type is {props.Field.type}.</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            const value = evt.target.value as '=' | '<>' | '>' | '<' | '>=' | '<=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            <option value='='>=</option>
                            <option value='<>'>{`<>`}</option>
                            <option value='>'>{`>`}</option>
                            <option value='>='>{`>=`}</option>
                            <option value='<'>{`<`}</option>
                            <option value='<='>{`<=`}</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input type={'number'} className='form-control' value={props.Filter.SearchText} onChange={(evt) => {
                            const value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: value }));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type === "datetime") {
        return (
            <>
                <label>Column type is {props.Field.type}.</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            const value = evt.target.value as '=' | '<>' | '>' | '<' | '>=' | '<=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            {/*<option value='='>=</option>*/}
                            {/*<option value='<>'>{`<>`}</option>*/}
                            <option value='>'>{`>`}</option>
                            <option value='>='>{`>=`}</option>
                            <option value='<'>{`<`}</option>
                            <option value='<='>{`<=`}</option>
                        </select>
                    </div>
                    <div className='col'>
                        <DatePicker<Search.IFilter<T>> Record={props.Filter} Field="SearchText"
                            Setter={(r) => {
                                const value = r.SearchText;
                                props.Setter((prevState) => ({ ...prevState, SearchText: value }));
                            }}
                            Label=''
                            Type='datetime-local'
                            Valid={() => true}
                            Format={'MM/DD/YYYY HH:mm:ss.SSS'}
                        />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type === "boolean") {
        return <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                style={{ zIndex: 1 }}
                onChange={(evt) => {
                    props.Setter((prevFilter) => ({ ...prevFilter, Operator: '=', SearchText: evt.target.checked ? "1" : "0" }));
                }}
                value={props.Filter.SearchText === "1" ? 'on' : 'off'}
                checked={props.Filter.SearchText === "1" ? true : false}
            />
            <label className="form-check-label">Column type is boolean. Yes/On is checked.</label>
        </div>
    }
    else {

        return (
            <>
                <label>Column type is enumerable. Select from below.</label>
                <ul style={{ listStyle: 'none' }}>
                    <li >
                        <div className="form-check">
                            <input type="checkbox"
                                className="form-check-input"
                                style={{ zIndex: 1 }}
                                onChange={(evt) => {
                                    if (evt.target.checked)
                                        props.Setter(prevSetter => ({ ...prevSetter, SearchText: `(${options.map(x => x.Value).join(',')})` }));
                                    else
                                        props.Setter(prevSetter => ({ ...prevSetter, SearchText: '' }));
                                }} defaultValue='off'
                            />
                            <label className="form-check-label">
                                Select All
                            </label>
                        </div>
                    </li>
                    {options.map((vli, index) =>
                        <li key={index}>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    style={{ zIndex: 1 }}
                                    onChange={(evt) => {
                                        if (evt.target.checked) {

                                            let list = stripParenthesisAndSplit(props.Filter.SearchText)
                                            list = list.filter(x => x !== "")
                                            list.push(vli.Value)
                                            const text = `(${list.join(',')})`;
                                            props.Setter(prevSetter => ({ ...prevSetter, SearchText: text }));
                                        }
                                        else {
                                            let list = stripParenthesisAndSplit(props.Filter.SearchText);
                                            list = list.filter(x => x !== "")
                                            list = list.filter(x => x !== vli.Value)
                                            const text = `(${list.join(',')})`;
                                            props.Setter(prevSetter => ({ ...prevSetter, SearchText: text }));
                                        }

                                    }}
                                    value={props.Filter.SearchText.indexOf(vli.Value) >= 0 ? 'on' : 'off'}
                                    checked={stripParenthesisAndSplit(props.Filter.SearchText).indexOf(vli.Value) >= 0}
                                />
                                <label className="form-check-label" >
                                    {vli.Label}
                                </label>
                            </div>
                        </li>
                    )}
                </ul>
            </>
        );
    }
}

const stripParenthesisAndSplit = (str: string) => {
    return (str.match(/^\(.*\)$/) != null ? str.slice(1, -1) : str).split(',');
};

export default FilterCreator;