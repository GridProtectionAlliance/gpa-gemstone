// ******************************************************************************************************
//  XValueAxis.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  10/22/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { GraphContext } from './GraphContext';
import { GetTextHeight } from '@gpa-gemstone/helper-functions';

/** Defines scale, placement, and labels for a numeric X-axis. */
export interface IProps {
    /** Left plot offset in pixels. */
    offsetLeft: number;
    /** Right plot offset in pixels. */
    offsetRight: number;
    /** Bottom plot offset in pixels. */
    offsetBottom: number;
    /** Top plot offset in pixels. */
    offsetTop: number;
    /** Reserved height for the axis in pixels. */
    heightAxis: number;
    /** Available plot height in pixels. */
    height: number;
    /** Available plot width in pixels. */
    width: number;
    /**
     * Callback that reports the height required by the axis.
     * @param h - Required axis height in pixels.
     */
    setHeight: (h: number) => void;
    /** Optional title displayed below the axis. */
    label?: string;
    /** Optional flag that displays grid lines at tick positions, defaulting to false. */
    showGrid?: boolean;
    /** Optional flag that displays the rightmost tick label, defaulting to true. */
    showRightMostTick?: boolean;
    /** Optional flag that displays the leftmost tick label, defaulting to true. */
    showLeftMostTick?: boolean;
}

/**
 * Renders a numeric X-axis and reports its required layout height.
 * @param props - Axis dimensions, offsets, label, and grid visibility options.
 * @returns SVG group containing numeric ticks, labels, and grid lines.
 */
function XValueAxis(props: IProps) {
    const context = React.useContext(GraphContext);
    const [tick, setTick] = React.useState<number[]>([]);
    const [hLabel, setHlabel] = React.useState<number>(0);
    const [hAxis, setHAxis] = React.useState<number>(0);
    const [title, setTitle] = React.useState<string | undefined>(props.label);
    const [decimalPlaces, setDecimalPlaces] = React.useState<number>(0);

    // Adjust space for X Axis labels
    React.useEffect(() => {
        setHlabel(title != null ? GetTextHeight('Segoe UI', '1em', title) : 0);
    }, [title]);

    // Adjust axis title
    React.useEffect(() => {
        setTitle(props.label ?? '')
    }, [props.label]);

    //Calculate ticks
    React.useEffect(() => {
        const deltaX = context.XDomain[1] - context.XDomain[0];
        if (deltaX === 0) return;

        const { tickInterval, decimalPlaces } = calculateTickInterval(context.XDomain[0], context.XDomain[1]);

        const startTick = Math.ceil(context.XDomain[0] / tickInterval) * tickInterval;
        const endTick = context.XDomain[1];
        const newTicks = [];

        for (let t = startTick; t <= endTick; t += tickInterval) {
            newTicks.push(t);
        }

        setTick(newTicks);
        setDecimalPlaces(decimalPlaces);

    }, [context.XDomain]);

    //Adjust spacing for tick labels
    React.useEffect(() => {
        const maxLabelHeight = Math.max(...tick.map((t) => GetTextHeight('Segoe UI', '1em', formatNumber(t, decimalPlaces))));
        const dX = (isFinite(maxLabelHeight) ? maxLabelHeight : 0) + 12;
        setHAxis(dX);

    }, [tick, decimalPlaces]);

    //Adjust axis height
    React.useEffect(() => {
        if (hAxis + hLabel !== props.heightAxis)
            props.setHeight(hAxis + hLabel);

    }, [hAxis, hLabel, props.heightAxis]);


    return (
        <g>
            <path stroke="currentColor" style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft - (props.showLeftMostTick ?? true ? 0 : 8)} ${props.height - props.offsetBottom} H ${props.width - props.offsetRight + (props.showRightMostTick ?? true ? 0 : 8)}`} />

            {props.showLeftMostTick ?? true ? (
                <path stroke="currentColor" style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft} ${props.height - props.offsetBottom} v 8`} />
            ) : null}

            {props.showRightMostTick ?? true ? (
                <path stroke="currentColor" style={{ strokeWidth: 1 }} d={`M ${props.width - props.offsetRight} ${props.height - props.offsetBottom} v 8`} />
            ) : null}
            {(
                <>
                    {tick.map((l, i) => (
                        <path key={i} stroke="currentColor" style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom + 6} v -6`} />
                    ))}
                    {tick.map((l, i) => (
                        <text fill="currentColor" key={i} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'hanging', transition: 'x 0.5s, y 0.5s', }} y={props.height - props.offsetBottom + 8} x={context.XTransformation(l)} >
                            {formatNumber(l, decimalPlaces)}
                        </text>
                    ))}
                    {(props.showGrid ?? false) ? tick.map((l, i) => 
                        <path 
                            key={(l.toFixed(50))} 
                            stroke='lightgrey' 
                            strokeOpacity={'0.8'} 
                            style={{ strokeWidth: 1, transition: 'd 0.5s' }} 
                            d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom} V ${props.offsetTop}`} 
                        />
                    ): <></>}
                </>
            )}
            {title != null ? (
                <text fill="currentColor" style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.offsetLeft + (props.width - props.offsetLeft - props.offsetRight) / 2} y={props.height - props.offsetBottom + hAxis}>
                    {title}
                </text>
            ) : null}
        </g>
    );
}


//helper functions
const formatNumber = (value: number, decimalPlaces: number) => {
    return value.toFixed(decimalPlaces);
}

const calculateTickInterval = (min: number, max: number) => {
    const range = max - min;
    const desiredTicks = 7
    const rawTickInterval = range / desiredTicks;

    const exponent = Math.floor(Math.log10(rawTickInterval));
    const fraction = rawTickInterval / Math.pow(10, exponent);

    let niceFraction;
    if (fraction <= 1)
        niceFraction = 1;
    else if (fraction <= 2)
        niceFraction = 2;
    else if (fraction <= 5)
        niceFraction = 5;
    else
        niceFraction = 10;

    const tickInterval = niceFraction * Math.pow(10, exponent);
    const decimalPlaces = Math.max(0, -Math.floor(Math.log10(tickInterval)));

    return { tickInterval, decimalPlaces };
};

export default React.memo(XValueAxis);
