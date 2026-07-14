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
     * Optional help content shown in the tooltip; no icon is rendered when omitted or empty.
     */
    Help?: string | JSX.Element;
    /**
     * Optional icon size in pixels, defaulting to 20.
     */
    Size?: number;
    /**
     * Optional icon color, defaulting to `var(--info)`.
     */
    Color?: string;
    /**
     * Optional CSS class applied to the icon wrapper.
     */
    Class?: string;
}

/**
 * Renders a question-mark icon that reveals help content on hover.
 * @param props - Help content and optional icon presentation settings.
 * @returns A tooltip-enabled help icon, or null when no help is provided.
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