//******************************************************************************************************
//  RadioButtons.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  05/05/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import { RadioButtons } from "@gpa-gemstone/react-forms";
import React from "react";

type ITestRecord = {
    textValue: string | number,
}

const options: {
    Value: string | number,
    Label: string,
    Disabled?: boolean
}[] = [
    {
        Value: 1,
        Label: 'first option label',
        Disabled: false
    },
    {
        Value: 'second option',
        Label: 'second option label',
        Disabled: false
    },
    {
        Value: 'third option',
        Label: 'third option label',
        Disabled: false
    },
    {
        Value: 'fourth option',
        Label: 'fourth option label',
        Disabled: false
    },
    {
        Value: 'fifth option',
        Label: 'fifth option label',
        Disabled: false
    },
    {
        Value: 'sixth option',
        Label: 'sixth option label',
        Disabled: false
    },
    {
        Value: 'seventh option',
        Label: 'seventh option label',
        Disabled: true
    },
];

const RadioButtonsTestComponent: React.FC<{ ComponentTestID: string }> = (props) => {
    const [text, setText] = React.useState<ITestRecord>({ textValue: '' });

    return (
        <div id={props.ComponentTestID}>
            <div id={`${props.ComponentTestID}-text`}>The record is {text}</div>
            <div id={`${props.ComponentTestID}-buttons`}>
                <RadioButtons
                    Options={options}
                    Record={text}
                    Field={'textValue'}
                    Setter={setText}
                    Position="horizontal"
                />
            </div>
        </div>
    );
}
export default RadioButtonsTestComponent;