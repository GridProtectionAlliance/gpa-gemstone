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

/** Defines record binding and asynchronous search behavior for the searchable select. */
export interface IProps<T> extends Omit<Gemstone.TSX.Interfaces.IBaseFormProps<T>, 'Setter'> {
    /**
     * Optional callback that determines whether the selected field value is valid.
     * @param field - Record field to validate.
     * @returns Whether the field is valid.
     */
    Valid?: (field: keyof T) => boolean;
    /**
     * Optional message shown when the selection is invalid.
     */
    Feedback?: string;
    /**
     * Optional flag that accepts the entered search text as a custom value, defaulting to false.
     */
    AllowCustom?: boolean
    /**
     * Searches for options matching the current input text.
     * @param search - Text entered in the search control.
     * @returns Abortable request for matching options.
     */
    Search: (search: string) => Gemstone.TSX.Interfaces.AbortablePromise<Gemstone.TSX.Interfaces.ILabelValue<string | number>[]>;
    /**
     * Optional CSS styles applied to the surrounding form group.
     */
    Style?: React.CSSProperties;
    /**
     * Optional CSS styles applied to the control that displays the selected value.
     */
    BtnStyle?: React.CSSProperties
    /**
     * Optional callback that resolves the search text used initially and after selection or blur.
     * @returns Abortable request for the display label.
     */
    GetLabel?: () => Gemstone.TSX.Interfaces.AbortablePromise<string>
    /**
     * Optional flag that clears search text after selection or blur, defaulting to false.
     */
    ResetSearchOnSelect?: boolean,

    /**
     * Updates the record after an option is selected.
     * @param record - Record containing the selected value.
     * @param selectedOption - Option selected by the user.
     */
    Setter: (record: T, selectedOption: Gemstone.TSX.Interfaces.ILabelValue<string | number>) => void;
}

const getInitialSearchText = (useBlankString: boolean, recordValue: any) => {
    return useBlankString ? '' : recordValue
}

/** Extends a stylable option with the label used by search results. */
interface IStylableOptionOverride extends IStylableOption {
    /** Text displayed for the search result. */
    Label: string
}

/**
 * Renders a record-bound selector that asynchronously searches for matching options.
 * @param props - Record binding and callbacks for searching, labeling, validation, and updates.
 * @returns A searchable dropdown with validation and loading feedback.
 */
export default function SearchableSelect<T>(props: IProps<T>) {
    const [search, setSearch] = React.useState<string>(() =>
        getInitialSearchText(props.ResetSearchOnSelect ?? false, (props.Record[props.Field] as any)?.toString() ?? '')
    );

    const [searchOptions, setSearchOptions] = React.useState<IStylableOptionOverride[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [currentLabel, setCurrentLabel] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

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

        if (currentLabel != null) {
            setSearch(currentLabel);
            return;
        }

        const newSearch: string = (selectedOption?.Label as string) ?? (props.Record[props.Field] as any)?.toString() ?? '';
        setSearch(newSearch);
    }, [props.ResetSearchOnSelect, currentLabel, props.Record[props.Field]]);

    //Effect to set the label for the current value using GetLabel.
    React.useEffect(() => {
        if (props.GetLabel == null) {
            setCurrentLabel(null);
            return;
        }
        const handle = props.GetLabel();
        handle.then(lab => setCurrentLabel(lab), () => setCurrentLabel(null));
        return () => { if (handle?.abort != null) handle.abort(); };
    }, [props.Record[props.Field], props.GetLabel]);

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
                    ref={inputRef}
                    type="text"
                    className={`form-control ${(props.Valid?.(props.Field) ?? true) ? '' : 'border-danger'}`}
                    value={search}
                    onChange={(d) => setSearch(d.target.value)}
                    onBlur={() => handleSetSearch()}
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
            ops.push({ Value: search, Element: <>{search} <span className="badge badge-info" style={{ fontSize: '0.75em' }}>Entered Value</span></>, Label: search });

        //Ensure selectedOption is always at top of the list
        const selected = searchOptions.find(f => f.Value === props.Record[props.Field]);
        if (selected != null)
            ops.push({ ...selected, RowClass: 'table-primary' });
        else if (props.Record[props.Field] != null && props.Record[props.Field] !== '') {
            const fallbackLabel = currentLabel ?? (props.Record[props.Field] as any)?.toString() ?? '';
            ops.push({
                Value: props.Record[props.Field],
                Label: fallbackLabel,
                Element: <>{fallbackLabel}</>,
                RowClass: 'table-primary'
            });
        }

        ops.push(...searchOptions.filter(f => f.Value !== search && f.Value !== props.Record[props.Field]));

        // Only show no-results when there's no search results and we arent loading
        if (searchOptions.length === 0 && !loading)
            ops.push({
                Value: '',
                Label: '',
                Element: <span className="text-muted">No results found</span>,
                RowClass: 'disabled',
                Disabled: true
            });

        return ops;
    }, [search, props.Record[props.Field], props.Field, searchOptions, props.Disabled, loading, props.Valid, handleSetSearch, currentLabel, props.AllowCustom]);

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
        OnDropdownOpen={() => {
            setSearch('');
            inputRef.current?.focus();
        }}
        OnDropdownClose={() => inputRef.current?.blur()}
    />;
}