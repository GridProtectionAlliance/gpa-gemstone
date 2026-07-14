// ******************************************************************************************************
//  PlotGroupContext.ts - Gbtc
//
//  Copyright © 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  04/03/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';

/** Describes shared legend sizing state for a group of plots. */
export interface IPlotGroupContext {
    /** Largest legend width registered by plots in the group. */
    LegendWidth: number 
    /** Registers the legend width requested by a plot. */
    RegisterLegendWidth: (requesterID: string, width: number) => void,
    /** Removes a plot's registered legend width. */
    UnRegisterLegendWidth: (requesterID: string) => void,
    /** Whether the context has a plot-group consumer. */
    HasConsumer: boolean
}

const PlotGroupContext = React.createContext({
    HasConsumer: false,
    LegendWidth: 0,
    RegisterLegendWidth: () => undefined,
    UnRegisterLegendWidth: () => undefined,
} as IPlotGroupContext);

export default PlotGroupContext;