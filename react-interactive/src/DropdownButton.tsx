// ******************************************************************************************************
//  DropdownButton.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  10/24/2023 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import ToolTip from './ToolTip';

interface IButton { 
    Label: string,
    Callback: () => void,
    Group?: number,
    Disabled?: boolean
    }

interface IProps {
    Label: string,
    Callback: () => void,
    Disabled?: boolean,
    Options: IButton[],
    Size?: 'sm' | 'lg' | 'xlg',
    BtnClass?: string,
    TooltipContent?: JSX.Element,
    ShowToolTip?: boolean,
}
const BtnDropdown = (props: IProps) => {
    const guid = React.useRef<string>(CreateGuid());

    const size = props.Size === undefined ? 'sm' : props.Size;
    const className = props.BtnClass === undefined ? 'btn-primary' : props.BtnClass;
    const disabled = props.Disabled === undefined ? false : props.Disabled;
    
    const [hover, setHover] = React.useState<boolean>(false);
    const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

    return (
        <div className={`btn-group btn-group-${size}`}>
            <button className={`btn ${className} ${(disabled ? "" : " disabled")}`}
                data-tooltip={guid.current}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => {
                    if (disabled)
                        return;
                   props.Callback();
                }}> {props.Label}
            </button>
            <button type="button"
                className={`btn ${className} dropdown-toggle dropdown-toggle-split`}
                onClick={() => { setShowDropdown((x) => !x) }}>
                <span className="sr-only">Toggle Dropdown</span>
            </button>
            <div className={"dropdown-menu" + (showDropdown ? " show" : "")}>
                {props.Options.map((t, i) => <>
                    {i > 0 && props.Options[i].Group !== props.Options[i - 1].Group ?
                        <div key={t.Label + '-divider'} className="dropdown-divider"></div> : null}
                    <a className="dropdown-item" key={t.Label}
                        onClick={() => { setShowDropdown(false); t.Callback(); }}>
                        {t.Label}
                    </a>
                </>)}
            </div>
            <ToolTip Show={hover && props.ShowToolTip != undefined && props.ShowToolTip}
                Position={'top'} Theme={'dark'} Target={guid.current}>
                {props.TooltipContent}
            </ToolTip>
    </div>)
}

export default BtnDropdown