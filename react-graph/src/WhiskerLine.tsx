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
import Infobox, { origin } from './Infobox';

interface IProps {
    /**
     * Array of data points to be represented by whisker lines, each point as a [x, y[]] tuple.
    */
    Data: [number, number[]][],
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
     * First color will be used to color the whiskerlines, legend, and the first and last index for yValues. The second color will be used to color all values in between the first and last yValue. 
    */
    Colors?: [string, string]
    /**
     * Flag to determine if infobox is shown when hovering a whisker line.
    */
    ShowHoverInfoBox?: boolean,
    /**
     * Flag to determine if infobox is shown when a point is clicked.
    */
    ShowClickInfoBox?: boolean
    /**
     * Array of names used in the infobox. Each y-value index corresponds to the index in this array.
    */
    Names?: string[]
}

export interface IInteractionData {
    XPosition: number,
    YPosition: number,
    Content: { Value: number, Name: string }[],
    Origin: origin
}

export const WhiskerLine = (props: IProps) => {
    const context = React.useContext(GraphContext);

    const [guid, setGuid] = React.useState<string>("");
    const [dataGuid, setDataGuid] = React.useState<string>("");

    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<PointNode | null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);

    const [hoverData, setHoverData] = React.useState<IInteractionData | null>(null);
    const [clickData, setClickData] = React.useState<IInteractionData | null>(null);

    const createLegend = React.useCallback(() => {
        if (props.Legend === undefined)
            return undefined;

        return <DataLegend
            size='sm'
            label={props.Legend}
            color={props.Colors?.[0] ?? 'black'}
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
        if (guid === "" || props.ShowClickInfoBox === undefined)
            return;
        context.RegisterSelect({ onClick } as IHandlers)
        context.UpdateSelect(guid, { onClick } as IHandlers)
    }, [props.ShowClickInfoBox, context.UpdateFlag])

    const onClick = (x: number, y: number) => {
        if ((props.ShowHoverInfoBox ?? false) === false) return;
        const isDataInValid = data == null || props.Data == null || props.Data.length === 0;
        if (isNaN(x) || isNaN(y) || isDataInValid || context.CurrentMode === 'select') {
            setClickData(null)
            return;
        }

        setClickData(handleDataInteraction(data, x, context.XDomain, context.YDomain[0], props.Names))
    }

    React.useEffect(() => {
        if ((props.ShowHoverInfoBox ?? false) === false) return;
        const isDataInValid = data == null || props.Data == null || props.Data.length === 0;

        if (isDataInValid || isNaN(context.XHover)) {
            setHoverData(null);
            return;
        }

        setHoverData(handleDataInteraction(data, context.XHover, context.XDomain, context.YDomain[0], props.Names))
    }, [context.XHover, context.YHoverSnap, data])

    React.useEffect(() => {
        if (props.Data == null || props.Data.length === 0)
            setData(null);
        else
            setData(new PointNode(props.Data.map(d => [d[0], ...d[1]])));
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
    }, [data, context.XDomain[0], context.XDomain[1]])

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

    const Whiskers = React.useMemo(() => {
        if (visibleData.length === 0 || !enabled) return <></>;

        return visibleData.map((pt, index) => {
            const x = context.XTransformation(pt[0]);
            const yValues = pt.slice(1).flat();
            const bottomPoint = context.YTransformation(yValues[0], AxisMap.get(props.Axis))
            const topPoint = context.YTransformation(yValues[yValues.length - 1], AxisMap.get(props.Axis))

            const circles = yValues.map((yValue, index) => {
                const y = context.YTransformation(yValue, AxisMap.get(props.Axis))
                let color = 'black'
                const isFirstOrLastIndex = (index === 0 || index === yValues.length - 1)

                if (props.Colors?.[0] != null && isFirstOrLastIndex)
                    color = props.Colors[0]

                if (props.Colors?.[1] != null && !isFirstOrLastIndex)
                    color = props.Colors[1];

                return (
                    <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={3}
                        fill={color}
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
                        stroke={props.Colors?.[0] ?? 'black'}
                        strokeWidth={1}
                    />
                    {circles}
                </g>
            );
        });
    }, [visibleData, context.YTransformation, context.XTransformation, props.Axis, props.Colors, enabled, context.DataGuid]);

    return (
        <>
            <g>{Whiskers}</g>
            {hoverData != null ?
                <Infobox ChildID={guid} X={hoverData?.XPosition} Y={hoverData.YPosition} Origin={hoverData.Origin}>
                    <p style={{ whiteSpace: 'nowrap' }} id={guid}>
                        {hoverData.Content.map((d, index) => (
                            <>
                                {d.Name}{d.Value.toFixed(3)}
                                {index < hoverData.Content.length - 1 ? <br /> : null}
                            </>
                        ))}
                    </p>
                </Infobox>
                : null}
            {clickData != null && context.CurrentMode === 'select' ?
                <Infobox ChildID={`${guid}click`} X={clickData?.XPosition} Y={clickData.YPosition} Origin={clickData.Origin}>
                    <p style={{ whiteSpace: 'nowrap' }} id={`${guid}click`}>
                        {clickData.Content.map((d, index) => (
                            <>
                                {d.Name}{d.Value.toFixed(3)}
                                {index < clickData.Content.length - 1 ? <br /> : null}
                            </>
                        ))}
                    </p>
                </Infobox>
                : null}
        </>
    );
}

const handleDataInteraction = (data: PointNode, xValue: number, xDomain: [number, number], yDomain: [number, number], names?: string[]): IInteractionData | null => {
    const point = data.GetPoint(xValue);
    if (point === null)
        return null;

    const yVals = point.slice(1);

    if (yVals == null)
        return null;

    const content = yVals.map((yVal, index) => ({
        Name: names != null ? names[index] + ': ' : "",
        Value: yVal
    }))

    const middleYOfPlot = (yDomain[0] + yDomain[1]) / 2
    const middleOfXDomain = (xDomain[0] + xDomain[1]) / 2
    let origin = 'upper-left'
    if (xValue > middleOfXDomain)
        origin = 'upper-right'

    return { Content: content, XPosition: point[0], YPosition: middleYOfPlot, Origin: origin as origin }
}

export default WhiskerLine;

