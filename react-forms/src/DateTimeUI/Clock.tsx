// ******************************************************************************************************
//  Clock.tsx - Gbtc
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
//  05/15/2023 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as moment from 'moment';

interface IProps {
  DateTime: moment.Moment
  Setter: (record: moment.Moment) => void;
}

type Parameter = ('h'|'m'|'s');

export default function Clock(props: IProps) {
  const [hour, setHour] = React.useState<string>(props.DateTime.format("HH"));
  const [minute, setMinute] = React.useState<string>(props.DateTime.format("mm"));
  const [second, setSecond] = React.useState<string>(props.DateTime.format("ss"));
  const [hover, setHover] = React.useState<'increase_s'|'increase_m'|'increase_h'|'decrease_s'|'decrease_m'|'decrease_h'|'none'>('none');
  
  React.useEffect(() => {
    setHour(props.DateTime.format("HH"));
    setMinute(props.DateTime.format("mm"))
    setSecond(props.DateTime.format("ss"))
  }, [props.DateTime])

  React.useEffect(() => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    const s = parseInt(second, 10);

    if (h !== props.DateTime.hour() || m !== props.DateTime.minute() || s !== props.DateTime.second()) {
      const d = moment(props.DateTime);
      d.hour(h).minute(m).second(s);
      props.Setter(d);
    }

  }, [hour, minute,second])

  function increase(type: Parameter) {
    const d = moment(props.DateTime).add(1,type);
    setHour(d.format("HH"));
  }

  function decrease(type: Parameter) {
    const d = moment(props.DateTime).subtract(1,type);
    setHour(d.format("HH"));
  }

  return (
    <div style={{ background: '#f0f0f0', marginTop: 10, opacity: 1}}>
    <table style={{textAlign: 'center'}}>
      <tbody>
        <tr style={{height: 20, lineHeight: '20px'}}>
          <td 
            style={{ width: 50, padding: 5, cursor: 'pointer', background: (hover === 'increase_h'? '#d3d3d3' : undefined) }}
            onClick={() => increase('h')}
            onMouseEnter={() => setHover('increase_h')}
            onMouseLeave={() => setHover('none')}
            > ^ </td>
          <td style={{ width: 20, padding: 5 }}></td>
          <td 
            style={{ width: 50, padding: 5, cursor: 'pointer', background: (hover === 'increase_m'? '#d3d3d3' : undefined) }}
            onClick={() => increase('m')}
            onMouseEnter={() => setHover('increase_m')}
            onMouseLeave={() => setHover('none')}
          > ^ </td>
          <td style={{ width: 20, padding: 5, }}></td>
          <td 
            style={{ width: 50, padding: 5, cursor: 'pointer', background: (hover === 'increase_s'? '#d3d3d3' : undefined) }}
            onClick={() => increase('s')}
            onMouseEnter={() => setHover('increase_s')}
            onMouseLeave={() => setHover('none')}
            > ^ </td>
        </tr>
        <tr style={{height: 20, lineHeight: '20px'}}>
          <td style={{ width: 50, padding: 5, }}> {hour} </td>
          <td style={{ width: 20, padding: 5, }}> : </td>
          <td style={{ width: 50, padding: 5, }}> {minute} </td>
          <td style={{ width: 20, padding: 5, }}> : </td>
          <td style={{ width: 50, padding: 5, }}> {second} </td>
        </tr>
        <tr style={{height: 20, lineHeight: '20px'}}>
          <td 
            style={{ width: 50, padding: 5, cursor: 'pointer', background: (hover === 'decrease_h'? '#d3d3d3' : undefined) }}
            onClick={() => decrease('h')}
            onMouseEnter={() => setHover('decrease_h')}
            onMouseLeave={() => setHover('none')}
            > v </td>
          <td style={{ width: 20, padding: 5, }}></td>
          <td 
            style={{ width: 50, padding: 5, cursor: 'pointer', background: (hover === 'decrease_m'? '#d3d3d3' : undefined) }}
            onClick={() => decrease('m')}
            onMouseEnter={() => setHover('decrease_m')}
            onMouseLeave={() => setHover('none')}
            > v </td>
          <td style={{ width: 20, padding: 5, }}></td>
          <td 
            style={{ width: 50, padding: 5, cursor: 'pointer', background: (hover === 'decrease_s'? '#d3d3d3' : undefined) }}
            onClick={() => decrease('s')}
            onMouseEnter={() => setHover('decrease_s')}
            onMouseLeave={() => setHover('none')}
            > v </td>
        </tr>
      </tbody>
    </table>
  </div>
  );
}



