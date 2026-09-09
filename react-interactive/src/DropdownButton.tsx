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
     * Content displayed in the dropdown option.
     */
    Label: JSX.Element | string,
    /**
     * Callback fired when the enabled dropdown option is clicked.
     */
    Callback: () => void,
    /**
     * Optional group identifier used to insert dividers between adjacent groups.
     */
    Group?: number,
    /**
     * Optional flag that prevents the dropdown option callback from running, defaulting to false.
     */
    Disabled?: boolean
    /**
     * Optional content displayed in the dropdown option tooltip.
     */
    ToolTipContent?: JSX.Element,
    /**
     * Optional flag that shows the dropdown option tooltip while hovering, defaulting to false.
     */
    ShowToolTip?: boolean,
    /**
     * Optional dropdown option tooltip position, defaulting to `top`.
     */
    ToolTipLocation?: ('top' | 'bottom' | 'left' | 'right'),
    /**
     * Optional stable React key for the dropdown option, defaulting to its array index.
     */
    Key?: string | number
}

/** Supported Bootstrap-inspired button sizes. */
type BtnSize = 'sm' | 'lg' | 'xlg' | 'std';

/**
* Represents the properties for a component that renders buttons.
*/
interface IProps {
    /**
     * Content displayed in the primary button.
     */
    Label: JSX.Element | string,
    /**
     * Callback fired when the enabled primary button is clicked.
     */
    Callback: () => void,
    /**
     * Optional flag that prevents the primary button callback from running, defaulting to false.
     */
    Disabled?: boolean,
    /**
     * Options rendered in the dropdown menu.
     */
    Options: IButton[],
    /**
     * Optional Bootstrap size of the button group, defaulting to `sm`.
     */
    Size?: 'sm' | 'lg' | 'xlg' | 'std',
    /**
     * Optional inline styles applied to the button-group container.
     */
    ContainerStyle?: React.CSSProperties,
    /**
     * Optional class applied to both buttons, defaulting to `btn-primary`.
     */
    BtnClass?: string,
    /**
     * Optional content displayed in the primary button tooltip.
     */
    TooltipContent?: JSX.Element,
    /**
     * Optional primary button tooltip position, defaulting to `top`.
     */
    TooltipLocation?: ('top' | 'bottom' | 'left' | 'right'),
    /**
     * Optional flag that shows the primary button tooltip while hovering, defaulting to false.
     */
    ShowToolTip?: boolean,
}

/**
 * Renders a primary action button paired with a toggleable menu of related actions.
 * @param props - Configures the primary button, dropdown options, styling, and tooltip.
 * @returns The split-button dropdown group.
 */
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

/** Configures an individual option in a dropdown button. */
interface DropDownProps extends IButton {
    /**
     * Updates whether the parent dropdown menu is visible.
     * @param show - Whether the dropdown menu should remain open.
     */
    setShowDropDown: (show: boolean) => void,
}

/**
 * Renders one selectable action inside the dropdown menu.
 * @param props - Configures the option behavior, appearance, tooltip, and menu state setter.
 * @returns The dropdown option and its optional tooltip.
 */
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