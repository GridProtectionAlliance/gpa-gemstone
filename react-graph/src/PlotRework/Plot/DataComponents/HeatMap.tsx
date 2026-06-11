//******************************************************************************************************
//  HeatMap.tsx - Gbtc
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
//  03/04/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Portal } from 'react-portal';
import { CreateGuid, HsvToHex } from '@gpa-gemstone/helper-functions';
import { useXViewportContext, IXDataSeries } from '../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../ViewportContext/YViewportContext';
import { GetPortalID, PortalIds, useLayoutContext } from '../LayoutContext';
import { useDataSeriesContext } from '../Legend/DataSeriesContext';
import DataSeriesGroup from '../Legend/DataSeriesGroup';
import HeatLegend from '../Legend/HeatLegend';

export interface IHeatMapProps {
    /**
     * Data points as [x, y, z] tuples where z controls color intensity.
     */
    Data: [number, number, number][];
    /** Hue component of the color (0-1). */
    Hue: number;
    /** Saturation component of the color (0-1). */
    Saturation: number;
    /** Alignment of bars relative to the X value. Default: 'left'. */
    BarAlign?: 'left' | 'center' | 'right';
    /** Y-axis bin size in data units. When provided, each bar spans [y, y + BinSize]. When omitted, bars extend to the Y domain floor. */
    BinSize?: number;
    /** Fixed sample interval in the same units as X data. Used to calculate bar width. When omitted, width is auto-calculated from data spread. */
    SampleInterval?: number;
    /**
     * Legend label. If provided and not already inside a DataSeriesGroup,
     * automatically wraps in one to produce a legend entry.
     */
    Label?: string;
    /** Unit label appended to legend values. */
    LegendUnit?: string;
}

/**
 * Renders a heatmap as colored rectangles where the z value of each [x, y, z] data point
 * controls the color intensity. For legend support, wrap in a DataSeriesGroup:
 *
 * ```tsx
 * <DataSeriesGroup Label="Temperature" Color="red">
 *     <HeatMap Data={data} Hue={0.6} Saturation={0.8} BinSize={10} />
 * </DataSeriesGroup>
 * ```
 */
