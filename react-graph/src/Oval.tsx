// ******************************************************************************************************
//  Oval.tsx - Gbtc
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
     * Data for the oval and circles:
     * [x1, x2, y]
     * - x1: The x-coordinate of the left edge of the oval.
     * - x2: The x-coordinate of the right edge of the oval.
     * - y: The y-coordinate of the center of the oval.
     */
    Data: [number, number, number],

    /**
     * Fill color of the oval.
     * @type {string}
     */
    Color: string,
    /**
     * Color of text in oval.
     * @type {string}
     */
    TextColor?: string,
    /**
     * The vertical radius of the oval.
     * @type {number}
     */
    Radius: number,
    /**
     * Stroke color of the oval and circles.
     * @optional
     * @type {string}
     */
    BorderColor?: string,

    /**
     * Stroke thickness of the oval and circles.
     * @optional
     * @type {number}
     */
    BorderThickness?: number,

    /**
     * Optional text to display inside the oval.
     * @optional
     * @type {string}
     */
    Text?: string,

    /**
     * Where to place text in the oval
     */
    TextPlacement?: 'center' | 'left' | 'right'

    /**
     * Opacity of the oval and circles.
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
     * Callback function to handle click events on the oval. Provides action functions to update domains.
     * @optional
     * @type {(actions: IActionFunctions) => void}
     */
    OnClick?: (x: number, y: number, actions: IActionFunctions) => void
}

const Oval = (props: IProps) => {
    const context = React.useContext(GraphContext);

    const [guid, setGuid] = React.useState<string>("");
    const [textSize, setTextSize] = React.useState<number>(1);

    const { radius, pxHeight } = React.useMemo(() => {
        const x0px = context.XTransformation(props.Data[0]);
        const x1px = context.XTransformation(props.Data[1]);

        const widthPx = Math.abs(x1px - x0px);

        const heightFromProvidedRad = 2 * props.Radius;
        const heightPx = Math.min(heightFromProvidedRad, widthPx / 2);
        const r = heightPx / 2;

        return { radius: r, pxHeight: heightPx };
    }, [context.XTransformation, props.Data?.[0], props.Data?.[1], props.Radius]);

    // Update data series information in the graph context based on circle properties
    React.useEffect(() => {
        if (guid === "")
            return;

        context.UpdateData(guid, {
            axis: props.Axis,
            legend: undefined,
            getMax: (t) => (t[0] < props.Data[0] && t[1] > props.Data[1] ? props.Data[2] : undefined),
            getMin: (t) => (t[0] < props.Data[0] && t[1] > props.Data[1] ? props.Data[2] : undefined),
        } as IDataSeries);
    }, [props.Axis, props.Data])

    // Add a new data series on component mount / removing on unmount
    React.useEffect(() => {
        const id = context.AddData({
            axis: props.Axis,
            legend: undefined,
            getMax: (t) => (t[0] < props.Data[0] && t[1] > props.Data[1] ? props.Data[2] : undefined),
            getMin: (t) => (t[0] < props.Data[0] && t[1] > props.Data[1] ? props.Data[2] : undefined),
        } as IDataSeries);

        setGuid(id);

        return () => {
            context.RemoveData(id)
        }
    }, []);

    // Adjust text size within the oval to ensure it fits
    React.useEffect(() => {
        if (props.Text === undefined) return;

        const fontFamily = "Segoe UI";
        const fontSizeUnit = "em";

        const ovalWidth = Math.abs(context.XTransformation(props.Data[1]) - context.XTransformation(props.Data[0]));;

        let minSize = 0.05;
        let maxSize = 5;
        let bestSize = maxSize;

        const calculateTextSize = (size: number) => {
            const dX = GetTextWidth(fontFamily, size + fontSizeUnit, props.Text as string);
            const dY = GetTextHeight(fontFamily, size + fontSizeUnit, props.Text as string);
            return { dX, dY };
        }

        while (maxSize - minSize > 0.01) {
            const midSize = (maxSize + minSize) / 2;
            const { dX, dY } = calculateTextSize(midSize);

            if (dX <= ovalWidth && dY <= pxHeight) {
                bestSize = midSize;
                minSize = midSize; // Try larger
            } else
                maxSize = midSize; // Try smaller
        }

        setTextSize(bestSize);
    }, [props.Text, pxHeight, context.XTransformation, props.Data]);

    // Set up a click handler if provided in props
    React.useEffect(() => {
        if (guid === "" || props.OnClick === undefined)
            return;

        context.UpdateSelect(guid, { onClick } as IHandlers)
    }, [props.OnClick, context.UpdateFlag])

    // Handle click events on the oval
    const onClick = React.useCallback((xClick: number, yClick: number) => {
        if (props.OnClick === undefined)
            return;

        // Calculate positions and determine if the click was within the oval bounds
        const axis = AxisMap.get(props.Axis);
        const xClickTransformed = context.XTransformation(xClick);
        const yClickTransformed = context.YTransformation(yClick, axis);

        const x1Transformed = context.XTransformation(props.Data[0]);
        const x2Transformed = context.XTransformation(props.Data[1]);
        const yTransformed = context.YTransformation(props.Data[2], axis);

        const isWithinHorizontalBounds = xClickTransformed >= x1Transformed && xClickTransformed <= x2Transformed;
        const isWithinVerticalBounds = yClickTransformed >= yTransformed - radius && yClickTransformed <= yTransformed + radius;

        if (isWithinHorizontalBounds && isWithinVerticalBounds)
            props.OnClick(xClick, yClick, { setYDomain: context.SetYDomain as React.SetStateAction<[number, number][]>, setTDomain: context.SetXDomain as React.SetStateAction<[number, number]> });
    }, [props.OnClick, props.Axis, props.Data, radius, context.XTransformation, context.YTransformation, context.SetXDomain, context.SetYDomain])

    const textXPosition = React.useMemo(() => {
        const xLeft = context.XTransformation(props.Data[0]);
        const xRight = context.XTransformation(props.Data[1]);
        const xCenter = (xLeft + xRight) / 2
        if (props.TextPlacement == null || props.TextPlacement === 'center')
            return xCenter

        if (props.TextPlacement === 'left')
            return xLeft

        if (props.TextPlacement === 'right')
            return xRight

        return xCenter
    }, [context.XTransformation, props.Data[0], props.Data[1], props.TextPlacement])

    // Render null if coordinates are not valid, otherwise render the oval / text
    if (!isFinite(context.XTransformation((props.Data[0], props.Data[1]) / 2)) || !isFinite(context.YTransformation(props.Data[2], AxisMap.get(props.Axis))))
        return null;

    return (
        <g>
            <rect
                x={context.XTransformation(props.Data[0])}
                y={context.YTransformation(props.Data[2], AxisMap.get(props.Axis)) - radius}
                width={Math.abs(context.XTransformation(props.Data[1]) - context.XTransformation(props.Data[0]))}
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
                <text
                    fill={props.TextColor ?? 'currentColor'}
                    style={{ fontSize: textSize + 'em', textAnchor: 'middle', dominantBaseline: 'middle' }}
                    y={context.YTransformation(props.Data[2], AxisMap.get(props.Axis))}
                    x={textXPosition}>
                    {props.Text}
                </text> : null}
        </g>
    );
}

export default Oval;
