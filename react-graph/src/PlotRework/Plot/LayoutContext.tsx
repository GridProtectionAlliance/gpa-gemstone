//******************************************************************************************************
//  LayoutContext.tsx - Gbtc
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
//  02/13/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import * as React from 'react';

interface IDataArea {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

export type LegendPosition = 'bottom' | 'left' | 'right';

export const PortalIds = {
    LEFT_AXIS: 'left-axis',
    RIGHT_AXIS: 'right-axis',
    BOTTOM_AXIS: 'bottom-axis',
    DATA: 'data',
    OVERLAY: 'overlay',
    BUTTON_TRAY: 'button-tray',
    LEGEND: 'legend',
    LEFT_LEGEND: 'left-legend',
    RIGHT_LEGEND: 'right-legend',
};

export type PortalID = typeof PortalIds[keyof typeof PortalIds];

export interface ILayoutContext {
    /**
     * Total SVG width of the layout area in pixels
     */
    TotalWidth: number;
    /**
     * Total SVG height of the layout area in pixels
     */
    TotalHeight: number;
    /**
     * Area available for plotting within the layout in pixels
     */
    DataArea: IDataArea;

    PlotID: string;

    /**
     * Default legend position set by the Plot component.
     * DataSeriesGroup components use this as a fallback when
     * no explicit LegendPosition prop is provided.
     */
    LegendPosition: LegendPosition;
}

export const LayoutContext = React.createContext<ILayoutContext>({
    TotalWidth: 0,
    TotalHeight: 0,
    DataArea: {
        Top: 0,
        Left: 0,
        Width: 0,
        Height: 0
    },
    PlotID: '',
    LegendPosition: 'bottom',
});

export const useLayoutContext = () => {
    const context = React.useContext(LayoutContext);
    return context as ILayoutContext;
}

export const GetPortalID = (plotID: string, portal: PortalID): string => {
    return `${plotID}-${portal}`;
}