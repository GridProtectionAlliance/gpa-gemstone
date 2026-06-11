//******************************************************************************************************
//  Pill.tsx - Gbtc
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
import { CreateGuid, GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
import { useXViewportContext, IXDataSeries } from '../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../ViewportContext/YViewportContext';
import { GetPortalID, PortalIds, useLayoutContext } from '../LayoutContext';
import { useDataSeriesContext } from '../Legend/DataSeriesContext';

export interface IPillProps {
    /**
     * X range of the pill as [x1, x2] in data units.
     * - x1: The x-coordinate of the left edge.
     * - x2: The x-coordinate of the right edge.
     */
    XData: [number, number];
    /**
     * Y range of the pill as [y1, y2] in data units.
     * - y1: The y-coordinate of the bottom edge.
     * - y2: The y-coordinate of the top edge.
     */
    YData: [number, number];
    /** Maximum corner radius of the pill in pixels. Clamped to half the smaller dimension. */
    Radius: number;
    /** Fill color. Falls back to DataSeriesContext.Color, then 'currentColor'. */
    Color?: string;
    /** Color of text inside the pill. Falls back to DataSeriesContext.Color, then 'currentColor'. */
    TextColor?: string;
    /** Border stroke color. Falls back to DataSeriesContext.Color, then 'currentColor'. */
    BorderColor?: string;
    /** Border stroke width in pixels. */
    BorderThickness?: number;
    /** Optional text to display inside the pill. Auto-sizes to fit. */
    Text?: string;
    /** Where to place text in the pill. Default: 'center'. */
    TextPlacement?: 'center' | 'left' | 'right';
    /** Fill opacity (0-1). Falls back to DataSeriesContext.Opacity, then 1. */
    Opacity?: number;
    /** Click handler. Only called when the user clicks within the pill bounds. */
    OnClick?: (x: number, y: number) => void;
}

/**
 * Rectangular data component with rounded corners (pill shape) defined by
 * X and Y data ranges. For legend support, wrap in a DataSeriesGroup:
 *
 * ```tsx
 * <DataSeriesGroup Label="Events" Color="red">
 *     <Pill XData={[1, 3]} YData={[5, 10]} Radius={6} />
 * </DataSeriesGroup>
 * ```
 */
const Pill = (props: IPillProps) => {
    const { XData, YData, Radius, Text, TextColor, BorderColor, BorderThickness, TextPlacement = 'center', OnClick } = props;

    const regId = React.useRef(CreateGuid());

    const series = useDataSeriesContext();

    // Style resolution: prop > context > default
    const color = props.Color ?? series?.Color ?? 'currentColor';
    const opacity = props.Opacity ?? series?.Opacity ?? 1;
    const enabled = series?.Enabled ?? true;

    const { PlotID } = useLayoutContext();
    const { XTransform, RegisterData: xRegisterData, UnregisterData: xUnregisterData } = useXViewportContext();
    const { YTransform, RegisterData: yRegisterData, UnregisterData: yUnregisterData } = useYViewportContext();

    // Pixel dimensions of the pill
    const pxLeft = XTransform(XData[0]);
    const pxRight = XTransform(XData[1]);
    const pxTop = YTransform(YData[1]);
    const pxBottom = YTransform(YData[0]);

    const pxWidth = Math.abs(pxRight - pxLeft);
    const pxHeight = Math.abs(pxBottom - pxTop);

    // Clamp radius to half the smaller dimension
    const radius = Math.min(pxHeight / 2, pxWidth / 2, Radius);

    // Auto-size text to fit inside the pill
    const textSize = React.useMemo(() => {
        if (Text == null) return 1;

        let minSize = 0.05;
        let maxSize = 5;
        let bestSize = minSize;

        while (maxSize - minSize > 0.01) {
            const midSize = (maxSize + minSize) / 2;
            const dX = GetTextWidth('Segoe UI', midSize + 'em', Text);
            const dY = GetTextHeight('Segoe UI', midSize + 'em', Text);

            if (dX <= pxWidth && dY <= pxHeight) {
                bestSize = midSize;
                minSize = midSize;
            } else {
                maxSize = midSize;
            }
        }

        return bestSize;
    }, [Text, pxWidth, pxHeight]);

    // X data series for axis registration — contributes X range
    const xDataSeries = React.useMemo<IXDataSeries>(() => ({
        GetMin: () => Math.min(XData[0], XData[1]),
        GetMax: () => Math.max(XData[0], XData[1]),
        Enabled: enabled
    }), [XData, enabled]);

    // Y data series
    const yDataSeries = React.useMemo<IYDataSeries>(() => ({
        GetMin: (xDomain: [number, number]) => {
            const xMin = Math.min(XData[0], XData[1]);
            const xMax = Math.max(XData[0], XData[1]);
            if (xDomain[1] >= xMin && xDomain[0] <= xMax)
                return Math.min(YData[0], YData[1]);
            return undefined;
        },
        GetMax: (xDomain: [number, number]) => {
            const xMin = Math.min(XData[0], XData[1]);
            const xMax = Math.max(XData[0], XData[1]);
            if (xDomain[1] >= xMin && xDomain[0] <= xMax)
                return Math.max(YData[0], YData[1]);
            return undefined;
        },
        Enabled: enabled
    }), [XData, YData, enabled]);

    // Register with axes for auto-scaling
    React.useEffect(() => {
        const regID = regId.current;
        const xRegisterDataFunc = xRegisterData.current;
        const yRegisterDataFunc = yRegisterData.current;
        const xUnregisterDataFunc = xUnregisterData.current;
        const yUnregisterDataFunc = yUnregisterData.current;

        xRegisterDataFunc(regID, xDataSeries);
        yRegisterDataFunc(regID, yDataSeries);

        return () => {
            xUnregisterDataFunc(regID);
            yUnregisterDataFunc(regID);
        };
    }, [xDataSeries, yDataSeries, xRegisterData, yRegisterData, xUnregisterData, yUnregisterData]);

    // Click handler
    const onClick = React.useCallback((e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        if (OnClick == null)
            return;

        const [x1, x2] = XData;
        const [y1, y2] = YData;

        const isWithinHorizontalBounds = e.clientX >= x1 && e.clientX <= x2;
        const isWithinVerticalBounds = e.clientY >= y1 && e.clientY <= y2;

        if (isWithinHorizontalBounds && isWithinVerticalBounds)
            OnClick(e.clientX, e.clientY);
    }, [OnClick, XData, YData]);

    // Compute text X position based on placement
    const textXPosition = React.useMemo(() => {
        const left = Math.min(pxLeft, pxRight);
        const right = Math.max(pxLeft, pxRight);
        const center = (left + right) / 2;

        if (TextPlacement === 'left') return left;
        if (TextPlacement === 'right') return right;
        return center;
    }, [pxLeft, pxRight, TextPlacement]);

    const textAnchor = React.useMemo(() => {
        if (TextPlacement === 'left') return 'start';
        if (TextPlacement === 'right') return 'end';
        return 'middle';
    }, [TextPlacement]);

    if (!enabled) return null;

    const rectX = Math.min(pxLeft, pxRight);
    const rectY = Math.min(pxTop, pxBottom);

    if (!isFinite(rectX) || !isFinite(rectY)) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g>
                <rect
                    x={rectX}
                    y={rectY}
                    width={pxWidth}
                    height={pxHeight}
                    rx={radius}
                    ry={radius}
                    fill={color}
                    opacity={opacity}
                    stroke={BorderColor}
                    strokeWidth={BorderThickness}
                    style={OnClick != null ? { cursor: 'pointer', pointerEvents: 'all' } : { pointerEvents: 'none' }}
                    onClick={onClick}
                />
                {Text != null ? (
                    <text
                        fill={TextColor ?? 'currentColor'}
                        style={{
                            fontSize: textSize + 'em',
                            textAnchor: textAnchor,
                            dominantBaseline: 'middle',
                            pointerEvents: 'none'
                        }}
                        x={textXPosition}
                        y={rectY + pxHeight / 2}
                    >
                        {Text}
                    </text>
                ) : null}
            </g>
        </Portal>
    );
};

export default Pill;