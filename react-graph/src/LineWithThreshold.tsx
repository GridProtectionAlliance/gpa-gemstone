// ******************************************************************************************************
//  LineWithThreshold.tsx - Gbtc
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
//  03/24/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import {IDataSeries, GraphContext} from './GraphContext';
import * as moment from 'moment';
import {PointNode} from './PointNode';
import {GetTextWidth} from '@gpa-gemstone/helper-functions';
import {IProps as ILineProps} from './Line';

export interface IProps extends ILineProps {
    threshHolds: IThreshold[],
}

export interface IThreshold {
  Value: number,
  Color: string
}

function LineWithThreshold(props: IProps) {
  /*
    Single Line with ability to turn off and on.
  */
  const [guid, setGuid] = React.useState<string>("");
  const [highlight, setHighlight] = React.useState<[number, number]>([NaN,NaN]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [wLegend, setWLegend] = React.useState<number>(0);
  const [data, setData] = React.useState<PointNode|null>(null);
  const [threshHoldLimits, setThresholdLimits] = React.useState<[number,number]>([NaN,NaN]);
  const context = React.useContext(GraphContext)

   React.useEffect(() => {
       if (guid === "")
           return;

       context.UpdateData(guid, {
           legend: createLegend(),
           getMax: (t) => (data == null || !enabled? -Infinity : Math.max(data.GetLimits(t[0],t[1])[1],threshHoldLimits[1])) ,
           getMin: (t) => (data == null || !enabled? Infinity : Math.min(data.GetLimits(t[0],t[1])[0],threshHoldLimits[0])),
       } as IDataSeries)
   }, [props, data, enabled])

   React.useEffect(() => {
       if (props.data.length === 0 || isNaN(context.XHover) || data === null)
           setHighlight([NaN, NaN]);
       else {
           const point = data.GetPoint(context.XHover);
           if (point != null)
               setHighlight(point);
       }
   }, [data, context.XHover])

   React.useEffect(() => {
      setData(new PointNode(props.data));
   },[props.data]);

   React.useEffect(() => {
       if (guid === "")
           return;
       context.SetLegend(guid, createLegend());

   }, [highlight, enabled, wLegend]);

   React.useEffect(() => {
     if (props.legend === undefined)
      return;
    if (props.highlightHover === undefined) {
      setWLegend(GetTextWidth("Segoe UI", '1em', props.legend) + 45);
      return;
    }
    const txt = props.legend + ` (${moment().format('MM/DD/YY hh:mm:ss')}: ${(-99.999999).toPrecision(8)})`
    setWLegend(GetTextWidth("Segoe UI", '1em', txt) + 45);

   }, [props.legend, props.highlightHover])

   React.useEffect(() => {
       setGuid(context.AddData({
           legend: createLegend(),
           getMax: (t) => (data == null || !enabled? -Infinity : Math.max(data.GetLimits(t[0],t[1])[1],threshHoldLimits[1])) ,
           getMin: (t) => (data == null || !enabled? Infinity : Math.min(data.GetLimits(t[0],t[1])[0],threshHoldLimits[0])),
       } as IDataSeries))
       return () => { context.RemoveData(guid) }
   }, []);

   React.useEffect(()=> {
     setThresholdLimits([Math.min(...props.threshHolds.map(t => t.Value)),Math.max(...props.threshHolds.map(t => t.Value)) ])
   }, [props.threshHolds]);

   function createLegend():  HTMLElement| React.ReactElement| JSX.Element| undefined {
     if (props.legend === undefined)
       return undefined;

     let txt = props.legend;

     if (props.highlightHover && !isNaN(highlight[0]) && !isNaN(highlight[1]))
      txt = txt + ` (${moment.utc(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1].toPrecision(6)})`

       return (
           <div onClick={() => setEnabled((e) => !e)} style={{ width: wLegend, display: 'flex', alignItems: 'center', marginRight: '20px' }}>
              {(props.lineStyle === '-' ?
                <div style={{ width: ' 10px', height: 0, borderTop: '2px solid', borderRight: '10px solid', borderBottom: '2px solid', borderLeft: '10px solid', borderColor: props.color, overflow: 'hidden', marginRight: '5px', opacity: (enabled? 1 : 0.5) }}></div> :
                <div style={{ width: ' 10px', height: '4px', borderTop: '0px solid', borderRight: '3px solid', borderBottom: '0px solid', borderLeft: '3px solid', borderColor: props.color, overflow: 'hidden', marginRight: '5px', opacity: (enabled? 1 : 0.5) }}></div>
              )}
              <label style={{ marginTop: '0.5rem' }}> {txt}</label>
           </div>
       );
   }

   function generateData() {
       let result = "M ";
       if (data == null)
        return ""
     result = result + data!.GetFullData().map((pt, _) => {
           const x = context.XTransformation(pt[0]);
           const y = context.YTransformation(pt[1]);

           return `${x},${y}`
       }).join(" L ")

       return result
   }


   return (
       enabled?
       <g>
           <path d={generateData()} style={{ fill: 'none', strokeWidth: 3, stroke: props.color, transition: 'd 0.5s' }} strokeDasharray={props.lineStyle === ':'? '10,5' : 'none'} />
           {data != null? data.GetFullData().map((pt, i) => <circle key={i} r={3} cx={context.XTransformation(pt[0])} cy={context.YTransformation(pt[1])} fill={props.color} stroke={'black'} style={{ opacity: 0.8, transition: 'cx 0.5s,cy 0.5s' }} />) : null}
           {props.highlightHover && !isNaN(highlight[0]) && !isNaN(highlight[1])?
          <circle r={5} cx={context.XTransformation(highlight[0])} cy={context.YTransformation(highlight[1])} fill={props.color} stroke={'black'} style={{ opacity: 0.8, transition: 'cx 0.5s,cy 0.5s' }} /> : null}
          {props.threshHolds.map((t,i) => <path key={i}
             d={`M ${context.XTransformation(context.XDomain[0])},${context.YTransformation(t.Value)} H ${context.XTransformation(context.XDomain[1])}`}
             style={{ fill: 'none', strokeWidth: 3, stroke: t.Color, transition: 'd 0.5s' }} strokeDasharray={'10,5'} />)}
       </g > : null
   );
}

export default LineWithThreshold;
