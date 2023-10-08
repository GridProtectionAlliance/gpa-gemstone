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
import {IDataSeries, GraphContext, LineStyle, AxisIdentifier, AxisMap} from './GraphContext';
import * as moment from 'moment';
import {PointNode} from './PointNode';
import LineLegend from './LineLegend';


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
    const [highlight, setHighlight] = React.useState<[number, number]>([NaN,NaN]);
    const [enabled, setEnabled] = React.useState<boolean>(true);
    const [data, setData] = React.useState<PointNode|null>(null);
    const [visibleData, setVisibleData] = React.useState<[...number[]][]>([]);
    const context = React.useContext(GraphContext);
    const showPoints = React.useMemo(() => (props.showPoints !== undefined && props.ShowPoints) || 
        ((props.autoShowPoints === undefined || props.autoShowPoints) && visibleData.lenght <= 100), 
        [props.showPoints, props.autoShowPoints, visibleData]);

   React.useEffect(() => {
       if (guid === "")
        return;
      context.UpdateData(guid, {
        legend: createLegend(),
        axis: props.axis,
        getMax: (t) => (data == null|| !enabled? -Infinity : data.GetLimits(t[0],t[1])[1]),
        getMin: (t) => (data == null|| !enabled? Infinity : data.GetLimits(t[0],t[1])[0]),
        getPoint: (t) => (data == null|| !enabled? NaN : data.GetPoint(t)),
      } as IDataSeries)
   }, [props, data, enabled])

   React.useEffect(() => {
      if (props.data.length === 0 || isNaN(context.XHover) || data === null)
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
      setData(new PointNode(props.data));
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
       const id = context.AddData({
           legend: createLegend(),
           axis: props.axis,
           getMax: (t) => (data == null|| !enabled? -Infinity : data.GetLimits(t[0],t[1])[1]),
           getMin: (t) => (data == null|| !enabled? Infinity : data.GetLimits(t[0],t[1])[0]),
           getPoint: (t) => (data == null|| !enabled? NaN : data.GetPoint(t)),
       } as IDataSeries)
     setGuid(id)
       return () => { context.RemoveData(id) }
   }, []);

   function createLegend(): HTMLElement| React.ReactElement| JSX.Element| undefined {
     if (props.legend === undefined)
       return undefined;

     let txt = props.legend;

     if (props.highlightHover && !isNaN(highlight[0]) && !isNaN(highlight[1]))
      txt = txt + ` (${moment.utc(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1].toPrecision(6)})`

       return <LineLegend 
        label={txt} color={props.color}
        lineStyle={props.lineStyle}
        onClick={() => setEnabled((e) => !e)} 
        opacity={(enabled? 1 : 0.5)}/>;
   }

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
           <path d={generateData()} style={{ fill: 'none', strokeWidth: props.width === undefined ? 3 : props.width, stroke: props.color }} strokeDasharray={props.lineStyle === ':'? '10,5' : 'none'} />
           {showPoints && data != null? visibleData.map((pt, i) => <circle key={i} r={3} cx={context.XTransformation(pt[0])} cy={context.YTransformation(pt[1], AxisMap.get(props.axis))} fill={props.color} stroke={'black'} style={{ opacity: 0.8/*, transition: 'cx 0.5s,cy 0.5s'*/ }} />) : null}
           {props.highlightHover && !isNaN(highlight[0]) && !isNaN(highlight[1])? 
            <circle r={5} cx={context.XTransformation(highlight[0])} cy={context.YTransformation(highlight[1], AxisMap.get(props.axis))} fill={props.color} stroke={'black'} style={{ opacity: 0.8/*, transition: 'cx 0.5s,cy 0.5s'*/ }} /> : null}
       </g > : null
   );
}

export default Line;
