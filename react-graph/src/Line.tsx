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
import {IDataSeries, GraphContext, LineStyle, AxisIdentifier, AxisMap, LineMap} from './GraphContext';
import * as moment from 'moment';
import {PointNode} from './PointNode';
import LineLegend from './LineLegend';
import { CreateGuid } from '@gpa-gemstone/helper-functions';


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
}

function Line(props: IProps) {
    /*
        Single Line with ability to turn off and on.
    */
    const [guid, setGuid] = React.useState<string>("");
    const [dataGuid, setDataGuid] = React.useState<string>("");
    const [highlight, setHighlight] = React.useState<[number, number]>([NaN,NaN]);
    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<PointNode|null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);
    const context = React.useContext(GraphContext);
    const showPoints = React.useMemo(() => (props.showPoints !== undefined && props.showPoints) || 
        ((props.autoShowPoints === undefined || props.autoShowPoints) && visibleData.length <= 100), 
        [props.showPoints, props.autoShowPoints, visibleData]);

    const createLegend = React.useCallback(() => {
        if (props.legend === undefined)
        return undefined;
    
        let txt = props.legend;
    
        if ((props.highlightHover ?? false) && !isNaN(highlight[0]) && !isNaN(highlight[1]))
        txt = txt + ` (${moment.utc(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1].toPrecision(6)})`
    
        return <LineLegend 
            size = 'sm' label={txt} color={props.color} lineStyle={props.lineStyle}
            setEnabled={setEnabled} enabled={enabled} hasNoData={data == null}/>;
    }, [props.color, props.lineStyle, enabled, data]);

    const createContextData = React.useCallback(() => {
        return {
            legend: createLegend(),
            axis: props.axis,
            enabled: enabled,
            getMax: (t) => (data == null|| !enabled? -Infinity : data.GetLimits(t[0],t[1])[1]),
            getMin: (t) => (data == null|| !enabled? Infinity : data.GetLimits(t[0],t[1])[0]),
            getPoints: (t, n?) => (data == null|| !enabled? NaN : data.GetPoints(t, n ?? 1))
        } as IDataSeries;
    }, [props.axis, enabled, dataGuid, createLegend]);

    React.useEffect(() => {
        if (guid === "")
            return;
        context.UpdateData(guid, createContextData());
    }, [createContextData]);

    React.useEffect(() => {
        setDataGuid(CreateGuid());
    }, [data]);

    React.useEffect(() => {
        if (data == null || props.data == null || props.data.length === 0 || isNaN(context.XHover))
            setHighlight([NaN, NaN]);
        else {
            try {
            const point = data.GetPoint(context.XHover);
            if(point != null)
                setHighlight(point as [number,number]);
            } catch {
            setHighlight([NaN, NaN]);
            }
        }
   }, [data, context.XHover])

    React.useEffect(() => {
        if (props.data == null || props.data.length === 0) setData(null);
        else setData(new PointNode(props.data));
    },[props.data]);

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
        setVisibleData(data.GetData(context.XDomain[0],context.XDomain[1],true));
    },[data, context.XDomain[0], context.XDomain[1]])

    React.useEffect(() => {
        const id = context.AddData(createContextData());
        setGuid(id);
        return () => { context.RemoveData(id) }
    }, []);

   function generateData() {
       let result = "M ";
       if (data == null)
        return ""
     result = result + visibleData.map((pt, _) => {
           const x = context.XTransformation(pt[0]);
           const y = context.YTransformation(pt[1], AxisMap.get(props.axis));
           return `${x},${y}`
       }).join(" L ")

       return result
   }


   return (
       enabled?
       <g>
           <path d={generateData()} style={{ fill: 'none', strokeWidth: props.width === undefined ? 3 : props.width, stroke: props.color }} strokeDasharray={LineMap.get(props.lineStyle)} />
           {showPoints && data != null? visibleData.map((pt, i) => <circle key={i} r={3} cx={context.XTransformation(pt[0])} cy={context.YTransformation(pt[1], AxisMap.get(props.axis))} fill={props.color} stroke={'black'} style={{ opacity: 0.8/*, transition: 'cx 0.5s,cy 0.5s'*/ }} />) : null}
           {(props.highlightHover ?? false) && !isNaN(highlight[0]) && !isNaN(highlight[1])? 
            <circle r={5} cx={context.XTransformation(highlight[0])} cy={context.YTransformation(highlight[1], AxisMap.get(props.axis))} fill={props.color} stroke={'black'} style={{ opacity: 0.8/*, transition: 'cx 0.5s,cy 0.5s'*/ }} /> : null}
       </g > : null
   );
}

export default Line;
