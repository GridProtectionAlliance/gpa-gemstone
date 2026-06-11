//******************************************************************************************************
//  PlotGroup.tsx - Gbtc
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
import PlotGroupContext, { IPlotGroupContext } from './PlotGroupContext';
import { LegendPosition } from './LayoutContext';

export interface IPlotGroupProps {
    /** Legend position enforced on all child Plots. */
    LegendPosition: LegendPosition;
}

const PlotGroup = (props: React.PropsWithChildren<IPlotGroupProps>) => {
    const { LegendPosition, children } = props;

    const widthMap = React.useRef<Map<string, number>>(new Map());
    const heightMap = React.useRef<Map<string, number>>(new Map());

    const [maxWidth, setMaxWidth] = React.useState(0);
    const [maxHeight, setMaxHeight] = React.useState(0);

    const recalcMax = React.useCallback((map: Map<string, number>): number => {
        const values = [...map.values()];
        return values.length > 0 ? Math.max(...values) : 0;
    }, []);

    const RegisterLegendWidth = React.useCallback((plotId: string, width: number) => {
        const prev = widthMap.current.get(plotId);
        if (prev === width) return;
        widthMap.current.set(plotId, width);
        setMaxWidth(recalcMax(widthMap.current));
    }, [recalcMax]);

    const RegisterLegendHeight = React.useCallback((plotId: string, height: number) => {
        const prev = heightMap.current.get(plotId);
        if (prev === height) return;
        heightMap.current.set(plotId, height);
        setMaxHeight(recalcMax(heightMap.current));
    }, [recalcMax]);

    const Unregister = React.useCallback((plotId: string) => {
        widthMap.current.delete(plotId);
        heightMap.current.delete(plotId);
        setMaxWidth(recalcMax(widthMap.current));
        setMaxHeight(recalcMax(heightMap.current));
    }, [recalcMax]);

    const contextValue = React.useMemo<IPlotGroupContext>(() => ({
        IsGrouped: true,
        LegendPosition,
        LegendWidth: maxWidth,
        LegendHeight: maxHeight,
        RegisterLegendWidth,
        RegisterLegendHeight,
        Unregister,
    }), [LegendPosition, maxWidth, maxHeight, RegisterLegendWidth, RegisterLegendHeight, Unregister]);

    React.useEffect(() => {
        console.log('PlotGroup maxLegendWidth updated:', maxWidth);
    },[maxWidth])

    return (
        <PlotGroupContext.Provider value={contextValue}>
            {children}
        </PlotGroupContext.Provider>
    );
};

export default PlotGroup;