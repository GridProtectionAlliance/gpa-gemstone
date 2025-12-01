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
import DataLegend from './DataLegend';

export interface IBarProps {
    /**
     * Array of data points to be represented by bar, each point as a [x, y1, y2, ...yn] tuple.
    */
    Data: number[],
    /**
     * Origin of the Bar on the X-Axis
     */
    BarOrigin: number,
    /**
     * Width of the bar
    */
    BarWidth: number,
    /**
     * Identifier for the axis the bars are associated with.
     * @type {AxisIdentifier}
    */
    Axis?: AxisIdentifier,
    /**
     * Legend text for the bar.
    */
    Legend?: string,
    /**
     * Reference point of data, if the x data represents the left side, center, or right side of the bar.
    */
    XBarOrigin?: 'left' | 'right' | 'center',
    /**
     * Opacity of the bars.
    */
    Opacity?: number,
    /**
     * Color of the bars.
    */
    Color: string,
    /**
     * Stroke color of the bars.
    */
    StrokeColor?: string,
    /**
     * Stroke width of the bars.
    */
    StrokeWidth?: number,
}

export const StackedBar = (props: IBarProps) => {
    const [guid, setGuid] = React.useState<string|undefined>(undefined);
    const context = React.useContext(GraphContext);

    const createLegend = React.useCallback(() => {
        if (props.Legend === undefined || guid == null)
            return undefined;

        return <DataLegend
            id={guid}
            label={props.Legend}
            color={props.Color}
            legendSymbol='square'
            setEnabled={() => {/*do nothing*/}}
            enabled={true}
            hasNoData={props.Data.length === 0} />;
    }, [props.Color,props.Data, guid]);

    const createContextData: () => IDataSeries = React.useCallback(() => 
        ({
            legend: createLegend(),
            axis: props.Axis,
            enabled: true,
            getMax: (t: [number, number]) =>
                props.Data.length <= 1 || props.BarOrigin < t[0] || props.BarOrigin > t[1] ?
                    undefined : 
                    Math.max(...props.Data),
            getMin: (t: [number, number]) => 
                props.Data.length <= 1 || props.BarOrigin < t[0] || props.BarOrigin > t[1] ?
                    undefined : 
                    Math.min(...props.Data),
        } as IDataSeries)
    , [props.Axis, props.Data, createLegend]);

    React.useEffect(() => {
        if (guid == null) return;
        context.UpdateData(guid, createContextData());
    }, [createContextData, guid]);

    React.useEffect(() => {
        if (guid == null) return;
        context.SetLegend(guid, createLegend());
    }, [createLegend]);

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

    const bars = React.useMemo(() => {
        // not enough data to display
        if (props.Data.length === 0) return <></>;

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
        let yValues = [...props.Data];
        // Insert bottom of bar if only 1 value exists
        if (yValues.length === 1)
            yValues.push(context.YDomain[axis][0]);
        
        yValues = yValues.map(yVal => 
            context.YTransformation(Math.min(yVal, context.YDomain[axis][1]), axis)
        );
        yValues.sort((a,b) => a-b);

        const newBars :JSX.Element[] = [];
        for(let yIndex = 0; yIndex < yValues.length-1; yIndex++){
            newBars.push(
                <rect
                    key={yIndex}
                    x={leftEdge}
                    y={yValues[yIndex]}
                    width={rightEdge-leftEdge}
                    height={yValues[yIndex+1]-yValues[yIndex]}
                    fill={props.Color}
                    opacity={props.Opacity ?? 0.5}
                    stroke={props.StrokeColor}
                    strokeWidth={props.StrokeWidth}
                />
            );
        }
        return newBars;
    }, [props, context]);

    return <g>{bars}</g>
}

export default StackedBar;
