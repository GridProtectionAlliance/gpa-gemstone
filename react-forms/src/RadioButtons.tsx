// ******************************************************************************************************
//  RadioButtons.tsx - Gbtc
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
//  06/10/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

/** Describes a radio option and whether users may select it. */
interface IOption extends Gemstone.TSX.Interfaces.ILabelValue<string | number> {
  /** Optional flag that prevents the option from being selected. */
  Disabled?: boolean
}

/** Defines record binding and choices for the radio button group. */
interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    /**
     * Optional layout direction for the radio choices, defaulting to horizontal.
     */
    Position?: ('vertical' | 'horizontal'),
    /**
     * Choices rendered as radio buttons.
     */
    Options: IOption[];
    /**
     * Optional CSS styles applied to the surrounding form group.
     */
    Style?: React.CSSProperties;
}

/**
 * Renders mutually exclusive options as record-bound radio buttons.
 * @param props - Record binding, option choices, layout, and optional styling.
 * @returns A labeled horizontal or vertical group of radio buttons.
 */
export default function RadioButtons<T>(props: IProps<T>) {
    const label = props.Label === undefined ? props.Field as string : props.Label;

    return (
        <div className="form-group" style={props.Style}>
            <label className="form-check-label w-100 d-flex align-items-center">
                <span>
                    {label}
                </span>
                <HelpIcon Help={props.Help} />
            </label>
            {props.Options.map((option, index) => (
                <div key={index} className={`form-check ${props.Position == 'vertical' ? '' : 'form-check-inline'}`}>
                    <input
                        type="radio"
                        className="form-check-input"
                        style={{ zIndex: 1 }}
                        onChange={() => {
                            const record: T = { ...props.Record };
                            record[props.Field] = option.Value as unknown as T[keyof T];
                            props.Setter(record);
                        }}
                        value={option.Value}
                        checked={props.Record[props.Field] === option.Value as unknown as T[keyof T]}
                        disabled={option.Disabled ?? false}
                        id={`${option.Label}-${index}`}
                    />
                    <label className="form-check-label" htmlFor={`${option.Label}-${index}`}>{option.Label}</label>
                </div>
            ))}
        </div>
    );

}