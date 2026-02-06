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

export interface IProps<T> extends Omit<Gemstone.TSX.Interfaces.IBaseFormProps<T>, 'Setter'> {
    /**
    * Function to determine the validity of a field
    * @param field - Field of the record to check
    * @returns {boolean}
    */
    Valid?: (field: keyof T) => boolean;
    /**
      * Feedback message to show when input is invalid
      * @type {string}
      * @optional
    */
    Feedback?: string;
    /**
    * Flag to allow custom input values
    * @type {boolean}
    * @optional
    */
    AllowCustom?: boolean
    /**
    * Function to perform a search and return a promiselike object with a list of IOption and an optional callback
    * @param search - Search string
    * @returns {AbortablePromise<T>}
    */
    Search: (search: string) => Gemstone.TSX.Interfaces.AbortablePromise<Gemstone.TSX.Interfaces.ILabelValue<string | number>[]>;
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
    * Function to get the initial search text or when the element loses focus or when an option is selected
    */
    GetLabel?: () => Gemstone.TSX.Interfaces.AbortablePromise<string>
    /**
     * Flag to reset search text to an empty string when a user selects an option or when the element loses focus. Defaulting to false
     */
    ResetSearchOnSelect?: boolean,

    /**
    * Setter function to update the Record
    * @param record - Updated Record
    */
    Setter: (record: T, selectedOption: Gemstone.TSX.Interfaces.ILabelValue<string | number>) => void;
}

const getInitialSearchText = (useBlankString: boolean, recordValue: any) => {
    return useBlankString ? '' : recordValue
}

interface IStylableOptionOverride extends IStylableOption {
    Label: string
}

export default function SearchableSelect<T>(props: IProps<T>) {
    const [search, setSearch] = React.useState<string>(() =>
        getInitialSearchText(props.ResetSearchOnSelect ?? false, (props.Record[props.Field] as any)?.toString() ?? '')
    );

    const [searchOptions, setSearchOptions] = React.useState<IStylableOptionOverride[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const setter = React.useCallback((record: T, selectedOption: IStylableOption) => {
        const selectedOptionCasted = selectedOption as IStylableOptionOverride; //we can safely cast here because we control the options going in.. 
        handleSetSearch(selectedOptionCasted);
        props.Setter(record, { Label: selectedOptionCasted.Label, Value: selectedOptionCasted.Value });
    }, [props.Setter, props.Field]);

    const handleSetSearch = React.useCallback((selectedOption?: IStylableOptionOverride) => {
        if (props.ResetSearchOnSelect ?? false) {
            setSearch('')
            return
        }

        if (props.GetLabel === undefined) {
            const newSearch: string = (selectedOption?.Label as string) ?? (props.Record[props.Field] as any)?.toString() ?? '';
            setSearch(newSearch);
            return
        }

        setLoading(true);
        const handle = props.GetLabel();
        handle.then(lab => {
            setSearch(lab)
            setLoading(false)
        }, () => setLoading(false));
    }, [props.ResetSearchOnSelect, props.GetLabel, props.Record[props.Field]]);

    //Effect to set search when props.Record[props.Field] changes externally
    React.useEffect(() => {
        handleSetSearch()
    }, [props.Record[props.Field], handleSetSearch]);

    // Call props.Search every 500ms to avoid hammering the server while typing
    React.useEffect(() => {
        setLoading(true);

        let searchHandle: Gemstone.TSX.Interfaces.AbortablePromise<Gemstone.TSX.Interfaces.ILabelValue<string | number>[]>;

        const timeoutHandle = setTimeout(() => {
            searchHandle = props.Search(search);
            searchHandle.then((d: Gemstone.TSX.Interfaces.ILabelValue<string | number>[]) => {
                setSearchOptions(d.map(o => ({ Value: o.Value, Element: o.Label, Label: o.Label })));
                setLoading(false);
            }, () => {
                setLoading(false);
            });
        }, 500);

        return () => {
            if (searchHandle?.abort != null) searchHandle.abort();
            if (timeoutHandle != null) clearTimeout(timeoutHandle);
        };
    }, [search]);

    const options = React.useMemo(() => {
        const ops = [] as IStylableOptionOverride[];

        ops.push({
            Value: props.Record[props.Field],
            Label: "", //Label doesnt matter in this case because you cant select this option
            Element: <div className='input-group'>
                <input
                    type="text"
                    className={`form-control ${(props.Valid?.(props.Field) ?? true) ? '' : 'border-danger'}`}
                    value={search}
                    onChange={(d) => setSearch(d.target.value)}
                    onBlur={() => handleSetSearch()}
                    onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); }}
                    disabled={props.Disabled ?? false}
                />
                {loading ?
                    <div className="input-group-append">
                        <span className="input-group-text">
                            <ReactIcons.SpiningIcon />
                        </span>
                    </div>
                    : null}
            </div>
        })

        if (props.AllowCustom ?? false)
            ops.push({ Value: search, Element: <>{search} (Entered Value)</>, Label: search });

        //Ensure selectedOption is always at top of the list
        const selected = searchOptions.find(f => f.Value === props.Record[props.Field]);
        if (selected != null) ops.push({ ...selected, IsSelected: true });

        ops.push(...searchOptions.filter(f => f.Value !== search && f.Value !== props.Record[props.Field]));

        return ops;
    }, [search, props.Record[props.Field], props.Field, searchOptions, props.Disabled, loading, props.Valid, handleSetSearch]);

    return <StylableSelect<T>
        Record={props.Record}
        Field={props.Field}
        Setter={setter}
        Label={props.Label}
        Disabled={props.Disabled}
        Help={props.Help}
        Style={props.Style}
        Options={options}
        BtnStyle={props.BtnStyle}
        Valid={props.Valid}
        Feedback={props.Feedback}
    />;
}