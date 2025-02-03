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
import StylableSelect, { IOption as IStylableOption } from './StylableSelect';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IOption { Value: string | number; Label: string }

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
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
    Search: (search: string) => [Promise<IOption[]>, () => void];
    /**
    * CSS styles to apply to the form group
    * @type {React.CSSProperties}
    * @optional
    */
    Style?: React.CSSProperties;
    /**
    * CSS style to apply to the button holding the selected value
    * @type {React.CSSProperties}
    * @optional    
    */
    BtnStyle?: React.CSSProperties
    /*
    * Function to get the initial label for the input
    */
    GetLabel?: () => [Promise<string>, () => void]
}

export default function SearchableSelect<T>(props: IProps<T>) {
    const [search, setSearch] = React.useState<string>((props.Record[props.Field] as any).toString());
    const [label, setLabel] = React.useState<string>((props.Record[props.Field] as any).toString());

    const [results, setResults] = React.useState<IStylableOption[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (props.GetLabel === undefined)
            setLabel((props.Record[props.Field] as any).toString())
        else {
            setLoading(true);
            const [handle, callback] = props.GetLabel();
            handle.then(lab => {
                setLabel(lab);
                setSearch(lab)
                setLoading(false)
            });
            return callback
        }
    }, [props.GetLabel])

    React.useEffect(() => {
        setLoading(true);
        const [handle, callback] = props.Search(search);
        handle.then((d: IOption[]) => {
            setResults(d.map(o => ({ Value: o.Value, Element: o.Label, Label: o.Label })));
            setLoading(false);
        });
        return callback;
    }, [search])

    const handleOnBlur = React.useCallback(() => {
        setSearch(label)
    }, [label])

    const options = React.useMemo(() => {
        const ops = [] as IStylableOption[];

        ops.push({
            Value: props.Record[props.Field],
            Element: <div className='input-group'>
                <input
                    type="text"
                    className="form-control"
                    value={search}
                    onChange={(d) => setSearch(d.target.value)}
                    onBlur={handleOnBlur}
                />
                {loading ?
                    <div className="input-group-append">
                        <span className="input-group-text"><ReactIcons.SpiningIcon /></span>
                    </div>
                    : null}
            </div>
        })

        if (!(props.AllowCustom ?? false))
            ops.push({ Value: 'search-' + props.Record[props.Field], Element: label});

        if (props.AllowCustom ?? false)
            ops.push({ Value: search, Element: search });

        ops.push(...results.filter(f => f.Value !== search && f.Value !== props.Record[props.Field]));

        return ops;
    }, [search, props.Record[props.Field], results, props.Disabled, loading, label, props.AllowCustom, handleOnBlur]);

    const update = React.useCallback((record: T, selectedOption: IStylableOption) => {
        const stringVal: string = (record[props.Field] as any).toString();
        let newLabel = stringVal;

        if(!React.isValidElement(selectedOption.Element))
            newLabel = selectedOption.Element as string;
            
        setLabel(newLabel);

        if (stringVal.startsWith('search-')) {
            const value = stringVal.replace('search-', '');
            props.Setter({ ...record, [props.Field]: value });
            setSearch(newLabel ?? value);
            return;
        }

        props.Setter(record);
        setSearch(newLabel);
    }, [props.Setter, props.Field, label])

    return <StylableSelect<T>
        Record={props.Record}
        Field={props.Field}
        Setter={update}
        Label={props.Label}
        Disabled={props.Disabled}
        Help={props.Help}
        Style={props.Style}
        Options={options}
        BtnStyle={props.BtnStyle}
    />;
}

