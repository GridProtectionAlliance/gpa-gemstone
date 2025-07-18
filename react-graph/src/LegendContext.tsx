// ******************************************************************************************************
//  GraphContext.tsx - Gbtc
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
//  02/01/2024 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';

export interface ILegendContext {
    SmWidth: number,
    LgWidth: number,
    SmHeight: number,
    LgHeight: number,
    SmallestFontSize: number,
    UseMultiLine: boolean,
    SendMassEnable?: React.MutableRefObject<(id: string)=> void>
}

export interface ILegendRequiredProps {
    enabled: boolean,
    id: string
}

export const LegendContext = React.createContext<ILegendContext>({
    SmWidth: 0,
    LgWidth: 0,
    SmHeight: 0,
    LgHeight: 0,
    SmallestFontSize: 0,
    UseMultiLine: false,
    SendMassEnable: undefined
});