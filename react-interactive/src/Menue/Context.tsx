﻿// ******************************************************************************************************
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

export interface IContext {
    homePath: string,
    userRoles: Application.Types.SecurityRoleName[],
    collapsed: boolean,
    useSearchMatch: boolean,

    activeSection: string,
    setActiveSection: (guid: string) => void,

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