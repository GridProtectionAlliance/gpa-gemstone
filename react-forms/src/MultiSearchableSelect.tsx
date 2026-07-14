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
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { IProps as ISearchableSelectProps } from './SearchableSelect';
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

/** Defines record binding and search behavior for the multi-value searchable select. */
interface IProps<T> extends Omit<ISearchableSelectProps<T>, 'Valid' | 'Feedback' | 'GetLabel' | 'Setter' | 'Search'> {
    /**
     * Value assigned when a selectable item is added to the array.
     */
    DefaultValue: number | string,
    /**
     * Optional callback that determines whether an item is valid.
     * @param value - Item value to validate.
     * @param index - Position of the item in the array.
     * @param arr - Complete array of item values.
     * @returns Whether the item is valid.
     */
    ItemValid?: (value: string | number, index: number, arr: Array<string | number>) => boolean;
    /**
     * Optional callback that provides validation feedback for an item.
     * @param value - Item value to evaluate.
     * @param index - Position of the item in the array.
     * @param arr - Complete array of item values.
     * @returns Feedback to display, or undefined when none is needed.
     */
    ItemFeedback?: (value: string | number, index: number, arr: Array<string | number>) => string | undefined;
    /**
     * Optional callback that resolves the display label for an item.
     * @param value - Current item value.
     * @param index - Position of the item in the array.
     * @returns Abortable request for the item's display label.
     */
    GetLabel?: (value: string | number | null, index: number) => Gemstone.TSX.Interfaces.AbortablePromise<string>,
    /**
     * Optional flag that hides controls for adding items, defaulting to false.
     */
    DisableAdd?: boolean;
    /**
     * Optional flag that disables item selectors and controls, defaulting to false.
     */
    Disabled?: boolean; //redeclared for better jsdoc
    /**
     * Updates the record after an item selection changes.
     * @param record - Record containing the updated array.
     * @param index - Position of the updated item.
     * @param selectedOption - Option selected for the item, when available.
     */
    Setter: (record: T, index: number, selectedOption?: Gemstone.TSX.Interfaces.ILabelValue<string | number>) => void;
    /**
     * Searches for selectable options for one array item.
     * @param search - Text entered in the item's search control.
     * @param value - Current value of the item being updated.
     * @param index - Position of the item being updated.
     * @returns Abortable request for matching options.
     */
    Search: (search: string, value: string | number, index: number) => Gemstone.TSX.Interfaces.AbortablePromise<Gemstone.TSX.Interfaces.ILabelValue<string | number>[]>;
}

//Only supporting string/number arrays for now
/**
 * Renders an editable array of searchable selectors with add and remove controls.
 * @param props - Array field binding and callbacks for searching, labeling, validation, and updates.
 * @returns A searchable selector for each value in the array field.
 */
function MultiSearchableSelect<T>(props: IProps<T>) {
    const fieldArray = props.Record[props.Field as keyof T] as Array<string | number>

    if (fieldArray?.constructor !== Array) {
        console.warn(`MultiInput: ${props.Field.toString()} is not of type array.`)
        return <></>
    }

    // Variables to control the rendering of label and help icon.
    const showLabel = props.Label !== "";
    const label = props.Label === undefined ? props.Field as string : props.Label;

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
                                onClick={() => props.Setter({ ...props.Record, [props.Field]: [props.DefaultValue] }, 0, { Label: props.DefaultValue.toString(), Value: props.DefaultValue })}
                            >
                                <ReactIcons.CirclePlus />
                            </button>
                        </label>
                        : null}
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
                                props.Setter({ ...props.Record, [props.Field]: newArray }, index, option);
                            }}
                            Search={(search) => props.Search(search, fieldArray[index], index)}
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
                                props.Setter({ ...props.Record, [props.Field]: newRecords }, index);
                            }}>
                            <ReactIcons.TrashCan Color='red' />
                        </button>
                    </div>
                    {index === [...fieldArray].length - 1 ?
                        <div className={`col-1 ${index === 0 ? 'd-flex align-items-center' : ''}`}>
                            <button
                                className='btn'
                                style={(props.DisableAdd ?? false) || (props.Disabled ?? false) ? { display: 'none' } : undefined}
                                onClick={() => {
                                    const newRecords = [...[...fieldArray], props.DefaultValue];
                                    props.Setter({ ...props.Record, [props.Field]: newRecords }, newRecords.length - 1, { Label: props.DefaultValue.toString(), Value: props.DefaultValue });
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