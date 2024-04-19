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
import { IDataSeries, GraphContext, LineStyle, AxisIdentifier, AxisMap, LineMap } from './GraphContext';
import * as moment from 'moment';
import { PointNode } from './PointNode';
import LineLegend from './LineLegend';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

export interface IBarData {
    Color: string, 
    DataPoints: [number, number][],
    Name: string
}

export interface IProps {
    LegendName?: string,
    HighlightHover?: boolean,
    Data?: IBarData,
    LineStyle?: LineStyle,
    Axis?: AxisIdentifier, 
}

function StackedBar(props: IProps) {
    /*
        Single Bar with ability to turn off and on.
    */
    const [guid, setGuid] = React.useState<string>("");
    const [dataGuid, setDataGuid] = React.useState<string>("");
    const [highlight, setHighlight] = React.useState<[number, number]>([NaN, NaN]);
    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<any | null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);
    const context = React.useContext(GraphContext);


    const createLegend = React.useCallback(() => {
        if (props.LegendName === undefined)
            return undefined;

        let txt = props.LegendName;

        if ((props.HighlightHover ?? false) && !isNaN(highlight[0]) && !isNaN(highlight[1]))
            txt = txt + ` (${moment.utc(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1].toPrecision(6)})`

        return <LineLegend
            size='sm' label={txt} color={"#A30000"} lineStyle={"-"}
            setEnabled={setEnabled} enabled={enabled} hasNoData={data == null} />;
    }, [props.LineStyle, enabled, data]);

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
        if (data == null || props.Data == null || props.Data.DataPoints.length === 0 || isNaN(context.XHover))
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
        if (props.Data == null || props.Data.DataPoints.length === 0) setData(null);
        else setData(props.Data);
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

    function generateData() {
        //this could be used to generate a bar.. 
    }

    return (
        enabled ?
            <>
                <g>
                    <rect width={100} height={75} x={65} y={400} stroke="#A30000" />
                    <rect width={100} height={75} x={65} y={325} stroke="#3399FF" />
                    <rect width={100} height={75} x={65} y={250} stroke="#33FF77" />
                    <rect width={100} height={75} x={65} y={175} stroke="#E3FF33" />
                </g>
                <g>
                    <rect width={100} height={75} x={165} y={400} stroke="#A30000" />
                    <rect width={100} height={75} x={165} y={325} stroke="#3399FF" />
                    <rect width={100} height={75} x={165} y={250} stroke="#33FF77" />
                    <rect width={100} height={75} x={165} y={175} stroke="#E3FF33" />
                </g >
            </>
            : null
    );
}

export default StackedBar;
