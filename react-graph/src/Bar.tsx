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
//  03/28/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import { IDataSeries, GraphContext, AxisIdentifier, AxisMap } from './GraphContext';
import * as moment from 'moment';
import { PointNode } from './PointNode';
import DataLegend from './DataLegend';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

interface IProps {
    HighlightHover?: boolean,
    Data: [number, number][],
    Name: string,
    Color: string,
    Axis?: AxisIdentifier,
    Legend?: string,
    Stacked?: boolean //this will be used to determine if we should stack each bar by its time value
}

function Bar(props: IProps) {
    /*
        Single Bar with ability to turn off and on.
    */
    const [guid, setGuid] = React.useState<string>("");
    const [dataGuid, setDataGuid] = React.useState<string>("");
    const [highlight, setHighlight] = React.useState<[number, number]>([NaN, NaN]);
    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<PointNode | null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);
    const context = React.useContext(GraphContext);


    const createLegend = React.useCallback(() => {
        if (props.Legend === undefined)
            return undefined;

        let txt = props.Legend;

        if ((props.HighlightHover ?? false) && !isNaN(highlight[0]) && !isNaN(highlight[1]))
            txt = txt + ` (${moment.utc(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1].toPrecision(6)})`

        return <DataLegend
            size='sm' label={txt} color={props.Color} legendStyle={'bar'}
            setEnabled={setEnabled} enabled={enabled} hasNoData={data == null} />;
    }, [props.Color, enabled, data]);

    const createContextData = React.useCallback(() => {
        return {
            legend: createLegend(),
            axis: props.Axis,
            enabled: enabled,
            getMax: (t) => (data == null || !enabled ? -Infinity : data.GetLimits(t[0], t[1])[1]),
            getMin: (t) => (data == null || !enabled ? Infinity : data.GetLimits(t[0], t[1])[0]),
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

    
    React.useEffect(() => {
        if (data == null || props.Data == null || props.Data.length === 0 || isNaN(context.XHover))
            setHighlight([NaN, NaN]);
        else {
            try {
                const point = data.GetPoint(context.XHover);
                if (point != null)
                    setHighlight(point as [number, number]);
            } catch {
                setHighlight([NaN, NaN]);
            }
        }
    }, [data, context.XHover])


    React.useEffect(() => {
        if (props.Data == null || props.Data.length === 0) setData(null);
        else setData(new PointNode(props.Data));
    }, [props.Data]);

    
    React.useEffect(() => {
        if (guid === "")
            return;
        context.SetLegend(guid, createLegend());

    }, [highlight, enabled]);

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

    function generateBars() {
        if (!visibleData || visibleData.length === 0) return null;

        // Calculate intervals between points for bar width
        const intervals = [];
        for (let i = 0; i < visibleData.length - 1; i++) {
            const currentX = context.XTransformation(visibleData[i][0]);
            const nextX = context.XTransformation(visibleData[i + 1][0]);
            intervals.push(nextX - currentX);
        }

        if (visibleData.length > 1)
            intervals.push(intervals[intervals.length - 1]); // Use the last calculated interval for the last bar
        else
            intervals.push(50); // if one bar just use 50 for now..


        // Determine the bar width as the smallest interval
        const barWidth = Math.min(...intervals);

        return visibleData.map((pt, index) => {
            const x = context.XTransformation(pt[0]);
            const y = context.YTransformation(pt[1], AxisMap.get(props.Axis));
            const baseY = context.YTransformation(0, AxisMap.get(props.Axis));
            let height = baseY - y;
            if (height < 0 || isNaN(height))
                height = 0
            return (
                <rect key={index}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={"none"}
                    stroke={props.Color} />
            );
        });
    }

    return (
        <g>
            {enabled && generateBars()}
        </g>
    );
}

export default Bar;
