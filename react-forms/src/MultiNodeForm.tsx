//******************************************************************************************************
//  MultiNodeForm.tsx - Gbtc
//
//  Copyright © 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  04/23/2026 - Preston Crawford
//      Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

/** Defines record binding and nested nodes for the multi-node form. */
interface IProps<T, U> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    /**
     * Item appended when the user adds a new row.
     */
    DefaultValue: U;
    /**
     * Optional flag that hides the add button, defaulting to false.
     */
    DisableAdd?: boolean;
    /**
     * Renders the content for one item in the record field's array.
     * @param item - Item rendered in the current row.
     * @param index - Position of the item in the array.
     * @param arr - Complete array of items.
     * @param setItem - Callback that replaces the current item.
     * @returns Content rendered for the item row.
     */
    Item: (item: U, index: number, arr: U[], setItem: (updated: U) => void) => React.ReactNode;
}

/**
 * Renders a custom form row for each item in an array-valued record field.
 * @param props - Array field binding, default item, and item rendering callback.
 * @returns Custom item rows with add and remove controls.
 */
function MultiNodeForm<T, U>(props: IProps<T, U>) {
    const items = (props.Record[props.Field] as unknown as U[]) ?? [];

    if (items.constructor !== Array) {
        console.warn(`MultiNodeForm: ${props.Field.toString()} is not of type array.`);
        return <></>;
    }

    // Variables to control the rendering of label and help icon on the empty state.
    const showLabel = props.Label !== "";
    const label = props.Label === undefined ? (props.Field as string) : props.Label;

    const setItemAt = (index: number, updated: U) => {
        const newArray = [...items];
        newArray[index] = updated;
        props.Setter({ ...props.Record, [props.Field]: newArray });
    };

    const removeItemAt = (index: number) => {
        const newArray = items.filter((_, i) => i !== index);
        props.Setter({ ...props.Record, [props.Field]: newArray });
    };

    const appendItem = () => {
        props.Setter({ ...props.Record, [props.Field]: [...items, props.DefaultValue] });
    };

    return (
        <>
            {showLabel ?
                <label className="d-flex align-items-center">
                    <span>{label}</span>
                    <HelpIcon Help={props.Help} />
                    {items.length === 0 ?
                        <button
                            className='btn'
                            style={(props.DisableAdd ?? false) || (props.Disabled ?? false) ? { display: 'none' } : undefined}
                            onClick={() => props.Setter({ ...props.Record, [props.Field]: [props.DefaultValue] })}
                        >
                            <ReactIcons.CirclePlus />
                        </button>
                        : null}
                </label>
                : null}

            {items.map((item, index) => (
                <div className='row no-gutters' key={index}>
                    <div className='col-10'>
                        {props.Item(item, index, items, (updated) => setItemAt(index, updated))}
                    </div>
                    <div className={`col-${index === items.length - 1 ? 1 : 2} ${index === 0 ? 'd-flex align-items-center justify-content-center' : ''}`}>
                        <button
                            className='btn'
                            style={(props.Disabled ?? false) ? { display: 'none' } : undefined}
                            onClick={() => removeItemAt(index)}
                        >
                            <ReactIcons.TrashCan Color='red' />
                        </button>
                    </div>
                    {index === items.length - 1 ?
                        <div className={`col-1 ${index === 0 ? 'd-flex align-items-center justify-content-center' : ''}`}>
                            <button
                                className='btn'
                                style={(props.DisableAdd ?? false) || (props.Disabled ?? false) ? { display: 'none' } : undefined}
                                onClick={appendItem}
                            >
                                <ReactIcons.CirclePlus />
                            </button>
                        </div>
                        : null}
                </div>
            ))}
        </>
    );
}

export default MultiNodeForm;