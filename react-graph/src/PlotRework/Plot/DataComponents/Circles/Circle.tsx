//******************************************************************************************************
//  Circle.tsx - Gbtc
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
import { Portal } from 'react-portal';
import { CreateGuid, GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
import { useXViewportContext, IXDataSeries } from '../../ViewportContext/XViewportContext';
import { useYViewportContext, IYDataSeries } from '../../ViewportContext/YViewportContext';
import { GetPortalID, PortalIds, useLayoutContext } from '../../LayoutContext';
import { useDataSeriesContext } from '../../Legend/DataSeriesContext';

export interface ICircleProps {
    /** Data point as [x, y] tuple */
    Data: [number, number];
    /** Circle radius in pixels */
    Radius: number;
    /** Fill color. Falls back to DataSeriesContext.Color, then 'currentColor'. */
    Color?: string;
    /** Fill opacity (0-1). Falls back to DataSeriesContext.Opacity, then 1. */
    Opacity?: number;
    /** Border stroke color. */
    BorderColor?: string;
    /** Border stroke width in pixels. */
    BorderThickness?: number;
    /** Text to render centered inside the circle. Auto-sizes to fit. */
    Text?: string;
    /** Click handler. Called when the user clicks within the circle bounds. */
    OnClick?: () => void;
}

/**
 * Single-point data component. For legend support, wrap one or more Circles
 * in a DataSeriesGroup:
 * 
 * ```tsx
 * <DataSeriesGroup Label="Events" Color="red">
 *     <Circle Data={[1, 5]} Radius={4} />
 *     <Circle Data={[3, 8]} Radius={4} />
 * </DataSeriesGroup>
 * ```
 */
const Circle = (props: ICircleProps) => {
    const { Data, Radius, Text, BorderColor, BorderThickness, OnClick } = props;

    const regId = React.useRef(CreateGuid());

    const series = useDataSeriesContext();

    // Style resolution: prop > context > default
    const color = props.Color ?? series?.Color ?? 'currentColor';
    const opacity = props.Opacity ?? series?.Opacity ?? 1;
    const enabled = series?.Enabled ?? true;

    const { PlotID } = useLayoutContext();
    const { XTransform, RegisterData: xRegisterData, UnregisterData: xUnregisterData } = useXViewportContext();
    const { YTransform, RegisterData: yRegisterData, UnregisterData: yUnregisterData } = useYViewportContext();

    // Auto-size text to fit inside circle
    const textSize = React.useMemo(() => {
        if (Text == null) return 1;

        let size = 5;
        let dX = GetTextWidth('Segoe UI', size + 'em', Text);
        let dY = GetTextHeight('Segoe UI', size + 'em', Text);

        while ((dX > 2 * Radius || dY > 2 * Radius) && size > 0.05) {
            size -= 0.01;
            dX = GetTextWidth('Segoe UI', size + 'em', Text);
            dY = GetTextHeight('Segoe UI', size + 'em', Text);
        }

        return size;
    }, [Text, Radius]);

    // X data series for axis registration — single point
    const xDataSeries = React.useMemo<IXDataSeries>(() => ({
        GetMin: () => Data[0],
        GetMax: () => Data[0],
        Enabled: enabled
    }), [Data, enabled]);

    // Y data series — only contributes if the point is within the X domain
    const yDataSeries = React.useMemo<IYDataSeries>(() => ({
        GetMin: (xDomain: [number, number]) => {
            if (Data[0] >= xDomain[0] && Data[0] <= xDomain[1])
                return Data[1];
            return undefined;
        },
        GetMax: (xDomain: [number, number]) => {
            if (Data[0] >= xDomain[0] && Data[0] <= xDomain[1])
                return Data[1];
            return undefined;
        },
        Enabled: enabled
    }), [Data, enabled]);

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

    if (!enabled) return null;

    const cx = XTransform(Data[0]);
    const cy = YTransform(Data[1]);

    if (!isFinite(cx) || !isFinite(cy)) return null;

    return (
        <Portal node={document.getElementById(GetPortalID(PlotID, PortalIds.DATA))}>
            <g>
                <circle
                    r={Radius}
                    cx={cx}
                    cy={cy}
                    fill={color}
                    opacity={opacity}
                    stroke={BorderColor}
                    strokeWidth={BorderThickness}
                    style={OnClick != null ? { cursor: 'pointer', pointerEvents: 'all' } : { pointerEvents: 'none' }}
                    onClick={OnClick}
                />
                {Text != null ? (
                    <text
                        fill="currentColor"
                        style={{
                            fontSize: textSize + 'em',
                            textAnchor: 'middle',
                            dominantBaseline: 'middle',
                            pointerEvents: 'none'
                        }}
                        x={cx}
                        y={cy}
                    >
                        {Text}
                    </text>
                ) : null}
            </g>
        </Portal>
    );
};

export default Circle;