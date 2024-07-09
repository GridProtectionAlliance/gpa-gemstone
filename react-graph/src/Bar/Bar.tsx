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
import { GraphContext, AxisIdentifier, AxisMap } from '../GraphContext';
import { PointNode } from '../PointNode';
import DataLegend from '../DataLegend';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { IBarContext, IBarDataSeries } from './BarGroup';
import { IHoverData } from '../WhiskerLine'

interface IProps {
    /**
     * Array of data points to be represented by bars, each point as a [x, y] tuple.
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
    StrokeWidth?: number,
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
    const [hoverData, setHoverData] = React.useState<IHoverData | null>(null);

    const createLegend = React.useCallback(() => {
        if (props.BarProps.Legend === undefined)
            return undefined;

        return <DataLegend
            size='sm'
            label={props.BarProps.Legend}
            color={props.BarProps.Color}
            legendStyle={'bar'}
            setEnabled={setEnabled}
            enabled={enabled}
            hasNoData={data == null} />;
    }, [props.BarProps.Color, enabled, dataGuid]);

    const createContextData = React.useCallback(() => {
        const contextData: IBarDataSeries = {
            legend: createLegend(),
            axis: props.BarProps.Axis,
            enabled: enabled,
            getMax: (t: [number, number]) => (data == null || !enabled ? -Infinity : data.GetLimits(t[0], t[1])[1]),
            getMin: (t: [number, number]) => (data == null || !enabled ? Infinity : data.GetLimits(t[0], t[1])[0]),
            getPoints: (t: number, n?: number | undefined) => (data == null || !enabled ? undefined : data.GetPoints(t, n ?? 1))
        };

        if (props.Context.YTransformation != null)
            contextData.getPoint = (t) => (data == null || !enabled ? undefined : data.GetPoint(t));

        return contextData as IBarDataSeries;
    }, [props.BarProps.Axis, enabled, dataGuid, createLegend, props.Context.YTransformation]);

    React.useEffect(() => {
        if (guid === "")
            return;
        props.Context.UpdateData(guid, createContextData(), props.BarProps.Legend);
    }, [createContextData]);

    React.useEffect(() => {
        setDataGuid(CreateGuid());
    }, [data]);

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
    }, [dataGuid, props.Context.XDomain[0], props.Context.XDomain[1]])

    React.useEffect(() => {
        const id = props.Context.AddData(createContextData(), props.BarProps.Legend);
        setGuid(id);
        return () => { props.Context.RemoveData(id) }
    }, []);

    const Bars = React.useMemo(() => {
        if (visibleData.length === 0 || !enabled) return <></>

        const baseYPosition = props.Context.YTransformation(0, AxisMap.get(props.BarProps.Axis));
        const barWidth = getBarWidth(visibleData, props.Context, props.BarProps.MinWidth, props.BarProps.MaxWidth)

        return visibleData.map((pt, index) => {
            const [xValue, yValue] = pt;
            let height = baseYPosition - props.Context.YTransformation(yValue, AxisMap.get(props.BarProps.Axis));
            if (isNaN(height) || height > 9999)
                height = 0

            const xPosition = props.Context.XTransformation(xValue);
            let yPosition = props.Context.GetYPosition != null ? props.Context.GetYPosition(xValue, guid, props.BarProps.Axis) : baseYPosition - height
            yPosition = sanitizeYPosition(yPosition, height, baseYPosition, yValue);

            return (
                <rect
                    key={index}
                    x={xPosition - barWidth / 2}
                    y={yPosition}
                    width={barWidth}
                    height={height}
                    fill={props.BarProps.Color}
                    opacity={props.BarProps.Opacity ?? 0.5}
                    stroke={props.BarProps.StrokeColor}
                    strokeWidth={props.BarProps.StrokeWidth}
                />
            );
        });

    }, [visibleData, props.Context.YTransformation, props.Context.XTransformation, createContextData, enabled, props.Context.DataGuid]);

    return <g>{Bars}</g>
}

//Helper functions
const getBarWidth = (data: [...number[]][], context: IBarContext, minWidth: number | undefined, maxWidth: number | undefined) => {
    // Calculate intervals between points for bar width
    const intervals = [];
    if (data.length === 1 || data.length === 2) {
        intervals.push(50); // if one bar just use 50 for now..
    } else {
        for (let i = 0; i < data.length - 1; i++) {
            const currentX = context.XTransformation(data[i][0]);
            const nextX = context.XTransformation(data[i + 1][0]);
            intervals.push(nextX - currentX);
        }
    }

    // Determine the bar width as the smallest interval
    let calculatedBarWidth = Math.min(...intervals);

    if (minWidth != null && calculatedBarWidth < minWidth)
        calculatedBarWidth = minWidth

    if (maxWidth != null && calculatedBarWidth > maxWidth)
        calculatedBarWidth = maxWidth;
    return calculatedBarWidth;
}

const sanitizeYPosition = (yPosition: number, height: number, baseYPosition: number, yValue: number) => {
    let sanitizedYPosition = yPosition;
    if (yPosition === undefined)
        sanitizedYPosition = baseYPosition - height

    //When negative yVal just use baseY for yPosition for now
    if (yValue < 0) {
        height = Math.abs(height)
        sanitizedYPosition = baseYPosition
    }

    if (isNaN(yPosition))
        sanitizedYPosition = -999

    return sanitizedYPosition;
}

/**
    Renders multiple bars with the ability to turn them off and on
*/
const Bar = (props: IProps) => {
    const context = React.useContext(GraphContext);
    return <ContexlessBar BarProps={props} Context={context} />
}

export default Bar;

