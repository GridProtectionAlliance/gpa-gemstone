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
import { IDataSeries, GraphContext, IHandlers, AxisIdentifier, AxisMap } from './GraphContext';
import { PointNode } from './PointNode';
import DataLegend from './DataLegend';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

interface IProps {
    /**
     * Callback function triggered on mouse position, arguments will be NaN until mouse is within 5px of a point
     * @param xValue - The x value within 5px of mouse
     * @param yValue - The y value within 5px of mouse
     * @param xPosition - The x position of the mouse
     * @param yPosition - The y position of the mouse
     */
    OnHover?: (xValue: number, yValue: number, xPosition: number, yPosition: number) => void,
    /**
     * Callback function triggered on click events if click is within 5px of a point. Function will be triggered when scales change to indicate xPos and yPos are no longer valid
     * @param xValue - The x value within 5px of click
     * @param yValue - The y value within 5px of click
     * @param xPosition - The x position of the mouse
     * @param yPosition - The y position of the mouse
     */
    OnClick?: (xValue: number, yValue: number, xPosition: number, yPosition: number) => void
    /**
     * make note about how 0 and last index will be useed to determine the height of the line
    */
    Data: [number, IData[]][],
    /**
     * Identifier for the axis the whisker lines are associated with. 
     * @type {AxisIdentifier}
    */
    Axis?: AxisIdentifier,
    /**
     * Legend text.
    */
    Legend?: string,
    /**
     * Color of the whisker lines and legend, defaults to black
    */
    Color?: string,
}

interface IData {
    Value: number,
    Color: string
}

