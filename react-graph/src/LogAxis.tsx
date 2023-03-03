// ******************************************************************************************************
//  LogAxis.tsx - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  08/18/2021 - C Lackner
//       Generated original version of source code.
//
//  06/27/2022 - A Hagemeyer
//       Changed to support Logarithmic scale as X Axis
//
// ******************************************************************************************************

import * as React from 'react';
import { GraphContext } from './GraphContext';
import { GetTextHeight } from '@gpa-gemstone/helper-functions';

export interface IProps {
    offsetLeft: number,
    offsetRight: number,
    offsetBottom: number,
    offsetTop: number,
    heightAxis: number,
    height: number,
    width: number,
    setHeight: (h: number) => void,
    showGrid?: boolean,
    useFactor?: boolean,
    showTicks?: boolean,
    label?: string
}


function LogAxis(props: IProps) {
    /*
       Used on the bottom of the plot
    */
   const context = React.useContext(GraphContext);
   const [tick,setTick] = React.useState<number[]>([]);
   const [hLabel, setHlabel] = React.useState<number>(0);
   const [hAxis, setHAxis] = React.useState<number>(0);

   const [nDigits, setNdigits] = React.useState<number>(1);
   const [factor, setFactor] = React.useState<number>(1);
   
   // Adjusting for x axis label
   React.useEffect(() => {
    const dX = (props.label !== undefined ? GetTextHeight("Segoe UI", "1em", props.label) : 0);
    setHlabel(dX)
   }, [tick, props.label])

   // Adjusting for x axis tick labels the "..." operator simply grabs array of ticks
   React.useEffect(() => {
    let dX = Math.max(...tick.map(t => GetTextHeight("Segoe UI", '1em', t.toString())));
    dX = (isFinite(dX) ? dX : 0) + 12;
    setHAxis(dX)
   }, [tick])

   // Resizing if the label and ticks are not the correct height
   React.useEffect(() => {
    if (hAxis + hLabel !== props.heightAxis)
        props.setHeight(hAxis + hLabel);
   }, [hAxis, hLabel, props.heightAxis, props.setHeight])

   React.useEffect(() => {

    if (context.XDomain[0] <= 0) {
      context.XDomain[0] = Math.pow(10, Math.floor(Math.log10(Math.abs(context.XDomain[0])) * -1));
    }

    if (context.XDomain[1] <= 0) {
      context.XDomain[1] = Math.pow(10, (Math.ceil(Math.log10(Math.abs(context.XDomain[1]))) * -1) + 1);
    }
    let newTicks;
    const XMax = Math.ceil(Math.max(Math.log10(context.XDomain[0]), Math.log10(context.XDomain[1])));
    const XMin = Math.floor(Math.min(Math.log10(context.XDomain[0]), Math.log10(context.XDomain[1])));
    const dV = XMax - (XMin);

    if (dV === 0){
      if (context.XDomain[0] < 0)
        newTicks = [Math.pow(10, Math.floor(Math.log10(Math.abs(context.XDomain[0]))*-1)), Math.pow(10, Math.abs(Math.ceil(Math.log10(context.XDomain[1]))))];

      else 
        newTicks = [Math.pow(10, Math.log10(context.XDomain[0]))];
    }
    else {

      let scale = 1.0;
      if (dV < 3)
        scale = 0.25;
      if (dV >= 3 && dV < 6)
        scale = 0.5;

      const offset = Math.floor(dV / 4);
      newTicks = [Math.pow(10, XMin)];
      if (dV >= 6) {
        for (let i = Math.floor(Math.log10(context.XDomain[0])) + (scale*offset); i <= Math.ceil(Math.log10(context.XDomain[1])) + scale; i+=(scale*offset)) {
          newTicks.push(Math.pow(10, i));
        }
      }
      if (dV < 6 && dV >= 3) {
        for (let i = XMin + (scale); i <= XMax; i+=(scale)) {
          if (!Number.isInteger(i) && i > 1) {
            const lower = Math.floor(Math.pow(10, i) / Math.pow(10, Math.ceil(i))) * Math.pow(10, Math.ceil(i));
            const upper = Math.ceil(Math.pow(10, i) / Math.pow(10, Math.floor(i))) * Math.pow(10, Math.floor(i));
            if (Math.abs(upper - Math.pow(10, i)) < Math.abs(lower - Math.pow(10, i)))
              newTicks.push(upper);
            else
              newTicks.push(lower);
          }
          else 
            newTicks.push(Math.pow(10, i));
        }
      }
      if (dV < 3) {
        for (let i = XMin + (scale * (dV/2)); i <= XMax; i+=(scale*(dV/2))) {
            newTicks.push(Math.pow(10, i))
        }
      }
    }
    
    // If first Tick is outside visible move it to zero crossing
    setTick(newTicks.map(t => Math.max(t,context.XDomain[0])));
    }, [context.XDomain]);

    function getDigits(x: number): number {
      let d;
      if (x >= 1)
        d = 0;
      else if (Math.floor(Math.abs(-Math.log10(x))) > 100)
        d = 100;
      else
        d = Math.abs(Math.floor(Math.log10(x)));
      return d;
    }

    return (<g>
    <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft - 8} ${props.height - props.offsetBottom} H ${props.width - props.offsetRight}`}/>
    <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.width - props.offsetRight} ${props.height - props.offsetBottom} v ${8}`} />
    {props.showTicks === undefined || props.showTicks ?
        <>
            {tick.map((l, i) => <path key={i} stroke='lightgrey' strokeOpacity={props.showGrid? '0.8':'0.0'} style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom} V ${props.offsetTop}`} />)}
            {tick.map((l, i) => <path key={i} stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom + 6} v ${-6}`} />)}
            {tick.map((l, i) => <text fill={'black'} key={i} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'hanging', transition: 'x 0.5s, y 0.5s' }} y={props.height - props.offsetBottom + 8} x={context.XTransformation(l)}>{(l.toFixed(getDigits(l)))}</text>)}
        </>
        : null}
    {props.label !== undefined ? <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.offsetLeft + (( props.width - props.offsetLeft - props.offsetRight) / 2)}
    y={props.height - props.offsetBottom + hAxis}>{props.label}</text> : null}

   </g>)

}


export default LogAxis;

