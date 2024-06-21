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
//  03/28/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { IDataSeries, GraphContext, AxisIdentifier, AxisMap } from '../GraphContext';
import { PointNode } from '../PointNode';
import DataLegend from '../DataLegend';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { IBarContext } from './BarGroup';

interface IProps {
    /**
     * Callback function triggered on mouse position.
     * @param timeValue - The time value of the hovered bar
     * @param xPosition - The x position of the hovered bar
     * @param yPosition - The y position of the hovered bar
     */
    OnHover?: (timeValue: number, xPosition: number, yPosition: number) => void,
    /**
     * Array of data points to be represented by bars, each point as a [time, value] tuple.
    */
    Data: [number, number][],
    /**
     * Color of the bars.
    */
    Color: string,
    /**
     * Identifier for the axis the bars are associated with.
     * @type {AxisIdentifier}
    */
    Axis?: AxisIdentifier,
    /**
     * Legend text for the bars.
    */
    Legend?: string,
    /**
     * Minimum width of the bars.
    */
    MinWidth?: number,
    /**
     * Maximum width of the bars.
    */
    MaxWidth?: number,
    /**
     * Opacity of the bars.
    */
    Opacity?: number,
    /**
     * Stroke color of the bars.
    */
    StrokeColor?: string,
    /**
     * Stroke width of the bars.
    */
    StrokeWidth?: number
}

interface IContextlessProps {
    Context: IBarContext
    BarProps: IProps
}

export const ContexlessBar = (props: IContextlessProps) => {
    const [guid, setGuid] = React.useState<string>("");
    const [dataGuid, setDataGuid] = React.useState<string>("");

    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<PointNode | null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);

    const createLegend = React.useCallback(() => {
        if (props.BarProps.Legend === undefined)
            return undefined;

        let txt = props.BarProps.Legend;
        return <DataLegend
            size='sm'
            label={txt}
            color={props.BarProps.Color}
            legendStyle={'bar'}
            setEnabled={setEnabled}
            enabled={enabled}
            hasNoData={data == null} />;
    }, [props.BarProps.Color, enabled, data]);

    const createContextData = React.useCallback(() => {
        return {
            legend: createLegend(),
            axis: props.BarProps.Axis,
            enabled: enabled,
            getMax: (t) => (data == null || !enabled ? -Infinity : data.GetLimits(t[0], t[1])[1]),
            getMin: (t) => (data == null || !enabled ? Infinity : data.GetLimits(t[0], t[1])[0]),
            getPoints: (t, n?) => (data == null || !enabled ? NaN : data.GetPoints(t, n ?? 1))
        } as IDataSeries;
    }, [props.BarProps.Axis, enabled, dataGuid, createLegend]);

    React.useEffect(() => {
        if (guid === "")
            return;
        props.Context.UpdateData(guid, createContextData());
    }, [createContextData]);

    React.useEffect(() => {
        setDataGuid(CreateGuid());
    }, [data]);

    React.useEffect(() => {
        if (props.BarProps.OnHover == null) return;
        if (data == null || props.BarProps.Data == null || props.BarProps.Data.length === 0 || isNaN(props.Context.XHover) || props.Context.XHover > data.maxT || props.Context.XHover < data.minT) {
            props.BarProps.OnHover(NaN, NaN, NaN)
            return;
        }
        try {
            const point = data.GetPoint(props.Context.XHover);
            if (point != null)
                props.BarProps.OnHover(point[0], props.Context.XTransformation(point[0]), props.Context.YTransformation(props.Context.YHover[0], props.BarProps.Axis as AxisIdentifier))

        } catch {
            props.BarProps.OnHover(NaN, NaN, NaN)
        }

    }, [data, props.Context.XHover, props.Context.YHover])


    React.useEffect(() => {
        if (props.BarProps.Data == null || props.BarProps.Data.length === 0)
            setData(null);
        else
            setData(new PointNode(props.BarProps.Data));
    }, [props.BarProps.Data]);


    React.useEffect(() => {
        if (guid === "")
            return;
        props.Context.SetLegend(guid, createLegend());

    }, [enabled]);

    React.useEffect(() => {
        if (data == null) {
            setVisibleData([]);
            return;
        }
        setVisibleData(data.GetData(props.Context.XDomain[0], props.Context.XDomain[1], true));
        //setVisibleData([data.AggregateData(props.Context.XDomain[0], props.Context.XDomain[1], 100)]);
    }, [data, props.Context.XDomain[0], props.Context.XDomain[1]])

    React.useEffect(() => {
        const id = props.Context.AddData(createContextData());
        setGuid(id);
        return () => { props.Context.RemoveData(id) }
    }, []);

    const generateBars = () => {
        if (visibleData == null || visibleData.length === 0) return null;

        // Calculate intervals between points for bar width
        const intervals = [];
        if(visibleData.length === 1)
            intervals.push(50); // if one bar just use 50 for now..
        else{
            for (let i = 0; i < visibleData.length - 1; i++) {
                const currentX = props.Context.XTransformation(visibleData[i][0]);
                const nextX = props.Context.XTransformation(visibleData[i + 1][0]);
                intervals.push(nextX - currentX);
            }
        }

        // Determine the bar width as the smallest interval
        let barWidth = Math.min(...intervals);

        if (props.BarProps.MinWidth != null && barWidth < props.BarProps.MinWidth)
            barWidth = props.BarProps.MinWidth
        if (props.BarProps.MaxWidth != null && barWidth > props.BarProps.MaxWidth)
            barWidth = props.BarProps.MaxWidth
        
        const baseY = props.Context.YTransformation(0, AxisMap.get(props.BarProps.Axis));

        return visibleData.map((pt, index) => {
            let height = baseY - props.Context.YTransformation(pt[1], AxisMap.get(props.BarProps.Axis));
            if (isNaN(height) || height > 9999)
                height = 0

            const x = props.Context.XTransformation(pt[0]);
            let y = props.Context.GetYPosition == null ? baseY - height : props.Context.GetYPosition(pt[0], height, baseY, pt[1])
            if (isNaN(y))
                y = -999

            if(pt[1] < 0 && props.Context != null){
                height = Math.abs(height)
                y = baseY
            }

            return (
                <rect
                    key={index}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={props.BarProps.Color}
                    opacity={props.BarProps.Opacity ?? 0.5}
                    stroke={props.BarProps.StrokeColor}
                    strokeWidth={props.BarProps.StrokeWidth}
                />
            );
        });
    };


    return (
        <>
            {enabled ? <g>{generateBars()}</g> : null}
        </>
    );
    
}

/**
    Renders multiple bars with the ability to turn them off and on
*/
const Bar = (props: IProps) => {
    const context = React.useContext(GraphContext);
    return <ContexlessBar BarProps={props} Context={context} />
}

export default Bar;

