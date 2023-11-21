// ******************************************************************************************************
//  HeatLegend.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  11/21/2023 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************


import * as React from 'react';
import { AxisIdentifier, AxisMap, GraphContext, LineStyle} from './GraphContext';
import { GetTextWidth, GetTextHeight } from '@gpa-gemstone/helper-functions';
import { CreateGuid } from '@gpa-gemstone/helper-functions';


export interface IProps {
  unitLabel?: string,
  minValue: number,
  minColor: string,
  maxValue: number,
  maxColor: string
}

const SvgStyle: React.CSSProperties = {
  fill: 'none',
  userSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  pointerEvents: 'none',
};

const TextStyle: React.CSSProperties = { 
  fontSize: '1em', 
  textAnchor: 'middle',
  dominantBaseline: 'hanging', 
  transition: 'x 0.5s, y 0.5s' 
};

function HeatLegend(props: IProps) {
  const ref = React.useRef(null);
  const [wLegend, setWLegend] = React.useState<number>(0);
  const [hLegend, setHLegend] = React.useState<number>(0);
  const [nDigits, setNdigits] = React.useState<number>(1);
  const [guid, setGuid] = React.useState<string>('');
  const context = React.useContext(GraphContext);

  React.useLayoutEffect(() => {
    setWLegend(((ref?.current as any)?.offsetWidth) ?? 0);
    setHLegend((ref?.current as any)?.offsetHeight ?? 0);
  });

  React.useEffect(() => {
    let delta = props.maxValue - props.minValue;
    if (delta === 0)
      delta = Math.abs(props.minValue);

    if (delta >= 15)
        setNdigits(0);
    if (delta < 15 && delta >= 1.5)
        setNdigits(1);
    if (delta < 1.5 && delta >= 0.15)
        setNdigits(2);
    if (delta < 0.15)
        setNdigits(3)
    if (delta < 0.015)
      setNdigits(4)
    if (delta < 0.0015)
      setNdigits(5);
    if (delta === 0)
      setNdigits(2);

  }, [props.maxValue, props.minValue])

  React.useEffect(() => {
      const id = CreateGuid();
      setGuid(id);
      context.RequestLegendWidth(50, id);
      return () => { context.RequestLegendWidth(-1, id); }
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', display: 'flex', alignItems: 'center', marginRight: '5px', height:'100%' }}>
      <svg style={SvgStyle} viewBox={`0 0 ${wLegend} ${hLegend}`}>
        <linearGradient id={guid}>
          <stop offset="5%" stopColor={props.minColor} />
          <stop offset="95%" stopColor={props.maxColor} />
        </linearGradient>
        <path stroke='black' fill={`url(#${guid})`} style={{ strokeWidth: 1, transition: 'd 0.5s' }} 
        d={wLegend < hLegend ? 
          `M ${0.05*wLegend} ${0.1*hLegend} H ${0.5*wLegend} V ${0.9*hLegend} H ${0.05*wLegend} V ${0.1*hLegend}` :
          `M ${0.1*wLegend} ${0.05*hLegend} H ${0.9*wLegend} V ${0.5*hLegend} H ${0.1*wLegend} V ${0.05*hLegend}`}/>
        <text fill={'black'} style={TextStyle} x={wLegend*(wLegend < hLegend ? 0.5 : 0.1)} y={hLegend*(wLegend < hLegend ? 0.1 : 0.5)}
        transform={`rotate(${wLegend < hLegend ? 90 : 0},${wLegend*(wLegend < hLegend ? 0.5 : 0.1)},${hLegend*(wLegend < hLegend ? 0.1 : 0.5)})`}>
          {`${props.minValue.toFixed(nDigits)}${props.unitLabel !== undefined ? ` (${props.unitLabel})` : ''}`}
        </text>
        <text fill={'black'} style={TextStyle} x={wLegend*(wLegend < hLegend ? 0.5 : 0.9)} y={hLegend*(wLegend < hLegend ? 0.9 : 0.5)}
        transform={`rotate(${wLegend < hLegend ? 90 : 0},${wLegend*(wLegend < hLegend ? 0.5 : 0.9)},${hLegend*(wLegend < hLegend ? 0.9 : 0.5)})`}>
          {`${props.maxValue.toFixed(nDigits)}${props.unitLabel !== undefined ? ` (${props.unitLabel})` : ''}`}
        </text>
      </svg>
    </div>
  );
}

export default HeatLegend;