const HeatMapInternal = (props: IHeatMapProps) => {
    const { Data, Hue, Saturation, BarAlign = 'left', BinSize, SampleInterval } = props;

    const regId = React.useRef(CreateGuid());
    const series = useDataSeriesContext();
    const enabled = series?.Enabled ?? true;

    const { PlotID } = useLayoutContext();
    const {XTransform, MinDomain: xMinDomain, MaxDomain: xMaxDomain, RegisterData: xRegisterData, UnregisterData: xUnregisterData } = useXViewportContext();
    const {YTransform, RegisterData: yRegisterData, UnregisterData: yUnregisterData } = useYViewportContext();

    // Compute X and Y extents from data
    const { xMin, xMax, yMin, yMax } = React.useMemo(() => {
        if (Data.length === 0) return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };

        let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
        for (const [x, y] of Data) {
            if (x < xMin) xMin = x;
            if (x > xMax) xMax = x;
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }

        if (BinSize != null) yMax += BinSize;

        return { xMin, xMax, yMin, yMax };
    }, [Data, BinSize]);

    // Compute z limits from visible data
    const zLimits = React.useMemo((): [number, number] => {
        if (Data.length === 0) return [0, 1];

        let zMin = Infinity, zMax = -Infinity;
        for (const [x, , z] of Data) {
            if (x >= xMinDomain && x <= xMaxDomain) {
                if (z < zMin) zMin = z;
                if (z > zMax) zMax = z;
            }
        }

        if (!isFinite(zMin) || !isFinite(zMax)) return [0, 1];
        if (zMin === zMax) return [zMin, zMin + 1];
        return [zMin, zMax];
    }, [Data, xMinDomain, xMaxDomain]);

    // Bar width in pixels
    const barWidthPx = React.useMemo(() => {
        if (Data.length === 0) return 0;

        if (SampleInterval != null)
            return Math.abs(XTransform(xMin + SampleInterval) - XTransform(xMin));

        if (Data.length <= 1) return 10;
        const totalPx = Math.abs(XTransform(xMax) - XTransform(xMin));
        return totalPx / Data.length;
    }, [Data, SampleInterval, xMin, xMax, XTransform]);

    // Bar offset based on alignment
    const barOffset = React.useMemo(() => {
        switch (BarAlign) {
            case 'center': return barWidthPx * 0.5;
            case 'right': return barWidthPx;
            default: return 0;
        }
    }, [BarAlign, barWidthPx]);

    // X data series for auto-scaling
    const xDataSeries = React.useMemo<IXDataSeries>(() => ({
        GetMin: () => Data.length > 0 ? xMin : undefined,
        GetMax: () => Data.length > 0 ? xMax : undefined,
        Enabled: enabled
    }), [Data, xMin, xMax, enabled]);

    // Y data series — contributes Y range when overlapping visible X domain
    const yDataSeries = React.useMemo<IYDataSeries>(() => ({
        GetMin: (xDomain: [number, number]) => {
            if (Data.length === 0 || xMax < xDomain[0] || xMin > xDomain[1]) return undefined;
            return yMin;
        },
        GetMax: (xDomain: [number, number]) => {
            if (Data.length === 0 || xMax < xDomain[0] || xMin > xDomain[1]) return undefined;
            return yMax;
        },
        Enabled: enabled
    }), [Data, xMin, xMax, yMin, yMax, enabled]);

    // Register with axes
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

    if (!enabled || Data.length === 0) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g style={{ pointerEvents: 'none' }}>
                {Data.map((pt, i) => {
                    const [x, y, z] = pt;
                    const xPx = XTransform(x) - barOffset;
                    const yTopPx = BinSize != null
                        ? YTransform(y + BinSize)
                        : YTransform(yMax);
                    const yBottomPx = YTransform(y);
                    const heightPx = Math.abs(yBottomPx - yTopPx);

                    const value = zLimits[1] === zLimits[0] ? 0.5 : 1 - (z - zLimits[0]) / (zLimits[1] - zLimits[0]);
                    const color = HsvToHex(Hue, Saturation, value);

                    return (
                        <rect
                            key={i}
                            x={xPx}
                            y={Math.min(yTopPx, yBottomPx)}
                            width={barWidthPx}
                            height={heightPx}
                            fill={color}
                            stroke={color}
                        />
                    );
                })}
            </g>
        </Portal>
    );
};

/**
 * Public-facing HeatMap component.
 * If Label is provided and not already inside a DataSeriesGroup, wraps in one
 * so the legend entry and enabled state are handled by the group.
 */
const HeatMap = (props: IHeatMapProps) => {
    const series = useDataSeriesContext();
    const isInGroup = series != null;

    // Compute z limits for the legend
    const zLimits = React.useMemo((): [number, number] => {
        if (props.Data.length === 0) return [0, 1];
        let zMin = Infinity, zMax = -Infinity;
        for (const [, , z] of props.Data) {
            if (z < zMin) zMin = z;
            if (z > zMax) zMax = z;
        }
        if (zMin === zMax) return [zMin, zMin + 1];
        return [zMin, zMax];
    }, [props.Data]);

    if (!isInGroup && props.Label != null) {
        return (
            <DataSeriesGroup
                Label={props.Label}
                CustomLegend={
                    <HeatLegend
                        MinValue={zLimits[0]}
                        MaxValue={zLimits[1]}
                        Hue={props.Hue}
                        Saturation={props.Saturation}
                        Unit={props.LegendUnit}
                        Enabled={true}
                        OnToggle={() => {/* overridden by DataSeriesGroup */}}
                    />
                }
            >
                <HeatMapInternal {...props} />
            </DataSeriesGroup>
        );
    }

    return <HeatMapInternal {...props} />;
};

export default HeatMap;