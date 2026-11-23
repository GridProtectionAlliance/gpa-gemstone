// ******************************************************************************************************
//  HorizontalBar.tsx - Gbtc
//
//  Copyright © 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  11/16/2026 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { GraphContext, AxisIdentifier, AxisMap, IDataSeries } from './GraphContext';
import useLegend from './Hooks/useLegend';
import { IBarStyle, defaultStyle, HatchPattern } from './Bar';

export interface IHorizontalBarProps {
    /**
     * Value on the X-Axis where the bar ends. May be less than BarStart, e.g., a negative value.
    */
    Value: number,
    /**
     * Value on the X-Axis where the bar starts, defaults to 0.
    */
    BarStart?: number,
    /**
     * Origin of the bar on the Y-Axis.
     * With a yDomain of 'HalfAutoValue', a bar that crosses 0 is cut off at 0, so keep each bar on one side of 0.
    */
    BarOrigin: number,
    /**
     * Reference point of BarOrigin, if it represents the top, center, or bottom of the bar. Defaults to center.
    */
    YBarOrigin?: 'top' | 'bottom' | 'center',
    /**
     * Height of the bar in Y-Axis units.
    */
    BarHeight: number,
    /**
     * Identifier for the Y-Axis the bar is associated with.
     * @type {AxisIdentifier}
    */
    Axis?: AxisIdentifier,
    /**
     * Legend text for the bar.
    */
    Legend?: string,
    /**
     * Color of the bar.
    */
    Color: string,
    /**
     * Style override of the bar, defaults to the same style as Bar.
    */
    BarStyle?: IBarStyle,
    /**
     * Optional controlled enabled state. Provide with SetEnabled to allow legend clicks to update it.
     * Without SetEnabled, this value is read-only and legend clicks do not change bar visibility.
    */
    Enabled?: boolean,
    /**
     * Optional controlled enabled-state setter. Provide with Enabled to control bar visibility.
    */
    SetEnabled?: React.Dispatch<React.SetStateAction<boolean>>
}

/** Draws a bar along the X-Axis from BarStart to Value, placed at BarOrigin on the Y-Axis. */
export const HorizontalBar = (props: IHorizontalBarProps) => {
    const [guid, setGuid] = React.useState<string>("");
    const context = React.useContext(GraphContext);
    const { enabled, createLegend } = useLegend(props.Color, 'square', guid, false, props.Legend, props.Enabled, props.SetEnabled);

    const barStart = props.BarStart ?? 0;
    const left = Math.min(barStart, props.Value);
    const right = Math.max(barStart, props.Value);

    let bottom: number;
    switch (props.YBarOrigin) {
        default:
        case 'center':
            bottom = props.BarOrigin - props.BarHeight / 2;
            break;
        case 'bottom':
            bottom = props.BarOrigin;
            break;
        case 'top':
            bottom = props.BarOrigin - props.BarHeight;
            break;
    }
    const top = bottom + props.BarHeight;

    // The bar adds its band to the Y range whenever any part of it is within the X range
    const createContextData: () => IDataSeries = React.useCallback(() =>
        ({
            legend: createLegend(),
            axis: props.Axis,
            enabled: enabled,
            getMax: (t: [number, number]) =>
                !enabled || right < t[0] || left > t[1] ? undefined : top,
            getMin: (t: [number, number]) =>
                !enabled || right < t[0] || left > t[1] ? undefined : bottom,
            getPoints: () => undefined
        })
    , [props.Axis, top, bottom, left, right, createLegend, enabled]);

    React.useEffect(() => {
        if (guid === "") return;
        context.UpdateData(guid, createContextData());
    }, [createContextData, guid]);

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

    if (guid === "" || !enabled) return <g />;

    const axis = AxisMap.get(props.Axis);
    const leftEdge = context.XTransformation(left);
    const rightEdge = context.XTransformation(right);
    // Larger values are higher on the page, so the top edge comes from the upper value
    const topEdge = context.YTransformation(top, axis);
    const bottomEdge = context.YTransformation(bottom, axis);
    const style = { ...defaultStyle, Color: props.Color, ...props.BarStyle };
    const patternId = `${guid}_hatch`;

    return (
        <g>
            {style.Fill === 'Hatched' ? <HatchPattern id={patternId} color={style.Color} /> : null}
            <rect
                x={leftEdge}
                y={topEdge}
                width={rightEdge - leftEdge}
                height={bottomEdge - topEdge}
                fill={style.Fill === 'Hatched' ? `url(#${patternId})` : style.Color}
                opacity={style.Opacity}
                stroke={style.StrokeColor}
                strokeWidth={style.StrokeWidth}
            />
        </g>
    );
}

export default HorizontalBar;
