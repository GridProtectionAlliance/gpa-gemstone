// ******************************************************************************************************
//  CirclePlusSVG.tsx - Gbtc
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
//  02/13/2022 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import { Application } from '@gpa-gemstone/application-typings';
import * as React from 'react';

/** Stores shared navigation state for application menu components. */
export interface IContext {
    /** Base route used for home navigation. */
    homePath: string,
    /** Security roles assigned to the current user. */
    userRoles: Application.Types.SecurityRoleName[],
    /** Whether the application sidebar is collapsed. */
    collapsed: boolean,
    /** Whether page activation uses search-parameter matching. */
    useSearchMatch: boolean,

    /** Identifier of the active menu section. */
    activeSection: string,
    /** Updates the active menu section. */
    setActiveSection: (guid: string) => void,

    /** Updates the label displayed for the active page. */
    setActivePageLabel: (label: string | null) => void
}

export const Context = React.createContext({
    homePath: '',
    userRoles: ['Viewer'],
    collapsed: false,
    useSearchMatch: false,
    activeSection: '',
    setActiveSection: () => {/*Do nothing*/ },
    setActivePageLabel: () => {/*Do nothing*/ }
} as IContext);


export const SectionContext = React.createContext("");