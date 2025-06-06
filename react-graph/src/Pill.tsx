// ******************************************************************************************************
//  Pill.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  09/03/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************


import { GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
import * as React from 'react';
import { IDataSeries, GraphContext, IHandlers, IActionFunctions, AxisIdentifier, AxisMap } from './GraphContext';

export interface IProps {
    /**
     * Data for the pill and circles:
     * [x1, x2]
     * - x1: The x-coordinate of the left edge of the pill.
     * - x2: The x-coordinate of the right edge of the pill.
     */
    XData: [number, number],
    /**
     * Data for the pill and circles:
     * [y1, y2]
     * - y1: The y-coordinate of the bottom edge of the pill.
     * - y2: The y-coordinate of the top edge of the pill.
     */
    YData: [number, number],
    /**
     * Radius of the pill in pixels.
     */
    RadiusPX: number,
    /**
     * Fill color of the pill.
     * @type {string}
     */
    Color: string,
    /**
     * Color of text in pill.
     * @type {string}
     */
    TextColor?: string,

    /**
     * Stroke color of the pill and circles.
     * @optional
     * @type {string}
     */
    BorderColor?: string,

    /**
     * Stroke thickness of the pill and circles.
     * @optional
     * @type {number}
     */
    BorderThickness?: number,

    /**
     * Optional text to display inside the pill.
     * @optional
     * @type {string}
     */
    Text?: string,

    /**
     * Where to place text in the pill
     */
    TextPlacement?: 'center' | 'left' | 'right'

    /**
     * Opacity of the pill and circles.
     * @optional
     * @type {number}
     */
    Opacity?: number,

    /**
     * Axis identifier used for vertical positioning.
     * @optional
     * @type {AxisIdentifier}
     */
    Axis?: AxisIdentifier,

    /**
     * Callback function to handle click events on the pill. Provides action functions to update domains.
     * @optional
     * @type {(actions: IActionFunctions) => void}
     */
    OnClick?: (x: number, y: number, actions: IActionFunctions) => void
}

const Pill = (props: IProps) => {
    const context = React.useContext(GraphContext);

    const [guid, setGuid] = React.useState<string>("");
    const [textSize, setTextSize] = React.useState<number>(1);

    const pxHeight = React.useMemo(() => {
        const axis = AxisMap.get(props.Axis);
        const y0px = context.YTransformation(props.YData[0], axis);
        const y1px = context.YTransformation(props.YData[1], axis);

        return Math.abs(y1px - y0px);
    }, [context.XTransformation, props.YData, props.Axis]);

    const pxWidth = React.useMemo(() => {
        return Math.abs(context.XTransformation(props.XData[1]) - context.XTransformation(props.XData[0]))
    }, [context.XTransformation, props.XData])

    const radius = React.useMemo(() => {
        return Math.min(pxHeight / 2, pxWidth / 2, props.RadiusPX);
    }, [pxHeight, pxWidth, props.RadiusPX])

    const getMax = React.useCallback((tDomain: [number, number]) => {
        const [t0, t1] = tDomain;
        const [x1, x2] = props.XData;
        if (t1 >= x1 && t0 <= x2)
            return Math.max(props.YData[0], props.YData[1]);

        return undefined;
    }, [props.XData, props.YData])

    const getMin = React.useCallback((tDomain: [number, number]) => {
        const [t0, t1] = tDomain;
        const [x1, x2] = props.XData;
        if (t1 >= x1 && t0 <= x2)
            return Math.min(props.YData[0], props.YData[1]);

        return undefined;
    }, [props.XData, props.YData])

    // Update data series information in the graph context based on circle properties
    React.useEffect(() => {
        if (guid === "")
            return;

        context.UpdateData(guid, {
            axis: props.Axis,
            legend: undefined,
            getMax: getMax,
            getMin: getMin,
        } as IDataSeries);
    }, [props.Axis, props.XData, props.YData])

    // Add a new data series on component mount / removing on unmount
    React.useEffect(() => {
        const id = context.AddData({
            axis: props.Axis,
            legend: undefined,
            getMax: getMax,
            getMin: getMin
        } as IDataSeries);

        setGuid(id);

        return () => {
            context.RemoveData(id)
        }
    }, []);

    // Adjust text size within the pill to ensure it fits
    React.useEffect(() => {
        if (props.Text === undefined) return;

        const fontFamily = "Segoe UI";
        const fontSizeUnit = "em";


        let minSize = 0.05;
        let maxSize = 5;
        let bestSize = minSize;

        const calculateTextSize = (size: number) => {
            const dX = GetTextWidth(fontFamily, size + fontSizeUnit, props.Text as string);
            const dY = GetTextHeight(fontFamily, size + fontSizeUnit, props.Text as string);
            return { dX, dY };
        }

        while (maxSize - minSize > 0.01) {
            const midSize = (maxSize + minSize) / 2;
            const { dX, dY } = calculateTextSize(midSize);

            if (dX <= pxWidth && dY <= pxHeight) {
                bestSize = midSize;
                minSize = midSize; // Try larger
            } else
                maxSize = midSize; // Try smaller
        }

        setTextSize(bestSize);
    }, [props.Text, pxHeight, pxWidth]);

    // Set up a click handler if provided in props
    React.useEffect(() => {
        if (guid === "" || props.OnClick === undefined)
            return;

        context.UpdateSelect(guid, { onClick } as IHandlers)
    }, [props.OnClick, context.UpdateFlag])

    // Handle click events on the pill
    const onClick = React.useCallback((xClick: number, yClick: number) => {
        if (props.OnClick === undefined)
            return;

        // Calculate positions and determine if the click was within the pill bounds
        const [x1, x2] = props.XData;
        const [y1, y2] = props.YData;

        const isWithinHorizontalBounds = xClick >= x1 && xClick <= x2;
        const isWithinVerticalBounds = yClick >= y1 && yClick <= y2;

        if (isWithinHorizontalBounds && isWithinVerticalBounds)
            props.OnClick(xClick, yClick, { setYDomain: context.SetYDomain as React.SetStateAction<[number, number][]>, setTDomain: context.SetXDomain as React.SetStateAction<[number, number]> });
    }, [props.OnClick, props.Axis, props.XData, props.YData, context.XTransformation, context.YTransformation, context.SetXDomain, context.SetYDomain])

    const textXPosition = React.useMemo(() => {
        const xLeft = context.XTransformation(props.XData[0]);
        const xRight = context.XTransformation(props.XData[1]);
        const xCenter = (xLeft + xRight) / 2
        if (props.TextPlacement == null || props.TextPlacement === 'center')
            return xCenter

        if (props.TextPlacement === 'left')
            return xLeft

        if (props.TextPlacement === 'right')
            return xRight

        return xCenter
    }, [context.XTransformation, props.XData, props.TextPlacement])

    // Render null if coordinates are not valid, otherwise render the pill / text
    if (!isFinite(context.XTransformation((props.XData[0], props.XData[1]) / 2)) || !isFinite(context.YTransformation(props.YData[0], AxisMap.get(props.Axis))) || !isFinite(context.YTransformation(props.YData[1], AxisMap.get(props.Axis))))
        return null;

    return (
        <g>
            <rect
                x={context.XTransformation(props.XData[0])}
                width={pxWidth}
                y={context.YTransformation(props.YData[1], AxisMap.get(props.Axis))}
                height={pxHeight}
                rx={radius}
                ry={radius}
                fill={props.Color}
                opacity={props.Opacity}
                stroke={props.BorderColor}
                strokeWidth={props.BorderThickness}
                onClick={(e) => onClick(e.clientX, e.clientY)}
            />

            {props.Text !== undefined ?
                <g clipPath={`url(#oval-clip-${guid})`}>
                    <text
                        fill={props.TextColor ?? 'currentColor'}
                        style={{ fontSize: textSize + 'em', textAnchor: 'middle', dominantBaseline: 'middle' }}
                        y={(context.YTransformation(props.YData[0], AxisMap.get(props.Axis)) + context.YTransformation(props.YData[1], AxisMap.get(props.Axis))) / 2}
                        x={textXPosition}>
                        {props.Text}
                    </text>
                </g> : null}
        </g>
    );
}

export default Pill;