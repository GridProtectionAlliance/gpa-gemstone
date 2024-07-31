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
import HelperMessage from './HelperMessage';

interface IProps<T> {
    /**
        * Record to be used in form
        * @type {T}
    */
    Record: T;
    /**
        * Field of the record to be edited
        * @type {keyof T}
    */
    Field: keyof T;
    /**
      * Setter function to update the Record
      * @param record - Updated Record
    */
    Setter: (record: T) => void;
    /**
        * Help message or element to display
        * @type {string | JSX.Element}
        * @optional
    */
    Help?: string | JSX.Element;
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
    /**
        * Label to display for the form, defaults to the Field prop
        * @type {string}
        * @optional
    */
    Label?: string
}

export default function RadioButtons<T>(props: IProps<T>) {
    const guid = React.useRef<string>(CreateGuid());
    const [showHelp, setShowHelp] = React.useState<boolean>(false);

    const showHelpIcon = props.Help !== undefined;

    return (
        <div className="form-group" data-help={guid.current}>
            <label className="form-check-label d-block">{props.Label ?? props.Field}</label>
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
            {showHelpIcon ?
                <>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }}
                        onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}>
                        ?
                    </div>
                    <HelperMessage Show={showHelp} Target={guid.current}>
                        {props.Help}
                    </HelperMessage>
                </>
                : null}
        </div>
    );

}