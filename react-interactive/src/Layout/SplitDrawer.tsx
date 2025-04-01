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

interface IProps {
    /**
     * Minimum width (in % of total)
     */
    MinWidth: number,
    /**
     * Maximum Width (in % of total)
     */
    MaxWidth: number,
    /**
     * Default Width (in % of total) 
     */
    Width: number,
    /**
     * Indicates the initial state of the drawer
     */
    Open: boolean,
    /**
     * The Title used for this drawer
     */
    Title: string,
    /**
     * This will be called with a callback to set the Drawer to open or closed form the parent
     * @param func 
     * @returns 
     */
    GetOverride?: (func: (open: boolean) => void) => void,
    /**
     * Callback when the Drawer changes 
     * @param open 
     * @returns 
     */
    OnChange?: (open: boolean) => void,
    ShowClosed?: boolean
}

const SplitDrawer: React.FunctionComponent<IProps> = (props) => {
    return <>{props.children}</>
}

export default SplitDrawer;
