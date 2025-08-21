//******************************************************************************************************
//  MultiSearchableSelect.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  07/01/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import SearchableSelect from './SearchableSelect';
import ToolTip from './ToolTip';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { IProps as ISearchableSelectProps } from './SearchableSelect';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Omit<ISearchableSelectProps<T>, 'Valid' | 'Feedback' | 'GetLabel' | 'Setter'> {
    /**
      * Default value to use when adding an item and when value is null
      * @type {number}
    */
    DefaultValue: number | string,
    /**
     * Function to determine the validity of a field
     * @param field - Field of the record to check
     * @returns {boolean}
    */
    ItemValid?: (value: string | number, index: number, arr: Array<string | number>) => boolean;
    /**
      * Feedback message to show when input is invalid
      * @type {string}
      * @optional
    */
    ItemFeedback?: (value: string | number, index: number, arr: Array<string | number>) => string | undefined;
    /**
     * 
    */
    GetLabel?: (value: string | number | null, index: number) => Gemstone.TSX.Interfaces.AbortablePromise<string>,
    /**
     * Flag to disable add button
     */
    DisableAdd?: boolean;
    /**
     * Flag to disable all input fields
     */
    Disabled?: boolean; //redeclared for better jsdoc
    /**
    * Setter function to update the Record
    * @param record - Updated Record
    */
    Setter: (record: T, selectedOption?: Gemstone.TSX.Interfaces.ILabelValue<string | number>) => void;
}

//Only supporting string/number arrays for now
function MultiSearchableSelect<T>(props: IProps<T>) {
    const [guid] = React.useState<string>(CreateGuid());
    const [showHelp, setShowHelp] = React.useState<boolean>(false);

    const fieldArray = props.Record[props.Field as keyof T] as Array<string | number>

    if (fieldArray?.constructor !== Array) {
        console.warn(`MultiInput: ${props.Field.toString()} is not of type array.`)
        return <></>
    }

    return (
        <>
            {fieldArray.length === 0 ?
                <>
                    <label className='d-flex align-items-center'>
                        <span>
                            {props.Label ?? props.Field}
                        </span>

                        {props.Help != null ?
                            <span className="ml-2 d-flex align-items-center"
                                onMouseEnter={() => setShowHelp(true)}
                                onMouseLeave={() => setShowHelp(false)}
                                data-tooltip={guid}
                            >
                                <ReactIcons.QuestionMark Color="var(--info)" Size={20} />
                            </span>
                            : null}
                        <button className='btn'
                            onClick={() => props.Setter({ ...props.Record, [props.Field]: [props.DefaultValue] }, { Label: props.DefaultValue.toString(), Value: props.DefaultValue })}>
                            <ReactIcons.CirclePlus />
                        </button>
                    </label>
                    <ToolTip Show={showHelp && props.Help != null} Target={guid} Class="info" Position="top">
                        {props.Help}
                    </ToolTip>
                </>
                : null}

            {fieldArray.map((r, index) => (
                <div className='row align-items-center' key={index}>
                    <div className='col-10'>
                        <SearchableSelect<(string | number)[]>
                            Record={fieldArray}
                            Field={index}
                            Label={index === 0 ? props.Label : ''}
                            Help={index === 0 ? props.Help : undefined}
                            Feedback={props.ItemFeedback?.(r, index, fieldArray) ?? undefined}
                            Valid={() => props.ItemValid?.(r, index, fieldArray) ?? true}
                            Style={props.Style}
                            Disabled={props.Disabled}
                            Setter={(record, option) => {
                                const newArray = [...fieldArray];
                                newArray[index] = record[index];
                                props.Setter({ ...props.Record, [props.Field]: newArray }, option);
                            }}
                            Search={props.Search}
                            BtnStyle={props.BtnStyle}
                            GetLabel={props.GetLabel != null ? () => props.GetLabel!(fieldArray[index], index) : undefined}
                            ResetSearchOnSelect={props.ResetSearchOnSelect}
                            AllowCustom={props.AllowCustom}
                        />
                    </div>
                    <div className={`col-${index === [...fieldArray].length - 1 ? 1 : 2} ${index === 0 ? 'd-flex align-items-center' : ''}`}>
                        <button className='btn' style={(props.Disabled ?? false) ? { display: 'none' } : undefined}
                            onClick={() => {
                                const newRecords = [...fieldArray].filter((_, i) => i !== index);
                                props.Setter({ ...props.Record, [props.Field]: newRecords });
                            }}>
                            <ReactIcons.TrashCan Color='red' />
                        </button>
                    </div>
                    {index === [...fieldArray].length - 1 ?
                        <div className={`col-1 ${index === 0 ? 'd-flex align-items-center' : ''}`}>
                            <button
                                className='btn'
                                style={(((props.DisableAdd ?? false) || (props.Disabled ?? false)) ?? false) ? { display: 'none' } : undefined}
                                onClick={() => {
                                    const newRecords = [...[...fieldArray], props.DefaultValue];
                                    props.Setter({ ...props.Record, [props.Field]: newRecords });
                                }}>
                                <ReactIcons.CirclePlus />
                            </button>
                        </div>
                        : null}
                </div>
            ))}
        </>
    )
}

export default MultiSearchableSelect;