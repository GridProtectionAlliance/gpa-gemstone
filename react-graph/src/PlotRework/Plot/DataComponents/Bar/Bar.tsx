//******************************************************************************************************
//  Bar.tsx - Gbtc
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
//  03/03/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Portal } from 'react-portal';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { useXViewportContext, IXDataSeries } from '../../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../../ViewportContext/YViewportContext';
import { GetPortalID, PortalIds, useLayoutContext } from '../../LayoutContext';
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';

type FillStyle = 'Hatched' | 'Solid';

export interface IBarStyle {
    /** Opacity of this portion of the bar. */
    Opacity?: number;
    /** Color of this portion of the bar. */
    Color?: string;
    /** Stroke color of this portion of the bar. */
    StrokeColor?: string;
    /** Stroke width of this portion of the bar. */
    StrokeWidth?: number;
    /** Fill style. Default: 'Solid'. */
    Fill?: FillStyle;
}

export interface IBarProps {
    /** Array of Y values defining the segments of the bar. */
    Data: number[];
    /** X position of the bar in data units. */
    BarOrigin: number;
    /** Whether BarOrigin refers to the left, right, or center of the bar. Default: 'left'. */
    XBarOrigin?: 'left' | 'right' | 'center';
    /** Width of the bar in data units. */
    BarWidth: number;
    /** Fill color. Falls back to DataSeriesContext.Color, then 'currentColor'. */
    Color?: string;
    /**
     * Optional per-segment style override.
     * @param yValues - The [bottom, top] of this segment.
     * @param index - Index of this segment (ascending from lowest).
     */
    GetBarStyle?: (yValues: [number, number], index: number) => IBarStyle;
}

const defaultStyle: IBarStyle = {
    Opacity: 0.5,
    StrokeColor: 'currentColor',
};

/**
 * Stacked bar data component. Renders a single bar at a given X position
 * with segments defined by Y data values. For legend support, wrap in a DataSeriesGroup:
 *
 * ```tsx
 * <DataSeriesGroup Label="Revenue" Color="steelblue">
 *     <StackedBar BarOrigin={2024} BarWidth={0.8} Data={[0, 50, 120]} />
 * </DataSeriesGroup>
 * ```
 */
const StackedBar = (props: IBarProps) => {
    const { Data, BarOrigin, XBarOrigin = 'left', BarWidth, GetBarStyle } = props;

    const regId = React.useRef(CreateGuid());
    const series = useDataSeriesContext();

    const color = props.Color ?? series?.Color ?? 'currentColor';
    const enabled = series?.Enabled ?? true;

    const { PlotID } = useLayoutContext();
    const {RegisterData: xRegisterData, UnregisterData: xUnregisterData, XTransform } = useXViewportContext();
    const {RegisterData: yRegisterData, UnregisterData: yUnregisterData, YTransform, MinDomain: yMinDomain } = useYViewportContext();

    // Compute the left edge X value in data space
    const xLeft = React.useMemo(() => {
        switch (XBarOrigin) {
            default:
            case 'left': return BarOrigin;
            case 'right': return BarOrigin - BarWidth;
            case 'center': return BarOrigin - BarWidth / 2;
        }
    }, [BarOrigin, XBarOrigin, BarWidth]);

    // X data series — single bar contributes its full width
    const xDataSeries = React.useMemo<IXDataSeries>(() => ({
        GetMin: () => xLeft,
        GetMax: () => xLeft + BarWidth,
        Enabled: enabled
    }), [xLeft, BarWidth, enabled]);

    // Y data series — contributes min/max of Data when bar overlaps the X domain
    const yDataSeries = React.useMemo<IYDataSeries>(() => ({
        GetMin: (xDomain: [number, number]) => {
            if (Data.length === 0 || xLeft + BarWidth < xDomain[0] || xLeft > xDomain[1])
                return undefined;
            return Math.min(...Data);
        },
        GetMax: (xDomain: [number, number]) => {
            if (Data.length === 0 || xLeft + BarWidth < xDomain[0] || xLeft > xDomain[1])
                return undefined;
            return Math.max(...Data);
        },
        Enabled: enabled
    }), [Data, xLeft, BarWidth, enabled]);

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

    // Build bar segments
    const bars = React.useMemo(() => {
        if (Data.length === 0) return null;

        const leftPx = XTransform(xLeft);
        const rightPx = XTransform(xLeft + BarWidth);
        const widthPx = rightPx - leftPx;

        const yValues = [...Data];
        // Insert bottom of bar at Y domain min if only 1 value
        if (yValues.length === 1)
            yValues.push(yMinDomain);

        yValues.sort((a, b) => a - b);

        const segments: JSX.Element[] = [];

        for (let i = 0; i < yValues.length - 1; i++) {
            const yUpperPx = YTransform(yValues[i]);
            const yLowerPx = YTransform(yValues[i + 1]);
            const heightPx = yUpperPx - yLowerPx;

            const style: IBarStyle = {
                ...defaultStyle,
                Color: color,
                ...(GetBarStyle != null ? GetBarStyle([yValues[i], yValues[i + 1]], i) : {}),
            };

            let fillProp: string;
            const extraElements: JSX.Element[] = [];

            switch (style.Fill) {
                case 'Hatched':
                    fillProp = `url(#${regId.current}_${i})`;
                    extraElements.push(
                        <pattern id={`${regId.current}_${i}`} width="24" height="24" patternUnits="userSpaceOnUse" key={`hatch_${i}`}>
                            <path
                                d="M -3 3 L 6 -6 M 0 24 L 24 0 M 21 27 L 30 18"
                                strokeWidth={6}
                                stroke={style.Color}
                            />
                        </pattern>
                    );
                    break;
                default:
                case 'Solid':
                    fillProp = style.Color ?? color;
                    break;
            }

            segments.push(...extraElements);
            segments.push(
                <rect
                    key={i}
                    x={leftPx}
                    y={yLowerPx}
                    width={widthPx}
                    height={heightPx}
                    fill={fillProp}
                    opacity={style.Opacity}
                    stroke={style.StrokeColor}
                    strokeWidth={style.StrokeWidth}
                />
            );
        }

        return segments;
    }, [Data, xLeft, BarWidth, color, GetBarStyle, XTransform, YTransform, yMinDomain]);

    if (!enabled || Data.length === 0)
         return null;

    const leftPx = XTransform(xLeft);
    if (!isFinite(leftPx)) 
        return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g style={{ pointerEvents: 'none' }}>
                {bars}
            </g>
        </Portal>
    );
};

export default StackedBar;