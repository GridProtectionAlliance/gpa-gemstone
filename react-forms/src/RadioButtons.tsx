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
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import ToolTip from './ToolTip';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
    /**
        * Position to display radion buttons in
        * @type {'vertical' | 'horizontal'}
        * @optional
    */
    Position?: ('vertical' | 'horizontal'),
    /**
        * Options for the radion buttons
        * @type {{ Value: string | number; Label: string, Disabled?: boolean }[]}
    */
    Options: {
        Value: string | number,
        Label: string,
        Disabled?: boolean
    }[];
}

export default function RadioButtons<T>(props: IProps<T>) {
    const [guid] = React.useState<string>(CreateGuid());
    const [showHelp, setShowHelp] = React.useState<boolean>(false);

    // Variables to control the rendering of label and help icon.
    const showHelpIcon = props.Help !== undefined;
    const label = props.Label === undefined ? props.Field : props.Label;

    return (
        <div className="form-group">
            <label className="form-check-label w-100 d-flex align-items-center">
                <span>
                    {label}
                </span>
                {showHelpIcon ?
                    <>
                        <span className="ml-2 d-flex align-items-center"
                            onMouseEnter={() => setShowHelp(true)}
                            onMouseLeave={() => setShowHelp(false)}
                            data-tooltip={guid}
                        >
                            <ReactIcons.QuestionMark Color="var(--info)" Size={20} />
                        </span>
                        <ToolTip Show={showHelp} Target={guid} Class="info" Position="bottom">
                            {props.Help}
                        </ToolTip>
                    </>
                    : null}
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