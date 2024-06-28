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
     * @param xValue - The x value of the hovered bar
     * @param xPosition - The x position of the hovered bar
     * @param yPosition - The y position of the hovered bar
     */
    OnHover?: (xValue: number, xPosition: number, yPosition: number) => void,
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

        return <DataLegend
            size='sm'
            label={props.BarProps.Legend}
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
        const isDataInValid = data == null || props.BarProps.Data == null || props.BarProps.Data.length === 0;

        if (isDataInValid || isNaN(props.Context.XHover) || props.Context.XHover > data.maxT || props.Context.XHover < data.minT) {
            props.BarProps.OnHover(NaN, NaN, NaN)
            return;
        }

        try {
            const point = data.GetPoint(props.Context.XHover);
            if (point != null)
                props.BarProps.OnHover(point[0], props.Context.XTransformation(props.Context.XHover), props.Context.YTransformation(props.Context.YHover[0], AxisMap.get(props.BarProps.Axis)))
        } catch {
            props.BarProps.OnHover(NaN, NaN, NaN)
        }

    }, [props.Context.XHover, props.Context.YHover, data])

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

    const Bars = React.useMemo(() => {
        if(visibleData.length === 0) return <></>

        const baseY = props.Context.YTransformation(0, AxisMap.get(props.BarProps.Axis));
        const barWidth = getBarWidth(visibleData, props.Context, props.BarProps.MinWidth, props.BarProps.MaxWidth)

        return visibleData.map((pt, index) => {
            let height = baseY - props.Context.YTransformation(pt[1], AxisMap.get(props.BarProps.Axis));
            if (isNaN(height) || height > 9999)
                height = 0

            const x = props.Context.XTransformation(pt[0]);
            let y = props.Context.GetYPosition == null ? baseY - height : props.Context.GetYPosition(pt[0], height, baseY, pt[1])
            if (isNaN(y))
                y = -999

            //Cover negative values
            if (pt[1] < 0 && props.Context != null) {
                height = Math.abs(height)
                y = baseY
            }

            return (
                <rect
                    key={index}
                    x={x - barWidth/2}
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
    }, [visibleData, props.Context.YTransformation, props.Context.XTransformation]);

    return (
        <>
            {enabled ? <g>{Bars}</g> : null}
        </>
    );

}

//Helper function
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

/**
    Renders multiple bars with the ability to turn them off and on
*/
const Bar = (props: IProps) => {
    const context = React.useContext(GraphContext);
    return <ContexlessBar BarProps={props} Context={context} />
}

export default Bar;

