// ******************************************************************************************************
//  HelpIcon.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  02/19/2026 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import ToolTip from './ToolTip';

interface IProps {
    /**
     * Help content to display in the tooltip.
     * If undefined, nothing is rendered.
     * @type {string | JSX.Element}
     */
    Help?: string | JSX.Element;
    /**
     * Optional icon size in pixels. Defaults to 20.
     * @type {number}
     */
    Size?: number;
    /**
     * Optional icon color. Defaults to 'var(--info)'.
     * @type {string}
     */
    Color?: string;
    /**
     * Optional CSS class for the icon.
     * @type {string}
     */
    Class?: string;
}

/**
 * HelpIcon component.
 * Renders a question-mark icon that displays a tooltip on hover.
 */
const HelpIcon = (props: IProps) => {
    const [showHelp, setShowHelp] = React.useState<boolean>(false);
    const guid = React.useRef<string>(CreateGuid());

    if (props.Help == null || props.Help === '')
        return null;

    return (
        <>
            <span
                className={props.Class ?? "ml-2 d-flex align-items-center"}
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                data-tooltip={guid.current}
            >
                <ReactIcons.QuestionMark Color={props.Color ?? "var(--info)"} Size={props.Size ?? 20} />
            </span>
            <ToolTip Show={showHelp} Target={guid.current} Class="info" Position="top">
                {props.Help}
            </ToolTip>
        </>
    );
}

export default HelpIcon;