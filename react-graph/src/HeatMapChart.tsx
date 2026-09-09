// ******************************************************************************************************
//  HeatMapChart.tsx - Gbtc
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
//  09/05/2021 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import {HsvToHex} from '@gpa-gemstone/helper-functions';
import {IDataSeries, GraphContext, FillStyle, AxisIdentifier, AxisMap} from './GraphContext';
import {PointNode} from './PointNode';
import HeatLegend from './HeatLegend';


/** Defines axes, cells, and color scaling for a heat-map chart. */
export interface IProps {
    /** Triplets containing the X coordinate, Y coordinate, and heat value for each cell. */
    data: [number, number, number][],
    /** Base HSV hue used to color cells, expressed from 0 through 1. */
    hue: number,
    /** HSV saturation used to color cells, expressed from 0 through 1. */
    saturation: number,
    /** Optional fill style associated with the heat-map data. */
    fillStyle?: FillStyle,
    /** Optional Y-axis associated with the heat-map values. */
    axis?: AxisIdentifier,
    /** Optional unit appended to values in the heat legend. */
    legendUnit?: string,
    /** Optional alignment of each cell relative to its X coordinate, defaulting to left. */
    barAlign?: 'left'|'center'|'right',
    /** Optional Y-axis size of each bin, allowing multiple cells at the same X coordinate. */
    binSize?: number,
    /** Optional sample interval in milliseconds used to calculate cell width. */
    sampleMs?: number
}

/**
 * Renders heat-map cells and registers their range with the graph context.
 * @param props - Heat-map samples, color settings, and bin geometry.
 * @returns SVG group containing the heat-map cells.
 */
function HeatMapChart(props: IProps) {
    /*
        Single Line with ability to turn off and on.
    */
    const [guid, setGuid] = React.useState<string>("");
    const [data, setData] = React.useState<PointNode|null>(null);
    const [barWidth, setBarWidth] = React.useState<number>(0);
    const context = React.useContext(GraphContext);
    
    const allBarBottoms = React.useMemo<number>(() => context.YTransformation(context.YDomain[AxisMap.get(props.axis)][0], AxisMap.get(props.axis)), [context.YTransformation, context.YDomain, props.axis]);
    const zLimits = React.useMemo(() => {
        if (data == null) return [0, 1];
        return data.GetLimits(context.XDomain[0], context.XDomain[1], 1);
    }, [data, context.XDomain]);

    function getAllBarOffset() {
        switch(props.barAlign) {
            case 'left':
                return 0;
            case 'center':
                return 0.5 * barWidth;
            case 'right':
                return barWidth;
        }
        return 0;
    }
    const allBarOffset = getAllBarOffset();

    React.useEffect(() => {
        if (data == null || guid === "") return;
        if (props.sampleMs !== undefined) {
            setBarWidth(context.XTransformation(data.minT + props.sampleMs) - context.XTransformation(data.minT));
            return;
        }
        setBarWidth((context.XTransformation(data.maxT) - context.XTransformation(data.minT)) / data.GetFullData().length);
    }, [data, context.XTransformation, props.sampleMs]);

   const createLegend = React.useCallback(() => {
        return <HeatLegend
            id={guid}
            unitLabel={props.legendUnit}
            enabled={true}
            minColor={HsvToHex(props.hue, props.saturation, 1)} maxColor={HsvToHex(props.hue, props.saturation, 0)}
            minValue={zLimits[0]} maxValue={zLimits[1]}/>;
    }, [props.legendUnit, zLimits, props.hue, props.saturation, guid]);

    React.useEffect(() => {
        setData(new PointNode(props.data));
    },[props.data]);

   React.useEffect(() => {
        if (guid === "")
            return;
        context.UpdateData(guid, {
            axis: props.axis,
            legend: createLegend(),
            enabled: true,
            getMax: (t) => (data == null ? -Infinity : data.GetLimits(t[0],t[1],0)[1]),
            getMin: (t) => (data == null ?  Infinity : data.GetLimits(t[0],t[1],0)[0]),
        } as IDataSeries);
    }, [props, data, createLegend]);

    React.useEffect(() => {
        const id = context.AddData({
            axis: props.axis,
            legend: createLegend(),
            enabled: false,
            getMax: (t) => (data == null ? -Infinity : data.GetLimits(t[0],t[1],0)[1]),
            getMin: (t) => (data == null ?  Infinity : data.GetLimits(t[0],t[1],0)[0]),
        } as IDataSeries);
        setGuid(id);
        return () => { context.RemoveData(id); }
    }, []);

    return (
        <g>
            {data == null ? null : 
                data.GetFullData().map((pt, i) => {
                    const barTop =  context.YTransformation(pt[1] + (props.binSize ?? 0), AxisMap.get(props.axis));
                    const value = 1 - (pt[2] - zLimits[0]) / (zLimits[1] - zLimits[0]);
                    const color = HsvToHex(props.hue, props.saturation, value);
                    return <rect key={i} x={context.XTransformation(pt[0]) - allBarOffset} y={barTop} width={barWidth} 
                    height={Math.abs(barTop-(props.binSize !== undefined ? context.YTransformation(pt[1], AxisMap.get(props.axis)) : allBarBottoms))} fill={color} stroke={color}/>
                })
            }
        </g>
    );
}

export default HeatMapChart;