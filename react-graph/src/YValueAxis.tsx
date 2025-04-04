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
import { AxisIdentifier, AxisMap, GraphContext } from './GraphContext'
import { GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';

interface IProps {
  hAxis: number,
  hFactor: number,
  setHeightFactor: (h: number) => void,
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
  const [ticks, setTicks] = React.useState<number[]>([]);
  const [tickFontSize, setTickFontSize] = React.useState<number>(1);

  const [labelHeight, setLabelHeight] = React.useState<number>(0);
  const [labelFontSize, setLabelFontSize] = React.useState<number>(1);

  const [hAxis, setHAxis] = React.useState<number>(0);

  const [nDigits, setNdigits] = React.useState<number>(1);
  const [factor, setFactor] = React.useState<number>(1);

  //Effect to set the ticks
  React.useEffect(() => {
    const axis = AxisMap.get(props.axis);
    const dY = context.YDomain[axis][1] - context.YDomain[axis][0];
    if (!isFinite(dY) || isNaN(dY)) {
      setTicks([]);
      return;
    }

    let newTicks;
    if (dY === 0) {
      newTicks = [context.YDomain[axis][0]]
    }
    else {

      let exp = 0;
      while ((dY * Math.pow(10, exp)) < 1) {
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

      const offset = Math.floor(context.YDomain[axis][0] / scale) * scale;

      newTicks = [offset + scale];
      while (newTicks[newTicks.length - 1] < (context.YDomain[axis][1] - scale))
        newTicks.push(newTicks[newTicks.length - 1] + scale);
    }

    setTicks(newTicks)
  }, [context.YDomain, props.useFactor, props.axis, props.height]);

  React.useEffect(() => {
    if (ticks.length === 0) return;

    // Use first tick as they should all be same height
    const sampleLabel = (ticks[0] * factor).toFixed(nDigits);
    const availableHeightPerTick = props.height / ticks.length;

    let newFontSize = 1;
    let sampleHeight = GetTextHeight('Segoe UI', newFontSize + 'em', sampleLabel);

    // Decrease font size until we fit, down to a mini of 0.5em.
    while (sampleHeight > availableHeightPerTick && newFontSize > 0.5) {
      newFontSize = newFontSize - 0.05;
      sampleHeight = GetTextHeight('Segoe UI', newFontSize + 'em', sampleLabel);
    }

    setTickFontSize(newFontSize);
  }, [ticks, factor, nDigits, props.height]);

  //Effect to set the factor
  React.useEffect(() => {
    if (!props.useFactor) {
      setFactor(1)
      return
    }

    const axis = AxisMap.get(props.axis);
    const dY = context.YDomain[axis][1] - context.YDomain[axis][0];

    let expF = 0;
    const Ymax = Math.max(Math.abs(context.YDomain[axis][0]), Math.abs(context.YDomain[axis][1]));
    while ((Ymax * Math.pow(10, expF)) < 1) {
      expF = expF + 1;
    }
    while ((Ymax * Math.pow(10, expF)) > 10) {
      expF = expF - 1;
    }

    expF = Math.sign(expF) * (Math.floor(Math.abs(expF) / 3)) * 3;

    // adjust to avoid same value on axis scenario
    if (dY * Math.pow(10, expF) < 0.1 && dY !== 0)
      expF = expF + 3;

    setFactor(Math.pow(10, expF));
  }, [context.YDomain, props.useFactor, props.axis]);

  //Effect to set nDigitss
  React.useEffect(() => {
    const axis = AxisMap.get(props.axis);
    let dY = context.YDomain[axis][1] - context.YDomain[axis][0];
    dY = dY * factor;
    if (dY === 0)
      dY = Math.abs(context.YDomain[axis][0] * factor);

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
      h = GetTextHeight("Segoe UI", '1em', 'x' + (1 / factor).toString());
    if (h !== props.hFactor)
      props.setHeightFactor(h);
  }, [factor, props.hFactor, props.setHeightFactor]);

  React.useEffect(() => {
    if (props.label === undefined) {
      setLabelHeight(0);
      return;
    }
    const h = GetTextHeight("Segoe UI", labelFontSize + 'em', props.label) + 4;
    setLabelHeight(h);
  }, [props.label, props.height, props.offsetTop, props.offsetBottom, labelFontSize]);

  React.useEffect(() => {
    let dY = Math.max(...ticks.map(t => GetTextWidth("Segoe UI", '1em', (t * factor).toFixed(nDigits))));
    dY = (isFinite(dY) ? dY : 0) + 8
    if (dY !== hAxis)
      setHAxis(dY);
  }, [ticks, nDigits])

  React.useEffect(() => {
    if (props.hAxis !== hAxis + labelHeight)
      props.setWidthAxis(hAxis + labelHeight);

  }, [hAxis, labelHeight, props.hAxis]);

  // use effect resets us in case this becomes unmounted
  React.useEffect(() => {
    return () => props.setWidthAxis(0);
  }, []);

  React.useEffect(() => {
    if (props.label === undefined)
      return;

    let h = GetTextWidth("Segoe UI", '1em', props.label);
    let size = 1;

    while (h > props.height && size > 0.1) {
      size = size - 0.1;
      h = GetTextWidth("Segoe UI", size + 'em', props.label);
    }
    if (labelFontSize !== size)
      setLabelFontSize(size);

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

  return (
    <g>
      <path
        stroke='currentColor'
        style={{ strokeWidth: 1, transition: 'd 0.5s' }}
        d={`M ${leftPosition} ${props.height - props.offsetBottom + 8} V ${props.offsetTop}`}
      />

      <path
        stroke='currentColor'
        style={{ strokeWidth: 1, transition: 'd 0.5s' }}
        d={`M ${leftPosition} ${props.offsetTop} h ${tickDirection * 8}`}
      />

      {ticks.map((tick, i) =>
        <path
          key={i}
          stroke={((props.axis === undefined || props.axis === 'left') ? 'lightgrey' : 'darkgrey')}
          strokeOpacity={(props.showGrid ?? false) ? '0.8' : '0.0'}
          style={{ strokeWidth: 1, transition: 'd 0.5s' }}
          d={`M ${props.offsetLeft} ${context.YTransformation(tick, AxisMap.get(props.axis))} h ${props.width - props.offsetLeft - props.offsetRight}`}
        />
      )}

      {ticks.map((tick, i) =>
        <path
          key={i}
          stroke='currentColor'
          style={{ strokeWidth: 1, transition: 'd 1s' }}
          d={`M ${leftPosition} ${context.YTransformation(tick, AxisMap.get(props.axis))} h ${tickDirection * 6}`}
        />)}

      {ticks.map((tick, i) =>
        <text
          fill={'currentColor'}
          key={i}
          style={{ fontSize: `${tickFontSize}em`, textAnchor: (props.axis === undefined || props.axis === 'left') ? 'end' : 'start', transition: 'x 0.5s, y 0.5s' }}
          dominantBaseline={'middle'}
          x={leftPosition + tickDirection * 8}
          y={context.YTransformation(tick, AxisMap.get(props.axis))}
        >
          {(tick * factor).toFixed(nDigits)}
        </text>
      )}

      {props.label !== undefined ?
        <text
          fill={'currentColor'}
          style={{ fontSize: labelFontSize + 'em', textAnchor: 'middle' }}
          dominantBaseline={'text-bottom'}
          transform={`rotate(${tickDirection * 90},${leftPosition + tickDirection * (hAxis + 4)},${(props.offsetTop - props.offsetBottom + props.height) / 2.0})`}
          x={leftPosition + tickDirection * (hAxis + 4)}
          y={(props.offsetTop - props.offsetBottom + props.height) / 2.0}
        >
          {props.label}
        </text> : null}
      {factor !== 1 ?
        <text
          fill={'currentColor'}
          style={{ fontSize: '1em' }}
          x={leftPosition}
          y={props.offsetTop - 5}
        >
          x{1 / factor}
        </text> : null}
    </g>
  )
}

export default React.memo(ValueAxis);