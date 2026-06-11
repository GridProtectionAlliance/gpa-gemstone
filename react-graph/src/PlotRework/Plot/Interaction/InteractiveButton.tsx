//******************************************************************************************************
//  InteractiveButton.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  02/27/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { RenderButtonIcon } from './InteractiveButtons';

/** Public props — this is what consumers use. */
export interface IInteractiveButtonProps {
    /** SVG icon content (paths, lines, polylines, etc.) rendered inside a 0 0 24 24 viewBox */
    Icon: React.ReactNode;
    /** Whether this button is currently active (controls highlight styling) */
    IsActive?: boolean;
    /** Click handler */
    OnClick?: () => void;
    /** Adds extra spacing above the button*/
    AddSeperator?: boolean;
}

/** Internal props injected by the tray via cloneElement. Not exported. */
interface IInternalProps extends IInteractiveButtonProps {
    X: number;
    Y: number;
}

/** Tray layout constants shared with InteractiveButtons */
export const BUTTON_R = 10;
export const BUTTON_SPACING = 25;

/**
 * A single interactive button rendered in the plot's button tray.
 *
 * Can be used directly as a child of Plot to inject custom buttons:
 * ```tsx
 * <Plot Width={800} Height={400}>
 *     <InteractiveButton
 *         Icon={<circle cx="12" cy="12" r="6" />}
 *         OnClick={() => handleSelect()}
 *     />
 *     <TimeXAxis>...</TimeXAxis>
 * </Plot>
 * ```
 */
const InteractiveButton = (externalProps: IInteractiveButtonProps) => {
    const props = externalProps as IInternalProps;
    const { Icon, IsActive = false, OnClick, X, Y } = props;

    const handleClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();

        if (OnClick != null)
            OnClick();
    }, [OnClick]);

    return (
        <g>
            <circle
                cx={X}
                cy={Y}
                r={IsActive ? BUTTON_R * 1.2 : BUTTON_R}
                fill={'var(--primary)'}
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onClick={handleClick}
            />
            {RenderButtonIcon(Icon, X, Y)}
        </g>
    );
};

export default InteractiveButton;