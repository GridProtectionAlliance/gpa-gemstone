//******************************************************************************************************
//  Circles.tsx - Gbtc
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
//  02/23/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { PointNode } from '@gpa-gemstone/react-graph';
import { useXViewportContext, IXDataSeries } from '../../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../../ViewportContext/YViewportContext';
import { Portal } from 'react-portal';
import { GetPortalID, PortalIds, useLayoutContext } from '../../LayoutContext';
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

export interface ICirclesProps {
    /**
     * Data points as array of [x, y] tuples
     */
    Data: [number, number][];
    /**
     * Circle radius in pixels
     */
    Radius?: number;
    /**
     * Legend label. If provided and not already inside a DataSeriesGroup,
     * automatically wraps in one to produce a legend entry.
     */
    Label?: string;
    /**
     * Fill color. Falls back to DataSeriesContext.Color, then 'currentColor'.
     */
    Color?: string;
    /**
     * Fill opacity (0-1). Falls back to DataSeriesContext.Opacity, then 1.
     */
    Opacity?: number;
    /**
     * Border stroke color.
     */
    BorderColor?: string;
    /**
     * Border stroke width in pixels.
     */
    BorderThickness?: number;
}

/**
 * Component that renders circles at specified data points.
 * This is seperate from the public Circles component to isolate the internal logic from the legend related logic.
 */
const CirclesInternal = (props: ICirclesProps) => {
    const { Data, Radius = 3, BorderColor, BorderThickness } = props;

    const regId = React.useRef(CreateGuid());

    const series = useDataSeriesContext();

    // Style resolution: prop > context > default
    const color = props.Color ?? series?.Color ?? 'currentColor';
    const opacity = props.Opacity ?? series?.Opacity ?? 1;
    const enabled = series?.Enabled ?? true;

    const [pointNode, setPointNode] = React.useState<PointNode | null>(null);
    const { PlotID } = useLayoutContext();

    const { XTransform, RegisterData: xRegisterData, UnregisterData: xUnregisterData, MinDomain: xMinDomain, MaxDomain: xMaxDomain } = useXViewportContext();
    const { YTransform, RegisterData: yRegisterData, UnregisterData: yUnregisterData } = useYViewportContext();

    // Update PointNode when data changes
    React.useEffect(() => {
        if (Data == null || Data.length === 0)
            setPointNode(null);
        else
            setPointNode(new PointNode(Data));
    }, [Data]);

    // Get visible points from PointNode
    const visiblePoints = React.useMemo(() => {
        if (pointNode == null) return [];
        return pointNode.GetData(xMinDomain, xMaxDomain, true);
    }, [pointNode, xMinDomain, xMaxDomain]);

    // Stable data series objects for axis registration
    const xDataSeries = React.useMemo<IXDataSeries>(() => ({
        GetMin: () => {
            if (pointNode == null) return undefined;
            return pointNode.minT;
        },
        GetMax: () => {
            if (pointNode == null) return undefined;
            return pointNode.maxT;
        },
        Enabled: enabled
    }), [pointNode, enabled]);

    // Y data series with dynamic limits based on current X domain
    const yDataSeries = React.useMemo<IYDataSeries>(() => ({
        GetMin: (xDomain: [number, number]) => {
            if (pointNode == null) return undefined;
            const limits = pointNode.GetLimits(xDomain[0], xDomain[1]);
            return limits[0];
        },
        GetMax: (xDomain: [number, number]) => {
            if (pointNode == null) return undefined;
            const limits = pointNode.GetLimits(xDomain[0], xDomain[1]);
            return limits[1];
        },
        GetPoints: (xValue: number, pointsAround = 1) => {
            if (pointNode == null) return undefined;
            return pointNode.GetPoints(xValue, pointsAround) as [number, number][];
        },
        Enabled: enabled
    }), [pointNode, enabled]);

    // Register with axes for auto-scaling
    React.useEffect(() => {
        const id = regId.current;
        const xRegisterDataFunc = xRegisterData.current;
        const yRegisterDataFunc = yRegisterData.current;
        const xUnregisterDataFunc = xUnregisterData.current;
        const yUnregisterDataFunc = yUnregisterData.current;

        xRegisterDataFunc(id, xDataSeries);
        yRegisterDataFunc(id, yDataSeries);

        return () => {
            xUnregisterDataFunc(id);
            yUnregisterDataFunc(id);
        };
    }, [xDataSeries, yDataSeries, xRegisterData, yRegisterData, xUnregisterData, yUnregisterData]);

    if (!enabled || pointNode == null) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g style={{ pointerEvents: 'none' }}>
                {visiblePoints.map((pt, i) => {
                    if (isNaN(pt[0]) || isNaN(pt[1])) return null;
                    return (
                        <circle
                            key={i}
                            r={Radius}
                            cx={XTransform(pt[0])}
                            cy={YTransform(pt[1])}
                            fill={color}
                            opacity={opacity}
                            stroke={BorderColor}
                            strokeWidth={BorderThickness}
                        />
                    );
                })}
            </g>
        </Portal>
    );
};

export default CirclesInternal;