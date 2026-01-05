// ******************************************************************************************************
//  Line.tsx - Gbtc
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
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { IDataSeries, GraphContext, LineStyle, AxisIdentifier, AxisMap, LineMap } from './GraphContext';
import * as moment from 'moment';
import { PointNode } from './PointNode';
import useLegend from './Hooks/useLegend';

export interface IInteralProps extends IProps {
    reRender?: number
}

export interface IProps {
    showPoints?: boolean,
    autoShowPoints?: boolean,
    legend?: string,
    highlightHover?: boolean,
    data: [number, number][],
    color: string,
    lineStyle: LineStyle,
    width?: number,
    axis?: AxisIdentifier,
    onHover?: (x: number, y: number) => void
}

/**
 * Single Line with ability to turn off and on.
 */
export const InternalLine = React.forwardRef<PointNode | null, IInteralProps>((props, ref) => {

    const [guid, setGuid] = React.useState<string>("");
    const [highlight, setHighlight] = React.useState<[number, number]>([NaN, NaN]);
    const [data, setData] = React.useState<PointNode | null>(null);
    const context = React.useContext(GraphContext);
    const showPoints = React.useMemo(() => (props.showPoints ?? false) || ((props.autoShowPoints ?? true) && (data?.GetCount(context.XDomain[0], context.XDomain[1]) ?? 1000) <= 100),
        [props.showPoints, props.autoShowPoints, data, context.XDomain]);

    const points = React.useMemo(() =>
        data?.GetData(context.XDomain[0], context.XDomain[1], true) ?? []
        , [context.XDomain, data]);

    React.useImperativeHandle<PointNode | null, PointNode | null>(ref, () => data, [data]);

    const legendTxt = React.useMemo(() => {
        let txt = props.legend;

        if ((props.highlightHover ?? false) && !isNaN(highlight[0]) && !isNaN(highlight[1]))
            txt = txt + ` (${moment.utc(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1].toPrecision(6)})`

        return txt
    }, [props.legend, props.highlightHover, highlight]);

    const { enabled, createLegend } = useLegend(props.color, props.lineStyle, guid, data == null, legendTxt);

    const createContextData = React.useCallback((): IDataSeries => {
        return {
            legend: createLegend(),
            axis: props.axis,
            enabled: enabled,
            getMax: (t) => (data == null || !enabled ? -Infinity : data.GetLimits(t[0], t[1])[1]),
            getMin: (t) => (data == null || !enabled ? Infinity : data.GetLimits(t[0], t[1])[0]),
            getPoints: (t, n?) => (data == null || !enabled ? [[NaN]] : data.GetPoints(t, n ?? 1))
        };
    }, [props.axis, enabled, data, createLegend, props.reRender]);

    React.useEffect(() => {
        if (guid === "")
            return;
        context.UpdateData(guid, createContextData());
    }, [createContextData]);

    React.useEffect(() => {
        if (data == null || props.data == null || props.data.length === 0 || isNaN(context.XHover))
            setHighlight([NaN, NaN]);
        else {
            try {
                const point = data.GetPoint(context.XHover);
                if (point != null) {
                    setHighlight(point as [number, number]);
                    if (props.onHover != null) props.onHover(point[0], point[1]);
                }
            } catch {
                setHighlight([NaN, NaN]);
            }
        }
    }, [data, context.XHover]);

    React.useEffect(() => {
        if (props.data == null) setData(null);
        else setData(new PointNode(props.data));
    }, [props.data]);

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

    const generateData = React.useCallback((pointsToDraw: number[][]) => {
        if (pointsToDraw.length === 0)
            return ""

        let result = "M ";

        const parts = [];

        for (const [xVal, yVal] of pointsToDraw) {
            if (isNaN(xVal) || isNaN(yVal)) continue;
            const x = context.XTransformation(xVal);
            const y = context.YTransformation(yVal, AxisMap.get(props.axis));
            parts.push(`${x},${y}`);
        }

        result += parts.join(" L ");

        return result
    }, [context.XTransformation, context.YTransformation, props.axis])

    return (
        enabled ?
            <g>
                <path
                    d={generateData(points)}
                    style={{ fill: 'none', strokeWidth: props.width === undefined ? 3 : props.width, stroke: props.color }}
                    strokeDasharray={LineMap.get(props.lineStyle)}
                />

                {showPoints && data != null ?
                    points.map((pt, i) => {
                        if (isNaN(pt[0]) || isNaN(pt[1])) return null
                        return (
                            <circle
                                key={i}
                                r={3}
                                cx={context.XTransformation(pt[0])}
                                cy={context.YTransformation(pt[1], AxisMap.get(props.axis))}
                                fill={props.color}
                                stroke={'currentColor'}
                                style={{ opacity: 0.8/*, transition: 'cx 0.5s,cy 0.5s'*/ }}
                            />
                        )
                    }
                    )
                    : null}

                {(props.highlightHover ?? false) && !isNaN(highlight[0]) && !isNaN(highlight[1]) ?
                    <circle
                        r={5}
                        cx={context.XTransformation(highlight[0])}
                        cy={context.YTransformation(highlight[1], AxisMap.get(props.axis))}
                        fill={props.color}
                        stroke={'currentColor'}
                        style={{ opacity: 0.8/*, transition: 'cx 0.5s,cy 0.5s'*/ }}
                    />
                    : null}
            </g > : null
    );
});

const Line = (props: IProps) => <InternalLine {...props} />;
export default Line;