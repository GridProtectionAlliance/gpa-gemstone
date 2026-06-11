//******************************************************************************************************
//  PlotGroupContext.ts - Gbtc
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
//  03/09/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { LegendPosition } from './LayoutContext';

export interface IPlotGroupContext {
    /** Whether this Plot is inside a PlotGroup. */
    IsGrouped: boolean;
    /** The legend position enforced by the group. */
    LegendPosition: LegendPosition;
    /** Max legend width across all grouped plots (used for left/right legends). */
    LegendWidth: number;
    /** Max legend height across all grouped plots (used for bottom legends). */
    LegendHeight: number;
    /** Register a Plot's measured legend width. */
    RegisterLegendWidth: (plotId: string, width: number) => void;
    /** Register a Plot's measured legend height. */
    RegisterLegendHeight: (plotId: string, height: number) => void;
    /** Unregister a Plot's legend dimensions on unmount. */
    Unregister: (plotId: string) => void;
}

const defaultContext: IPlotGroupContext = {
    IsGrouped: false,
    LegendPosition: 'bottom',
    LegendWidth: 0,
    LegendHeight: 0,
    RegisterLegendWidth: () => { /* noop */ },
    RegisterLegendHeight: () => { /* noop */ },
    Unregister: () => { /* noop */ },
};

const PlotGroupContext = React.createContext<IPlotGroupContext>(defaultContext);

export const usePlotGroupContext = (): IPlotGroupContext => React.useContext(PlotGroupContext);

export default PlotGroupContext;