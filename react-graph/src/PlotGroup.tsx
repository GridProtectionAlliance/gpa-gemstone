// ******************************************************************************************************
//  PlotGroup.tsx - Gbtc
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
import PlotGroupContext, { IPlotGroupContext } from './PlotGroupContext';

const PlotGroup = (props: React.PropsWithChildren<{}>) => {
    const legendWidthMap = React.useRef<Map<string, number>>(new Map());
    const [maxLegendWidth, setMaxLegendWidth] = React.useState<number>(0);

    const RegisterLegendWidth = React.useCallback((requesterID: string, width: number) => {
        legendWidthMap.current.set(requesterID, width);
        const newMaxVal = Math.max(...legendWidthMap.current.values());
        setMaxLegendWidth(newMaxVal)
    }, [])

    const UnRegisterLegendWidth = React.useCallback((requesterID: string) => {
        legendWidthMap.current.delete(requesterID);
        setMaxLegendWidth(() => {
            const values = [...legendWidthMap.current.values()];
            return Math.max(...values);
        });
    }, [])

    const contextValue = React.useMemo<IPlotGroupContext>(() => {

        return {
            LegendWidth: maxLegendWidth,
            RegisterLegendWidth,
            UnRegisterLegendWidth,
            HasConsumer: true
        }

    }, [maxLegendWidth])

    return (
        <PlotGroupContext.Provider value={contextValue}>
            {props.children}
        </PlotGroupContext.Provider>
    )
}

export default PlotGroup;