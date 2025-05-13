//******************************************************************************************************
//  Checkbox.tsx - Gbtc
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

import { BtnDropdown } from "@gpa-gemstone/react-interactive";
import React from "react";
const baseTestId = 'btn-dropdown-test';

function BtnDropdownTestComponent() {
    const [message, setMessage] = React.useState<string>(``);
    const buttonOptions = [{
        Label: 'Option 1',
        Callback: () => setMessage(`${baseTestId} option 1`),
        Group: 1,
        Disabled: false,
        ToolTipContent: <>Test content for option 1</>,
        ShowToolTip: true,
        ToolTipLocation: 'top' as "top" | "bottom" | "left" | "right" | undefined,
        Key: 1
    },
    {
        Label: 'Option 2',
        Callback: () => setMessage(`${baseTestId} option 2`),
        Group: 1,
        Disabled: false,
        ToolTipContent: <>Test content for option 2</>,
        ShowToolTip: true,
        ToolTipLocation: 'top' as "top" | "bottom" | "left" | "right" | undefined,
        Key: 2
    },
    {
        Label: 'Option 3',
        Callback: () => setMessage(`${baseTestId} option 3`),
        Group: 1,
        Disabled: false,
        ToolTipContent: <>Test content for option 3</>,
        ShowToolTip: true,
        ToolTipLocation: 'top' as "top" | "bottom" | "left" | "right" | undefined,
        Key: 3
    },
    {
        Label: 'Option 4',
        Callback: () => setMessage(`${baseTestId} option 4`),
        Group: 2,
        Disabled: true,
        ToolTipContent: <>Test content for option 4</>,
        ShowToolTip: true,
        ToolTipLocation: 'top' as "top" | "bottom" | "left" | "right" | undefined,
        Key: 4
    },
    {
        Label: 'Option 5',
        Callback: () => setMessage(`${baseTestId} option 5`),
        Group: 2,
        Disabled: false,
        ToolTipContent: <>Test content for option 5</>,
        ShowToolTip: true,
        ToolTipLocation: 'top' as "top" | "bottom" | "left" | "right" | undefined,
        Key: 5
    }]

    return (
        <div className="row g-2" id={baseTestId}>
            <div className="col" id={`${baseTestId}-1`}>
                <div id={`${baseTestId}-message`}>{message}</div>
                <BtnDropdown
                    Label={`${baseTestId}Button-1`}
                    Callback={() => setMessage(`${baseTestId}Button-1`)}
                    Disabled={false}
                    Options={buttonOptions}
                    Size={'sm'}
                    BtnClass={'btn-primary'}
                    TooltipContent={<>Tooltip Content of sm btndropdown</>}
                    TooltipLocation={'top'}
                    ShowToolTip={true}
                />
            </div>
            <div className="col" id={`${baseTestId}-2`}>
                <BtnDropdown
                    Label={`${baseTestId}Button-2`}
                    Callback={() => setMessage(`${baseTestId}Button-2`)}
                    Disabled={false}
                    Options={buttonOptions}
                    Size={'lg'}
                    BtnClass={'btn-secondary'}
                    TooltipContent={<>Tooltip Content of lg btndropdown</>}
                    TooltipLocation={'top'}
                    ShowToolTip={true}
                />
            </div>
            <div className="col" id={`${baseTestId}-3`}>
                <BtnDropdown
                    Label={`${baseTestId}Button-3`}
                    Callback={() => setMessage(`${baseTestId}Button-3`)}
                    Disabled={false}
                    Options={buttonOptions.map((o) => o)}
                    Size={'xlg'}
                    BtnClass={'btn-dark'}
                    TooltipContent={<>Tooltip Content of xlg btndropdown</>}
                    TooltipLocation={'top'}
                    ShowToolTip={true}
                />
            </div>
            <div className="col" id={`${baseTestId}-4`}>
                <BtnDropdown
                    Label={`${baseTestId}Button-4`}
                    Callback={() => setMessage(`${baseTestId}Button-4`)}
                    Options={[]}
                    TooltipLocation={'top'}
                    ShowToolTip={true}
                />
            </div>
        </div>
    )
}

export default BtnDropdownTestComponent;
