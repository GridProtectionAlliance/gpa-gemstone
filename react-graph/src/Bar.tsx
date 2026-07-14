// ******************************************************************************************************
//  Bar.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  11/04/2025 - Gabriel Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { GraphContext, AxisIdentifier, AxisMap, IDataSeries } from './GraphContext';
import useLegend from './Hooks/useLegend';

/** Defines the position, value, and presentation of a graph bar. */
export interface IBarProps {
    /**
     * Y-axis values used as boundaries for the stacked bar segments.
    */
    Data: number[],
    /**
     * X-axis coordinate used to position the bar.
     */
    BarOrigin: number,
    /**
     * Optional edge or center aligned to the bar origin, defaulting to left.
    */
    XBarOrigin?: 'left' | 'right' | 'center',
    /**
     * Bar width in X-axis units.
    */
    BarWidth: number,
    /**
     * Optional Y-axis associated with the bar.
    */
    Axis?: AxisIdentifier,
    /**
     * Optional label displayed for the bar in the legend.
    */
    Legend?: string,
    /**
     * Color of the bar.
    */
    Color: string,
    /**
<<<<<<< HEAD
     * Optional controlled enabled state. Provide with SetEnabled to allow legend clicks to update it.
     * Without SetEnabled, this value is read-only and legend clicks do not change bar visibility.
    */
    Enabled?: boolean,
    /**
     * Optional controlled enabled-state setter. Provide with Enabled to control bar visibility.
    */
    SetEnabled?: React.Dispatch<React.SetStateAction<boolean>>,
    /**
     * Function retrieves an override of the portion of the bar. 
     * @param {[number, number]} yValues - The bottom and top of this portion of the bar.
     * @param {number} index - Index of this portion with regard to all bar segments. Counting begins from the lowest portion in ascending order.
=======
     * Optional callback that customizes an individual bar segment.
     * @param yValues - Bottom and top values of the segment.
     * @param index - Position of the segment from lowest to highest.
     * @returns Style overrides for the segment.
>>>>>>> 5d8b83a (First documentation pass)
    */
    GetBarStyle?: (yValues: [number, number], index: number) => IBarStyle
}

/** Identifies a supported bar fill treatment. */
type FillStyles = 'Hatched' | 'Solid' | undefined;

/** Defines visual styling returned for an individual bar. */
export interface IBarStyle {
    /**
     * Optional opacity applied to a bar segment, defaulting to 0.5.
    */
    Opacity?: number,
    /**
     * Optional fill color applied to a bar segment.
    */
    Color?: string,
    /**
     * Optional stroke color applied around a bar segment, defaulting to black.
    */
    StrokeColor?: string,
    /**
     * Optional stroke width applied around a bar segment.
    */
    StrokeWidth?: number,
    /**
     * Optional fill pattern applied to a bar segment, defaulting to solid.
    */
    Fill?: FillStyles,
}

const defaultStyle: IBarStyle = {
    Opacity: 0.5,
    StrokeColor: "black"
}

/**
 * Renders a stacked bar and registers its values with the graph context.
 * @param props - Bar geometry, data, legend, and styling options.
 * @returns SVG group containing the rendered bar segments.
 */
export const StackedBar = (props: IBarProps) => {
    const [guid, setGuid] = React.useState<string>("");
    const context = React.useContext(GraphContext);
    const { enabled, createLegend } = useLegend(props.Color, 'square', guid, props.Data.length === 0, props.Legend, props.Enabled, props.SetEnabled);

    const createContextData: () => IDataSeries = React.useCallback(() => 
        ({
            legend: createLegend(),
            axis: props.Axis,
            enabled: enabled,
            getMax: (t: [number, number]) =>
                !enabled || props.Data.length <= 1 || props.BarOrigin < t[0] || props.BarOrigin > t[1] ?
                    undefined : 
                    Math.max(...props.Data),
            getMin: (t: [number, number]) => 
                !enabled || props.Data.length <= 1 || props.BarOrigin < t[0] || props.BarOrigin > t[1] ?
                    undefined : 
                    Math.min(...props.Data),
        } as IDataSeries)
    , [props.Axis, props.BarOrigin, props.Data, createLegend, enabled]);

    React.useEffect(() => {
        if (guid === "") return;
        context.UpdateData(guid, createContextData());
    }, [createContextData, guid]);

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

    const bars = React.useMemo(() => {
        // not enough data to display
        if (guid === "" || !enabled || props.Data.length === 0) return <></>;

        let xValue: number;
        switch (props.XBarOrigin) {
            default:
            case 'left':
                xValue = props.BarOrigin;
                break;
            case 'right':
                xValue = props.BarOrigin-props.BarWidth;
                break;
            case 'center':
                xValue = props.BarOrigin-props.BarWidth / 2;
                break;
        }
        const rightEdge = context.XTransformation(xValue+props.BarWidth);
        const leftEdge = context.XTransformation(xValue);
        const axis = AxisMap.get(props.Axis);
        const yValues = [...props.Data];
        // Insert bottom of bar if only 1 value exists
        if (yValues.length === 1)
            yValues.push(context.YDomain[axis][0]);
        
        // Sort Values in ascending order
        yValues.sort((a,b) => a-b);

        const newBars :JSX.Element[] = [];
        for(let yIndex = 0; yIndex < yValues.length-1; yIndex++){
            // This looks backwards but isn't, asc in values === desc in pixels
            const yUpper = context.YTransformation(yValues[yIndex], axis);
            const yLower = context.YTransformation(yValues[yIndex+1], axis);
            const style = props.GetBarStyle == null ? 
                {...defaultStyle, Color: props.Color} : 
                {...defaultStyle, Color: props.Color, ...props.GetBarStyle([yValues[yIndex], yValues[yIndex+1]], yIndex)};

            let fillProp;
            switch(style.Fill){
                default:
                case "Solid":
                    fillProp = style.Color;
                    break;
                case "Hatched":
                    fillProp = `url(#${guid}_${yIndex})`;
                    newBars.push(
                        <pattern id={`${guid}_${yIndex}`} width="24" height="24" patternUnits="userSpaceOnUse" key={`hatch_${yIndex}`}>
                            <path 
                                d="M -3 3 L 6 -6 M 0 24 L 24 0 M 21 27 L 30 18" 
                                strokeWidth={6}
                                stroke={style.Color}
                            />
                        </pattern>
                    );
                    break;
            }

            newBars.push(
                <rect
                    key={yIndex}
                    x={leftEdge}
                    y={yLower}
                    width={rightEdge-leftEdge}
                    height={yUpper-yLower}
                    fill={fillProp}
                    opacity={style.Opacity}
                    stroke={style.StrokeColor}
                    strokeWidth={style.StrokeWidth}
                />
            );
        }
        return newBars;
    }, [enabled, guid, props.Axis, props.BarOrigin, props.BarWidth, props.Color, props.Data, props.GetBarStyle, props.XBarOrigin, context]);

    return <g>{bars}</g>
}

export default StackedBar;
