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

/** Describes shared legend dimensions, layout, and mass-enable behavior. */
export interface ILegendContext {
    /** Width of the compact legend layout. */
    SmWidth: number,
    /** Width of the expanded legend layout. */
    LgWidth: number,
    /** Height of the compact legend layout. */
    SmHeight: number,
    /** Height of the expanded legend layout. */
    LgHeight: number,
    /** Smallest font size used while fitting legend content. */
    SmallestFontSize: number,
    /** Whether legend entries may wrap onto multiple lines. */
    UseMultiLine: boolean,
    /** Optional callback reference used to coordinate enabled legend entries. */
    SendMassEnable?: React.MutableRefObject<(id: string)=> void>
}

/** Defines the required state and identifier for a legend entry. */
export interface ILegendRequiredProps {
    /** Controls whether the legend entry is shown as enabled. */
    enabled: boolean,
    /** Unique identifier used to coordinate the legend entry with graph data. */
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