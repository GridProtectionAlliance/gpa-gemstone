//******************************************************************************************************
//  MultiInput.tsx - Gbtc
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
//  12/05/2024 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import Input from './Input';
import ToolTip from './ToolTip';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> { //annotate these comments..
    /**
      * Function to determine the validity of a field
      * @param field - Field of the record to check
      * @returns {boolean}
    */
    Valid: (field: keyof T) => boolean;
    /**
      * Type of the input field
      * @type {'number' | 'text' | 'password' | 'email' | 'color' | 'integer'}
      * @optional
    */
    Type?: 'number' | 'text' | 'password' | 'email' | 'color' | 'integer';
    /**
    * CSS styles to apply to the Input component
    * @type {React.CSSProperties}
    * @optional
    */
    Style?: React.CSSProperties,
    /**
      * Default value to use when adding an item and when value is null
      * @type {number}
    */
    DefaultValue: number | string,
    /**
        * Flag to allow null values
        * @type {boolean}
        * @optional
    */
    AllowNull?: boolean,
    /**
      * Feedback message to show when input is invalid
      * @type {string}
      * @optional
    */
    Feedback?: string,
}

//Only supporting string/number arrays for now
function MultiInput<T>(props: IProps<T>) {
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
                        <button className='btn' onClick={() => props.Setter({ ...props.Record, [props.Field]: [props.DefaultValue] })}> <ReactIcons.CirclePlus /> </button>
                    </label>
                    <ToolTip Show={showHelp && props.Help != null} Target={guid} Class="info" Position="bottom">
                        {props.Help}
                    </ToolTip>
                </>
                : null}

            {fieldArray.map((r, index) => (
                <div className='row align-items-center' key={index}>
                    <div className='col'>
                        <Input Record={fieldArray} Field={index} Label={index === 0 ? props.Label : ''} AllowNull={props.AllowNull} Type={props.Type} Help={index === 0 ? props.Help : undefined} Feedback={props.Feedback}
                            Valid={() => props.Valid(props.Field)} Style={props.Style} Disabled={props.Disabled} Setter={(record) => {
                                const newArray = [...fieldArray];
                                if (!(props.AllowNull ?? true) && record[index] === null)
                                    newArray[index] = props.DefaultValue;
                                else
                                    newArray[index] = record[index];

                                props.Setter({ ...props.Record, [props.Field]: newArray });
                            }} />
                    </div>
                    <div className='col-auto'>
                        <button className='btn' style={(props.Disabled ?? false) ? { display: 'none' } : undefined} onClick={() => {
                            const newRecords = [...fieldArray].filter((_, i) => i !== index);
                            props.Setter({ ...props.Record, [props.Field]: newRecords });
                        }}>
                            <ReactIcons.TrashCan Color='red' />
                        </button>
                    </div>
                    {index === [...fieldArray].length - 1 ?
                        <div className='col-auto'>
                            <button className='btn' style={(props.Disabled ?? false) ? { display: 'none' } : undefined} onClick={() => {
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

export default MultiInput;