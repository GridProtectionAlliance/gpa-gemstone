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

interface IProps<T> extends Omit<Gemstone.TSX.Interfaces.IBaseFormProps<T>, 'Valid' | 'Feedback'> {
    /**
    * CSS styles to apply to the Input component
    * @type {React.CSSProperties}
    * @optional
    */
    Style?: React.CSSProperties,
    /**
      * Default value to use when adding an item and when value is null
      * @type {number | string}
    */
    DefaultValue: number | string,
    /**
      * Flag to allow null values
      * @type {boolean}
      * @optional
    */
    AllowNull?: boolean,
    /**
      * Function to determine the validity of a field
      * @param value - The value of the item to check
      * @param index - The index of the item in the array
      * @param arr - The full array of items
      * @returns {boolean}
    */
    ItemValid?: (value: string | number, index: number, arr: Array<string | number>) => boolean;
    /**
      * Feedback message to show when input is invalid
      * @param value - The value of the item to check
      * @param index - The index of the item in the array
      * @param arr - The full array of items
      * @returns {string | undefined}
    */
    ItemFeedback?: (value: string | number, index: number, arr: Array<string | number>) => string | undefined;
    /**
     * Flag to disable add button
     */
    DisableAdd?: boolean;
    /**
     * Flag to disable all input fields
     */
    Disabled?: boolean;
    /**
     * List of autocomplete suggestion options
     * @type {string[]}
     */
    Options: string[];
}

function AutoCompleteMultiInput<T>(props: IProps<T>) {
    const fieldArray = props.Record[props.Field as keyof T] as Array<string | number>

    if (fieldArray?.constructor !== Array) {
        console.warn(`AutoCompleteMultiInput: ${props.Field.toString()} is not of type array.`)
        return <></>
    }

    // Variables to control the rendering of label and help icon.
    const showLabel = props.Label !== "";
    const label = props.Label === undefined ? props.Field : props.Label;

    return (
        <>
            {fieldArray.length === 0 ?
                <>
                    {showLabel ?
                        <label className="d-flex align-items-center">
                            <span>{showLabel ? label : ''}</span>
                            <HelpIcon Help={props.Help} />
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
                                style={(((props.DisableAdd ?? false) || (props.Disabled ?? false)) ?? false) ? { display: 'none' } : undefined}
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