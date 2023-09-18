﻿// ******************************************************************************************************
//  ValueAxis.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  03/19/2021 - C. lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import {AxisIdentifier, AxisMap, GraphContext} from './GraphContext'
import {GetTextHeight, GetTextWidth} from '@gpa-gemstone/helper-functions';

interface IProps {
  hAxis: number,
  hFactor: number,
  setHeightFactor: (h:number) => void,
  setWidthAxis: (w: number) => void,
  offsetTop: number,
  offsetBottom: number,
  offsetLeft: number,
  offsetRight: number,
  height: number,
  width: number,
  useFactor: boolean,
  showGrid?: boolean,
  label?: string,
  axis?: AxisIdentifier
}

function ValueAxis(props: IProps) {
  const context = React.useContext(GraphContext)
  const [tick,setTick] = React.useState<number[]>([]);

  const [hLabel, setHlabel] = React.useState<number>(0);
  const [ftSizeLabel, setFtSizeLabel] = React.useState<number>(1);
  const [hAxis, setHAxis] = React.useState<number>(0);

  const [nDigits, setNdigits] = React.useState<number>(1);
  const [factor, setFactor] = React.useState<number>(1);

  React.useEffect(() => {
    const axis = AxisMap.get(props.axis);
    const dY = context.YDomain[axis][1] - context.YDomain[axis][0];
    let newTicks;
    if (dY === 0) {
      newTicks = [context.YDomain[axis][0]]
    }
    else {

      let exp = 0;
      while ((dY*Math.pow(10,exp)) < 1) {
          exp = exp + 1;
      }
      while ((dY * Math.pow(10, exp)) > 10) {
          exp = exp - 1;
      }

      let scale = 1.0 / Math.pow(10, exp);
      if (dY * Math.pow(10, exp) < 6 && dY * Math.pow(10, exp) >= 2.5)
          scale = 0.5 / Math.pow(10, exp);
      if (dY * Math.pow(10, exp) < 2.5 && dY * Math.pow(10, exp) >= 1.2)
          scale = 0.2 / Math.pow(10, exp);
      if (dY * Math.pow(10, exp) < 1.2)
          scale = 0.1 / Math.pow(10, exp);

      const offset = Math.floor(context.YDomain[axis][0]/scale)*scale;

      newTicks = [offset + scale];
      while (newTicks[newTicks.length - 1] < (context.YDomain[axis][1] - scale))
          newTicks.push(newTicks[newTicks.length - 1] + scale);
    }

    let expF = 0;
    const Ymax = Math.max(Math.abs(context.YDomain[axis][0]),Math.abs(context.YDomain[axis][1]));
    while ((Ymax*Math.pow(10,expF)) < 1) {
        expF = expF + 1;
    }
    while ((Ymax * Math.pow(10, expF)) > 10) {
        expF = expF - 1;
    }

    expF =  Math.sign(expF)*(Math.floor(Math.abs(expF) / 3) ) * 3;

    // adjust to avoid same value on axis scenario
    if (dY*Math.pow(10,expF) < 0.1 && dY !== 0)
      expF = expF + 3;

    if (props.useFactor)
      setFactor(Math.pow(10,expF));
    else
      setFactor(1);

    setTick(newTicks);

  }, [context.YDomain, props.useFactor, props.axis]);

    React.useEffect(() => {
      const axis = AxisMap.get(props.axis);
      let dY = context.YDomain[axis][1] - context.YDomain[axis][0];
      dY = dY * factor;
      if (dY === 0)
        dY = Math.abs(context.YDomain[axis][0]*factor);

      if (dY >= 15)
          setNdigits(0);
      if (dY < 15 && dY >= 1.5)
          setNdigits(1);
      if (dY < 1.5 && dY >= 0.15)
          setNdigits(2);
      if (dY < 0.15)
          setNdigits(3)
      if (dY < 0.015)
        setNdigits(4)
      if (dY < 0.0015)
        setNdigits(5);
      if (dY === 0)
        setNdigits(2);

    }, [factor, context.YDomain, props.axis])

    React.useEffect(() => {
      let h = 0;
      if (factor !== 1)
        h = GetTextHeight("Segoe UI", '1em', 'x' + (1/factor).toString());
      if (h !== props.hFactor)
        props.setHeightFactor(h);
    }, [factor, props.hFactor, props.setHeightFactor]);

    React.useEffect(() => {
      if (props.label === undefined) {
        setHlabel(0);
        return;
      }
      const h = GetTextHeight("Segoe UI", ftSizeLabel + 'em', props.label) + 4;
      setHlabel(h);
    },[props.label, props.height, props.offsetTop, props.offsetBottom, ftSizeLabel]);

    React.useEffect(() => {
        let dY = Math.max(...tick.map(t => GetTextWidth("Segoe UI", '1em', (t * factor).toFixed(nDigits))));
        dY = (isFinite(dY)? dY : 0) + 8
        if (dY !== hAxis)
            setHAxis(dY);
    },[tick, nDigits])

    React.useEffect(() => {
      if (props.hAxis !== hAxis + hLabel)
        props.setWidthAxis(hAxis + hLabel);

    },[hAxis, hLabel, props.hAxis]);

    React.useEffect(() => {
      if (props.label === undefined)
        return;
      let h = GetTextWidth("Segoe UI", '1em', props.label);
      let size = 1;

      while (h > props.height && size > 0.1) {
        size = size - 0.1;
        h = GetTextWidth("Segoe UI", size + 'em', props.label);
      }
      if (ftSizeLabel !== size)
          setFtSizeLabel(size);

    }, [props.label, props.height]);

    const leftPosition = React.useMemo(() => {
      if (props.axis === undefined || props.axis === 'left')
        return props.offsetLeft;
      else
        return props.width - props.offsetRight
    }, [props.offsetLeft, props.offsetRight, props.width, props.axis]);

    const tickDirection = React.useMemo(() => {
      if (props.axis === undefined || props.axis === 'left')
        return -1;
      else
        return 1
    }, [props.axis]);

    return (<g>
      <path stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${leftPosition} ${props.height - props.offsetBottom + 8} V ${props.offsetTop}`} />
      <path stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${leftPosition} ${props.offsetTop} h ${tickDirection * 8}`} />
      {tick.map((l, i) => <path key={i} stroke={((props.axis === undefined || props.axis === 'left') ? 'lightgrey' : 'darkgrey')} strokeOpacity={props.showGrid ? '0.8':'0.0'} style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${props.offsetLeft} ${context.YTransformation(l, AxisMap.get(props.axis))} h ${props.width - props.offsetLeft - props.offsetRight}`} />)}
      {tick.map((l, i) => <path key={i} stroke='black' style={{ strokeWidth: 1, transition: 'd 1s' }} d={`M ${leftPosition} ${context.YTransformation(l, AxisMap.get(props.axis))} h ${tickDirection * 6}`} />)}
      {tick.map((l, i) => <text fill={'black'} key={i} style={{ fontSize: '1em', textAnchor: (props.axis === undefined || props.axis === 'left') ? 'end' : 'start', transition: 'x 0.5s, y 0.5s' }} dominantBaseline={'middle'} x={leftPosition + tickDirection * 8} y={context.YTransformation(l, AxisMap.get(props.axis))}>{(l * factor).toFixed(nDigits)}</text>)}

      {props.label !== undefined ? <text fill={'black'} style={{ fontSize: ftSizeLabel + 'em', textAnchor: 'middle'}} dominantBaseline={'text-bottom'}
      transform={`rotate(${tickDirection*90},${leftPosition + tickDirection*(hAxis + 4)},${(props.offsetTop  - props.offsetBottom + props.height)/ 2.0})`} x={leftPosition + tickDirection*(hAxis + 4)} y={(props.offsetTop  - props.offsetBottom + props.height)/ 2.0}>{props.label}</text> : null}
      {factor !== 1 ? <text fill={'black'} style={{ fontSize: '1em' }} x={leftPosition} y={props.offsetTop - 5}>x{1/factor}</text> : null}
    </g>)
}

export default React.memo(ValueAxis);