export const WhiskerLine = (props: IProps) => {
    const context = React.useContext(GraphContext);

    const [guid, setGuid] = React.useState<string>("");
    const [dataGuid, setDataGuid] = React.useState<string>("");

    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<PointNode | null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);
    const [dataMap, setDataMap] = React.useState<Map<number, IData[]>>(new Map());

    const createLegend = React.useCallback(() => {
        if (props.Legend === undefined)
            return undefined;

        return <DataLegend
            size='sm'
            label={props.Legend}
            color={props.Color ?? 'black'}
            legendStyle={'bar'}
            setEnabled={setEnabled}
            enabled={enabled}
            hasNoData={data == null} />;
    }, [enabled, data]);

    const createContextData = React.useCallback(() => {
        return {
            legend: createLegend(),
            axis: props.Axis,
            enabled: enabled,
            getMax: (t) => (data == null || !enabled ? -Infinity : data.GetLimits(t[0], t[1], data.dim)[1]),
            getMin: (t) => (data == null || !enabled ? Infinity : data.GetLimits(t[0], t[1], data.dim)[0]),
            getPoints: (t, n?) => (data == null || !enabled ? NaN : data.GetPoints(t, n ?? 1))
        } as IDataSeries;
    }, [props.Axis, enabled, dataGuid, createLegend]);

    React.useEffect(() => {
        if (guid === "")
            return;
        context.UpdateData(guid, createContextData());
    }, [createContextData]);

    React.useEffect(() => {
        setDataGuid(CreateGuid());
    }, [data]);

    // Set up a click handler if provided in props
    React.useEffect(() => {
        if (guid === "" || props.OnClick === undefined)
            return;

        context.UpdateSelect(guid, { onClick } as IHandlers)
    }, [props.OnClick, context.UpdateFlag])

    // trigger onClick if updateFlag gets changed to indicate position is no longer valid
    React.useEffect(() => {
        if (guid === "" || props.OnClick === undefined)
            return;

        onClick(NaN, NaN)
        context.UpdateSelect(guid, { onClick } as IHandlers)
    }, [context.UpdateFlag])

    const onClick = (x: number, y: number) => {
        if (data == null || props.OnClick == null) return;
        if (isNaN(x) || isNaN(y)) {
            props.OnClick(NaN, NaN, NaN, NaN)
            return;
        }

        const point = data.GetPoint(x);
        if (point === null) return;

        const pxClick = context.XTransformation(x);
        const pxXVal = context.XTransformation(point[0])
        const t = Math.abs(pxClick - pxXVal);
        if (t > 5) return;

        const yVals = dataMap.get(point[0]);
        const yVal = yVals?.filter(d => Math.abs(yTransformation(d.Value) - yTransformation(y)) <= 5)
        if (yVal != null && yVal.length !== 0)
            props.OnClick(point[0], yVal[0].Value, context.XTransformation(x), yTransformation(y))
    }

    React.useEffect(() => {
        if (props.OnHover == null) return;
        const isDataInValid = data == null || props.Data == null || props.Data.length === 0;

        if (isDataInValid || isNaN(context.XHover)) {
            props.OnHover(NaN, NaN, NaN, NaN)
            return;
        }

        try {
            const point = data.GetPoint(context.XHover);
            if (point == null) {
                props.OnHover(NaN, NaN, NaN, NaN)
                return;
            }

            const pxXHover = context.XTransformation(context.XHover);
            const pxXVal = context.XTransformation(point[0])
            const t = Math.abs(pxXHover - pxXVal);
            if (t > 5) {
                props.OnHover(NaN, NaN, NaN, NaN)
                return;
            }

            const yVals = dataMap.get(point[0]);
            const yVal = yVals?.filter(y => Math.abs(yTransformation(y.Value) - yTransformation(context.YHover[0])) <= 5)
            if (yVal != null && yVal.length === 1) {
                props.OnHover(point[0], yVal[0].Value, context.XTransformation(context.XHover), context.YTransformation(context.YHover[0], AxisMap.get(props.Axis)))
                return
            }

            props.OnHover(NaN, NaN, NaN, NaN)
            return;
        } catch {
            props.OnHover(NaN, NaN, NaN, NaN)
        }

    }, [context.XHover, context.YHover, data])

    React.useEffect(() => {
        if (props.Data == null || props.Data.length === 0)
            setData(null);
        else {
            setData(new PointNode(props.Data.map(d => [d[0], ...d[1].flatMap(dd => dd.Value)])));
            const map = new Map<number, IData[]>();
            props.Data.map(d => map.set(d[0], d[1]))
            setDataMap(map);
        }

    }, [props.Data]);

    React.useEffect(() => {
        if (guid === "")
            return;
        context.SetLegend(guid, createLegend());
    }, [enabled]);

    React.useEffect(() => {
        if (data == null) {
            setVisibleData([]);
            return;
        }
        setVisibleData(data.GetData(context.XDomain[0], context.XDomain[1], true));
        //setVisibleData([data.AggregateData(props.Context.XDomain[0], props.Context.XDomain[1], 100)]);
    }, [data, context.XDomain[0], context.XDomain[1]])

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

    //wrapper for context.YTransformation probably can remove since we dont pass this to any props
    const yTransformation = (yValue: number) => {
        return context.YTransformation(yValue, AxisMap.get(props.Axis))
    }

    const Whiskers = React.useMemo(() => {
        if (visibleData.length === 0) return <></>;

        return visibleData.map((pt, index) => {
            const x = context.XTransformation(pt[0]);
            const yValues = pt.slice(1).flat();
            const bottomPoint = context.YTransformation(yValues[0], AxisMap.get(props.Axis));
            const topPoint = context.YTransformation(yValues[yValues.length - 1], AxisMap.get(props.Axis));
            const matchedData = dataMap.get(pt[0]);

            const circles = yValues.map((yValue, i) => {
                const y = context.YTransformation(yValue, AxisMap.get(props.Axis));
                const color = matchedData?.find(d => d.Value === yValue)?.Color
                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={3}
                        fill={color ?? 'black'}
                    />
                );
            });

            return (
                <g key={index}>
                    <line
                        x1={x}
                        y1={topPoint}
                        x2={x}
                        y2={bottomPoint}
                        stroke={'black'}
                        strokeWidth={1}
                    />
                    {circles}
                </g>
            );
        });
    }, [visibleData, context.YTransformation, context.XTransformation, props.Axis, props.Color]);


    return (
        <>
            {enabled ? <g>{Whiskers}</g> : null}
        </>
    );

}

export default WhiskerLine;

