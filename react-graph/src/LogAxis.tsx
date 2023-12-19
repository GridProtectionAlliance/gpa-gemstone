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
    label?: string,
    showRightMostTick?: boolean,
    showLeftMostTick?: boolean
}


function LogAxis(props: IProps) {
    /*
       Used on the bottom of the plot
    */
   const context = React.useContext(GraphContext);
   const [tick,setTick] = React.useState<number[]>([]);
   const [hLabel, setHlabel] = React.useState<number>(0);
   const [hAxis, setHAxis] = React.useState<number>(0);
   const [deltaW, setDeltaW] = React.useState<number>(0);
   const [steps, setSteps] = React.useState<number>(0);
  const  [tickStart, setTickStart] = React.useState<number>(0);

   React.useEffect(() => {
    if (context.XDomain[0] <= 0) {
      context.XDomain[0] = Math.pow(10, Math.floor(Math.log10(Math.abs(context.XDomain[0])) * -1));
    }
    if (context.XDomain[1] <= 0) {
      context.XDomain[1] = Math.pow(10, (Math.ceil(Math.log10(Math.abs(context.XDomain[1]))) * -1) + 1);
    }
    const WMax = Math.ceil(Math.max(Math.log10(context.XDomain[0]), Math.log10(context.XDomain[1])));
    const WMin = Math.floor(Math.min(Math.log10(context.XDomain[0]), Math.log10(context.XDomain[1])));
    setDeltaW(WMax - WMin);
    setTickStart(WMin);
   }, [context.XDomain])

   React.useEffect(() => {
    // Steps only change after 300 ms to avoid jumping
    const h = setTimeout(() => {
      if (deltaW < 3)
        setSteps(0.25*(deltaW/2));
      else if (deltaW >= 3 && deltaW < 6)
        setSteps(0.5);
      else
        setSteps(Math.floor(deltaW / 4))
    },500)
    return () => { clearTimeout(h)}
   }, [deltaW])


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

    let newTicks;
    if (deltaW === 0 || steps === 0){
      if (context.XDomain[0] < 0)
        newTicks = [Math.pow(10, Math.floor(Math.log10(Math.abs(context.XDomain[0]))*-1)), Math.pow(10, Math.abs(Math.ceil(Math.log10(context.XDomain[1]))))];
      else 
        newTicks = [Math.pow(10, Math.log10(context.XDomain[0]))];
    }
    else {
      newTicks = [Math.pow(10, tickStart)];
      if (deltaW >= 3) { // scale == 1
        for (let i = tickStart + (steps); i <=  Math.log10(context.XDomain[1]) + steps; i+=(steps)) {
          if (!Number.isInteger(i) && i > 1 && deltaW > 3) {
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
      newTicks = newTicks.filter(t => t >= context.XDomain[0] && t <= context.XDomain[1]);

      // guarantee at least 3 ticks
      if (newTicks.length < 3) {
        const c = (Math.log10(context.XDomain[0]) + Math.log10(context.XDomain[1]))*0.5;
        newTicks = [context.XDomain[0],Math.pow(10,c),context.XDomain[1]];
      }
    }
    
    // If first Tick is outside visible move it to zero crossing
    setTick(newTicks.map(t => Math.max(t,context.XDomain[0])));
    }, [context.XDomain, deltaW]);

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
    <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft - (props.showLeftMostTick ?? true ? 0 : 8)} ${props.height - props.offsetBottom} H ${props.width - props.offsetRight + (props.showRightMostTick ?? true ? 0 : 8)}`}/>
    {props.showLeftMostTick ?? true ? <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft} ${props.height - props.offsetBottom} v ${8}`} /> : null}
    {props.showRightMostTick ?? true ? <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.width - props.offsetRight} ${props.height - props.offsetBottom} v ${8}`} /> : null}
    {props.showTicks === undefined || props.showTicks ?
        <>
            {tick.map((l, i) => <path key={(l.toFixed(50))} stroke='lightgrey' strokeOpacity={props.showGrid? '0.8':'0.0'} style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom} V ${props.offsetTop}`} />)}
            {tick.map((l, i) => <path key={(l.toFixed(50))} stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom + 6} v ${-6}`} />)}
            {tick.map((l, i) => <text fill={'black'} key={(l.toFixed(50))} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'hanging', transition: 'x 0.5s, y 0.5s' }} y={props.height - props.offsetBottom + 8} x={context.XTransformation(l)}>{(l.toFixed(getDigits(l)))}</text>)}
        </>
        : null}
    {props.label !== undefined ? <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.offsetLeft + (( props.width - props.offsetLeft - props.offsetRight) / 2)}
    y={props.height - props.offsetBottom + hAxis}>{props.label}</text> : null}

   </g>)

}


export default React.memo(LogAxis);

