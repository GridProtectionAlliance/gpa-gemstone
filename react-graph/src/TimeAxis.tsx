﻿// ******************************************************************************************************
//  TimeAxis.tsx - Gbtc
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
import {GraphContext} from './GraphContext'
import * as moment from 'moment';
import {GetTextHeight} from '@gpa-gemstone/helper-functions';
import { cloneDeep } from 'lodash';

export interface IProps {
  offsetLeft: number,
  offsetRight: number,
  offsetBottom: number,
  heightAxis: number,
  height: number
  width: number,
  setHeight: (h: number) => void,
  label?: string,
  showTicks?: boolean
}

const msPerSecond = 1000.00;
const msPerMinute = msPerSecond* 60.0;
const msPerHour = msPerMinute* 60.0;
const msPerDay = msPerHour* 24.0;
const msPerYear = msPerDay* 365;

type TimeStep = ('y'|'M'|'w'|'d'|'h'|'m'|'s'|'ms');

function TimeAxis(props: IProps) {
    /*
      Used on bottom of Plot.
    */
    const context = React.useContext(GraphContext)
    const [tick,setTick] = React.useState<number[]>([]);
    const [hLabel, setHlabel] = React.useState<number>(0);
    const [hAxis, setHAxis] = React.useState<number>(0);
    const [tFormat, setTformat] = React.useState<string>('YYYY');

    // Adjust space for X Axis labels
    React.useEffect(() => {
      const dX =  (props.label !== undefined? GetTextHeight("Segoe UI", '1em', props.label + GetUnitLabel()) : 0);
      setHlabel(dX)
    }, [tick,props.label,tFormat]);

    // Adjust space for X Tick labels
    React.useEffect(() => {
      let dX = Math.max(...tick.map(t => GetTextHeight("Segoe UI", '1em', formatTS(t))));
      dX = (isFinite(dX) ? dX : 0) + 12
      setHAxis(dX);
    },[tick,tFormat]);

    React.useEffect(()=> {
      if (hAxis + hLabel !== props.heightAxis)
        props.setHeight(hAxis + hLabel);
    }, [hAxis,hLabel, props.heightAxis, props.setHeight])

    React.useEffect(() => {
      const deltaT = context.XDomain[1] - context.XDomain[0];
      if (deltaT === 0)
        return;

      let format = 'YYYY'
      if (deltaT < msPerYear*15 && deltaT >= msPerYear)
        format = 'MM YY';
      if (deltaT < msPerYear && deltaT >= 30 * msPerDay)
        format = 'MM/DD';
      if (deltaT < 30 * msPerDay && deltaT >=  2* msPerDay)
        format = 'MM/DD HH';
      if (deltaT < 2* msPerDay && deltaT >=  30* msPerHour)
        format = 'HH';
      if (deltaT < 30* msPerHour && deltaT >=  msPerHour)
        format = 'HH:mm';
      if (deltaT < msPerHour && deltaT >=  30* msPerMinute)
        format = 'mm';
      if (deltaT < 30* msPerMinute && deltaT >=   msPerMinute)
        format = 'mm:ss';
      if (deltaT < 30*msPerSecond && deltaT >=  msPerSecond)
        format = 'ss.SS';
      if (deltaT < msPerSecond)
        format = 'SSS';

      const Tstart = moment.utc(context.XDomain[0]);
      const Tend = moment.utc(context.XDomain[1]);
      const Tdiff = moment.duration(moment.utc(context.XDomain[1]).diff(moment.utc(context.XDomain[0])));
      const Ttick = cloneDeep(Tstart);
      let step = 10;
      let stepType: TimeStep = 'y'

      if (Tdiff.asYears() >= 70) {
        step = 10;
        stepType = 'y';
        setTopOfYear(Ttick);
        Ttick.year(Math.floor((Ttick.year()) / 10.0) * 10.0);
      }
      if (Tdiff.asYears() < 70 && Tdiff.asYears() >=40 ) {
        step = 5;
        setTopOfYear(Ttick);
        Ttick.year(Math.floor((Ttick.year()) / 5.0) * 5.0);
      }
      if (Tdiff.asYears() < 40 && Tdiff.asYears() >=15 ) {
        step = 2;
        setTopOfYear(Ttick);
        Ttick.year(Math.floor((Ttick.year()) / 2.0) * 2.0);
      }
      if (Tdiff.asYears() < 15 && Tdiff.asYears() >= 6) {
        stepType = 'M';
        step = 12;
        setTopOfYear(Ttick);
      }
      if (Tdiff.asYears() < 6 && Tdiff.asYears() >= 4) {
        stepType = 'M';
        step = 6;
        setTopOfMonth(Ttick);
        Ttick.month(Math.floor((Ttick.month()) / 6.0) * 6.0);
      }
      if (Tdiff.asYears() < 4 && Tdiff.asYears() >= 1.5) {
        stepType = 'M';
        step = 3;
        setTopOfMonth(Ttick);
        Ttick.month(Math.floor((Ttick.month()) / 3.0) * 3.0);
      }
      if (Tdiff.asYears() < 1.5 && Tdiff.asMonths() >= 6) {
        stepType = 'M';
        step = 1;
        setTopOfMonth(Ttick);
      }
      if (Tdiff.asMonths() < 6 && Tdiff.asMonths() >= 2) {
        stepType = 'w';
        step = 2;
        setTopOfWeek(Ttick);
      }
      if (Tdiff.asMonths() < 2 && Tdiff.asMonths() >= 1) {
        stepType = 'w';
        step = 1;
        setTopOfWeek(Ttick);
      }
      if (Tdiff.asMonths() < 1 && Tdiff.asDays() >= 16) {
        stepType = 'd';
        step = 2;
        setTopOfDay(Ttick);
      }
      if (Tdiff.asDays() < 16 && Tdiff.asDays() >= 10) {
        stepType = 'd';
        step = 1;
        setTopOfDay(Ttick);
      }
      if (Tdiff.asDays() < 10 && Tdiff.asDays() >= 3) {
        stepType = 'h';
        step = 12;
        setTopOfHour(Ttick);
        Ttick.hours(Math.floor((Ttick.hours()) / 12.0) * 12.0);

      }
      if (Tdiff.asDays() < 3 && Tdiff.asHours() >= 30) {
        stepType = 'h';
        step = 6;
        setTopOfHour(Ttick);
        Ttick.hours(Math.floor((Ttick.hours()) / 6.0) * 6.0)
      }
      if (Tdiff.asHours() < 30 && Tdiff.asHours() >= 18) {
        stepType = 'h';
        step = 3;
        setTopOfHour(Ttick);
        Ttick.hours(Math.floor((Ttick.hours()) / 3.0) * 3.0)
      }
      if (Tdiff.asHours() < 18 && Tdiff.asHours() >= 6) {
        stepType = 'h';
        step = 1;
        setTopOfHour(Ttick);
      }
      if (Tdiff.asHours() < 6 && Tdiff.asHours() >= 3) {
        stepType = 'm';
        step = 30;
        setTopOfMinute(Ttick);
        Ttick.minutes(Math.floor((Ttick.minutes()) / 30.0) * 30.0)
      }
      if (Tdiff.asHours() < 3 && Tdiff.asHours() >= 1) {
        stepType = 'm';
        step = 15;
        setTopOfMinute(Ttick);
        Ttick.minutes(Math.floor((Ttick.minutes()) / 15.0) * 15.0)
      }
      if (Tdiff.asHours() < 1 && Tdiff.asMinutes() >= 20) {
        stepType = 'm';
        step = 5;
        setTopOfMinute(Ttick);
        Ttick.minutes(Math.floor((Ttick.minutes()) / 5.0) * 5.0)
      }
      if (Tdiff.asMinutes() < 20 && Tdiff.asMinutes() >= 10) {
        stepType = 'm';
        step = 2;
        setTopOfMinute(Ttick);
        Ttick.minutes(Math.floor((Ttick.minutes()) / 2.0) * 2.0)
      }
      if (Tdiff.asMinutes() < 10 && Tdiff.asMinutes() >= 5) {
        stepType = 'm';
        step = 1;
        setTopOfMinute(Ttick);
      }
      if (Tdiff.asMinutes() < 5 && Tdiff.asMinutes() >= 2) {
        stepType = 's';
        step = 30;
        setTopOfSecond(Ttick);
        Ttick.second(Math.floor((Ttick.second()) / 30) * 30.0)
      }
      if (Tdiff.asMinutes() < 2 && Tdiff.asMinutes() >= 1) {
        stepType = 's';
        step = 15;
        setTopOfSecond(Ttick);
        Ttick.second(Math.floor((Ttick.second()) / 15) * 15.0)
      }
      if (Tdiff.asMinutes() < 1 && Tdiff.asSeconds() >= 30) {
        stepType = 's';
        step = 5;
        setTopOfSecond(Ttick);
        Ttick.second(Math.floor((Ttick.second()) / 5) * 5.0)
      }
      if (Tdiff.asSeconds() < 30 && Tdiff.asSeconds() >= 15) {
        stepType = 's';
        step = 2;
        setTopOfSecond(Ttick);
      }
      if (Tdiff.asSeconds() < 15 && Tdiff.asSeconds() >= 5) {
        stepType = 's';
        step = 1;
        setTopOfSecond(Ttick);
      }
      if (Tdiff.asSeconds() < 5 && Tdiff.asSeconds() >= 2) {
        stepType = 'ms';
        step = 500;
        setTopOfms(Ttick);
        Ttick.millisecond(Math.floor((Ttick.millisecond()) / 500) * 500.0)
      }
      if (Tdiff.asSeconds() < 2 && Tdiff.asSeconds() >= 1) {
        stepType = 'ms';
        step = 250;
        setTopOfms(Ttick);
        Ttick.millisecond(Math.floor((Ttick.millisecond()) / 250) * 250.0)
      }
      if (Tdiff.asSeconds() < 1 && Tdiff.asMilliseconds() >= 500) {
        stepType = 'ms';
        step = 100;
        setTopOfms(Ttick);
        Ttick.millisecond(Math.floor((Ttick.millisecond()) / 100) * 100.0)
      }
      if (Tdiff.asMilliseconds() < 500 && Tdiff.asMilliseconds() >= 100) {
        stepType = 'ms';
        step = 50;
        setTopOfms(Ttick);
        Ttick.millisecond(Math.floor((Ttick.millisecond()) / 50) * 50.0)
      }
      if (Tdiff.asMilliseconds() < 100 && Tdiff.asMilliseconds() >= 20) {
        stepType = 'ms';
        step = 10;
        setTopOfms(Ttick);
        Ttick.millisecond(Math.floor((Ttick.millisecond()) / 10) * 10.0)
      }
      if (Tdiff.asMilliseconds() < 20){
        stepType = 'ms';
        setTopOfms(Ttick);
        step = 1;
      }

      const newTicks = [Ttick.add(step, stepType)];
      while (newTicks[newTicks.length - 1] < Tend)
        newTicks.push(newTicks[newTicks.length - 1].clone().add(step, stepType));


      newTicks.pop();

      setTick(newTicks.map(t => t.valueOf()));

      setTformat(format);
    }, [context.XDomain]);

    function GetUnitLabel(): string {
      if (tFormat === 'SSS')
        return " (ms)";
      if (tFormat === 'ss.SS')
        return " (sec)";
      if (tFormat === 'mm:sss')
        return " (min:sec)";
      if (tFormat === 'mm')
        return " (min)";
      if (tFormat === 'HH:mm')
        return " (hour:min)";
      if (tFormat === 'HH')
        return " (hour)"
      if (tFormat === 'MM/DD HH')
        return " (month/day hour)"
      if (tFormat === 'MM/DD')
        return " (month/day)"

      return ""

    }

    function setTopOfms(d: moment.Moment) {
      d.milliseconds(Math.floor(d.millisecond()));
    }
    function setTopOfSecond(d: moment.Moment) {
      setTopOfms(d);
      d.milliseconds(0)
    }
    function setTopOfMinute(d: moment.Moment) {
      setTopOfSecond(d);
      d.seconds(0)
    }
    function setTopOfHour(d: moment.Moment) {
      setTopOfMinute(d);
      d.minutes(0)
    }
    function setTopOfDay(d: moment.Moment) {
      setTopOfHour(d);
      d.hours(0)
    }
    function setTopOfWeek(d: moment.Moment) {
      setTopOfDay(d);
      d.weekday(0)
    }
    function setTopOfMonth(d: moment.Moment) {
      setTopOfDay(d);
      d.date(1)
    }
    function setTopOfYear(d: moment.Moment) {
      setTopOfDay(d);
      d.dayOfYear(0)
    }


    function formatTS(t: number): string {
      const TS = moment.utc(t);
      return TS.format(tFormat);
    }

    return (<g>
     <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft - 8} ${props.height - props.offsetBottom} H ${props.width - props.offsetRight}`} />
     <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.width - props.offsetRight} ${props.height - props.offsetBottom} v ${8}`} />
     {props.showTicks === undefined || props.showTicks ?
         <>
             {tick.map((l, i) => <path key={i} stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${l * context.XScale + context.XOffset} ${props.height - props.offsetBottom + 6} v ${-6}`} />)}
             {tick.map((l, i) => <text fill={'black'} key={i} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'hanging', transition: 'x 0.5s, y 0.5s' }} y={props.height - props.offsetBottom + 8} x={l * context.XScale + context.XOffset}>{formatTS(l)}</text>)}
         </>
         : null}
     {props.label !== undefined? <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.offsetLeft + (( props.width- props.offsetLeft - props.offsetRight) / 2)}
      y={props.height - props.offsetBottom + hAxis}>{props.label + GetUnitLabel()}</text> : null}

    </g>)
}


export default TimeAxis;
