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
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { ToolTip } from '@gpa-gemstone/react-forms';

/**
 * Represents the structure of a button used within the application.
 */
interface IButton {
    /** 
     * Text label that appears on the button
     */
    Label: JSX.Element | string,
    /**
     * Callback function for when a button is clicked
     * @returns 
     */
    Callback: () => void,
    /**
     * Optional group number for grouping items visually with dividers
     */
    Group?: number,
    /**
     * Optional flag to disable button
     */
    Disabled?: boolean
    /**
     * Optional content to render inside tooltip
     */
    ToolTipContent?: JSX.Element,
    /**
     * Optional flag to render tooltip on button
     */
    ShowToolTip?: boolean,
    /**
     * Optional location of tooltip, defaulting to top
     */
    ToolTipLocation?: ('top' | 'bottom' | 'left' | 'right'),
    /**
     * Optional key to be used on the fragment that is parent of the dropdown option.
     */
    Key?: string | number
}

type BtnSize = 'sm' | 'lg' | 'xlg' | 'std';

/**
* Represents the properties for a component that renders buttons.
*/
interface IProps {
    /**
     * Text label that appears on the main button
     */
    Label: JSX.Element | string,
    /**
     * Callback function for when the main button is clicked
     * @returns
     */
    Callback: () => void,
    /**
     * Optional flag to disable the main button
     */
    Disabled?: boolean,
    /**
     * Array of button options rendered inside the dropdown menu
     */
    Options: IButton[],
    /**
     * Optional size of the button group
     */
    Size?: 'sm' | 'lg' | 'xlg' | 'std',
    /**
     * Optional CSS applied to the container
     */
    ContainerStyle?: React.CSSProperties,
    /**
     * Optional CSS class applied to the buttons, defaulting to 'btn-primary'
     */
    BtnClass?: string,
    /**
     * Optional content to render inside the tooltip
     */
    TooltipContent?: JSX.Element,
    /**
     * Optional location of the tooltip, defaulting to top
     */
    TooltipLocation?: ('top' | 'bottom' | 'left' | 'right'),
    /**
     * Optional flag to render a tooltip on the main button
     */
    ShowToolTip?: boolean,
}

const BtnDropdown = (props: IProps) => {
    const guid = React.useRef<string>(CreateGuid());
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const size = props.Size ?? 'sm';
    const btnClass = props.BtnClass ?? 'btn-primary';
    const disabled = props.Disabled ?? false;

    const [hover, setHover] = React.useState<boolean>(false);
    const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!showDropdown) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current !== null && !containerRef.current.contains(event.target as Node))
                setShowDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    return (
        <div ref={containerRef} className={getBtnClass(size)} style={props.ContainerStyle}>
            <button
                type="button"
                className={`btn ${btnClass} ${(!disabled ? "" : " disabled")}`}
                data-tooltip={guid.current}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => {
                    if (disabled)
                        return;
                    props.Callback();
                }}
            >
                {props.Label}
            </button>
            <button type="button"
                className={`btn ${btnClass} dropdown-toggle dropdown-toggle-split border-left`}
                onClick={() => { setShowDropdown((x) => !x) }}
            >
                <span className="sr-only">
                    Toggle Dropdown
                </span>
            </button>
            <div className={"dropdown-menu" + (showDropdown ? " show" : "")} style={{ position: 'absolute' }}>
                {props.Options.map((option, i) =>
                    <React.Fragment key={option.Key ?? i}>
                        {i > 0 && props.Options[i].Group !== props.Options[i - 1].Group ?
                            <div className="dropdown-divider" />
                            : null}
                        <DropDownOption {...option} setShowDropDown={setShowDropdown} />
                    </React.Fragment>)}
            </div>
            <ToolTip
                Show={hover && (props.ShowToolTip ?? false)}
                Position={props.TooltipLocation ?? 'top'}
                Target={guid.current}
            >
                {props.TooltipContent}
            </ToolTip>
        </div>)
}

const getBtnClass = (size: BtnSize) => {
    if(size === 'std')
        return 'btn-group btn-group'

    return `btn-group btn-group-${size}`
}

interface DropDownProps extends IButton {
    setShowDropDown: (show: boolean) => void,
}

const DropDownOption = (props: DropDownProps) => {
    const [dropDownHover, setDropDownHover] = React.useState<boolean>(false);
    const guid = React.useRef<string>(CreateGuid());

    return (
        <>
            <a className={"dropdown-item" + ((props?.Disabled ?? false) ? " disabled" : "")}
                style={{ cursor: ((props?.Disabled ?? false) ? undefined : 'pointer') }}
                onClick={() => {
                    props.setShowDropDown(false);
                    if (!(props?.Disabled ?? false))
                        props.Callback();
                }}
                onMouseEnter={() => setDropDownHover(true)}
                onMouseLeave={() => setDropDownHover(false)}
                data-tooltip={guid.current}
            >
                {props.Label}
            </a>
            <ToolTip Show={dropDownHover && (props.ShowToolTip ?? false)}
                Position={props.ToolTipLocation ?? 'top'} Target={guid.current}>
                {props.ToolTipContent}
            </ToolTip>
        </>
    )
}
export default BtnDropdown