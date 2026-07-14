// ******************************************************************************************************
//   SplitDrawer.tsx - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  12/25/2022 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';

/** Configures a drawer displayed beside split-layout content. */
interface IProps {
    /**
     * Minimum width as a percentage of the split container.
     */
    MinWidth: number,
    /**
     * Maximum width as a percentage of the split container.
     */
    MaxWidth: number,
    /**
     * Initial width as a percentage of the split container.
     */
    Width: number,
    /**
     * Initial open state of the drawer.
     */
    Open: boolean,
    /**
     * Text displayed in the drawer header.
     */
    Title: string,
    /**
     * Optional callback that exposes a function for opening or closing the drawer from its parent.
     * @param func - Function the parent can call with the desired open state.
     */
    GetOverride?: (func: (open: boolean) => void) => void,
    /**
     * Optional callback fired when the drawer's open state changes.
     * @param open - Whether the drawer is now open.
     */
    OnChange?: (open: boolean) => void,
    /**
     * Optional flag that displays the drawer title while closed, defaulting to true.
     */
    ShowClosed?: boolean
}

/**
 * Declares a collapsible child region consumed and laid out by `VerticalSplit`.
 * @param props - Supplies drawer sizing, state, title, callbacks, and content.
 * @returns The drawer's child content for `VerticalSplit` to render.
 */
const SplitDrawer = (props: React.PropsWithChildren<IProps>) => {
    return <>{props.children}</>
}

export default SplitDrawer;
