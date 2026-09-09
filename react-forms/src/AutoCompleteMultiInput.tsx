// ******************************************************************************************************
//  AutoCompleteMultiInput.tsx - Gbtc
//
//  Copyright © 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  02/26/2026 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import AutoCompleteInput from './AutoCompleteInput';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

/** Defines record binding and suggestions for the autocomplete multi-input. */
interface IProps<T> extends Omit<Gemstone.TSX.Interfaces.IBaseFormProps<T>, 'Valid' | 'Feedback'> {
    /**
     * Optional CSS styles applied to each autocomplete input.
     */
    Style?: React.CSSProperties,
    /**
     * Value assigned when an item is added or a disallowed null value is replaced.
     */
    DefaultValue: number | string,
    /**
     * Optional flag that permits null item values, defaulting to true.
     */
    AllowNull?: boolean,
    /**
     * Optional callback that determines whether an item is valid.
     * @param value - Item value to validate.
     * @param index - Position of the item in the array.
     * @param arr - Complete array of item values.
     * @returns Whether the item is valid.
     */
    ItemValid?: (value: string | number, index: number, arr: Array<string | number>) => boolean;
    /**
     * Optional callback that provides feedback for an item.
     * @param value - Item value to evaluate.
     * @param index - Position of the item in the array.
     * @param arr - Complete array of item values.
     * @returns Feedback to display, or undefined when no feedback is needed.
     */
    ItemFeedback?: (value: string | number, index: number, arr: Array<string | number>) => string | undefined;
    /**
     * Optional flag that hides controls for adding items, defaulting to false.
     */
    DisableAdd?: boolean;
    /**
     * Optional flag that disables inputs and item controls, defaulting to false.
     */
    Disabled?: boolean;
    /**
     * Values offered as autocomplete suggestions for each item.
     */
    Options: string[];
}

/**
 * Renders an editable array of autocomplete inputs with add and remove controls.
 * @param props - Array field binding, suggestion values, and item behavior.
 * @returns Autocomplete controls for each value in the array field.
 */
function AutoCompleteMultiInput<T>(props: IProps<T>) {
    const fieldArray = props.Record[props.Field as keyof T] as Array<string | number>

    if (fieldArray?.constructor !== Array) {
        console.warn(`AutoCompleteMultiInput: ${props.Field.toString()} is not of type array.`)
        return <></>
    }

    // Variables to control the rendering of label and help icon.
    const showLabel = props.Label !== "";
    const label = props.Label === undefined ? props.Field as string: props.Label;

    return (
        <>
            {fieldArray.length === 0 ?
                <>
                    {showLabel ?
                        <label className="d-flex align-items-center">
                            <span>{showLabel ? label : ''}</span>
                            <HelpIcon Help={props.Help} />
                            <button
                                className='btn'
                                style={(props.DisableAdd ?? false) || (props.Disabled ?? false) ? { display: 'none' } : undefined}
                                onClick={() => props.Setter({ ...props.Record, [props.Field]: [props.DefaultValue] })}
                            >
                                <ReactIcons.CirclePlus />
                            </button>
                        </label>
                        : null}
                </>
                : null}

            {fieldArray.map((r, index) => (
                <div className='row no-gutters' key={index}>
                    <div className='col-10'>
                        <AutoCompleteInput
                            Record={fieldArray}
                            Field={index}
                            Label={index === 0 ? props.Label : ''}
                            AllowNull={props.AllowNull}
                            Help={index === 0 ? props.Help : undefined}
                            Feedback={props.ItemFeedback?.(r, index, fieldArray) ?? undefined}
                            Valid={() => props.ItemValid?.(r, index, fieldArray) ?? true}
                            Style={props.Style}
                            Disabled={props.Disabled}
                            DefaultValue={typeof props.DefaultValue === 'number' ? props.DefaultValue : undefined}
                            Options={props.Options}
                            Setter={(record) => {
                                const newArray = [...fieldArray];
                                if (!(props.AllowNull ?? true) && record[index] === null)
                                    newArray[index] = props.DefaultValue;
                                else
                                    newArray[index] = record[index];

                                props.Setter({ ...props.Record, [props.Field]: newArray });
                            }}
                        />
                    </div>
                    <div className={`col-${index === [...fieldArray].length - 1 ? 1 : 2} ${index === 0 ? 'd-flex align-items-center justify-content-center' : ''}`}>
                        <button
                            className='btn'
                            style={(props.Disabled ?? false) ? { display: 'none' } : undefined}
                            onClick={() => {
                                const newRecords = [...fieldArray].filter((_, i) => i !== index);
                                props.Setter({ ...props.Record, [props.Field]: newRecords });
                            }}
                        >
                            <ReactIcons.TrashCan Color='red' />
                        </button>
                    </div>
                    {index === [...fieldArray].length - 1 ?
                        <div className={`col-1 ${index === 0 ? 'd-flex align-items-center justify-content-center' : ''}`}>
                            <button
                                className='btn'
                                style={(props.DisableAdd ?? false) || (props.Disabled ?? false) ? { display: 'none' } : undefined}
                                onClick={() => {
                                    const newRecords = [...[...fieldArray], props.DefaultValue];
                                    props.Setter({ ...props.Record, [props.Field]: newRecords });
                                }}
                            >
                                <ReactIcons.CirclePlus />
                            </button>
                        </div>
                        : null}
                </div>
            ))}
        </>
    )
}

export default AutoCompleteMultiInput;