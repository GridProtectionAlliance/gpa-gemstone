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
import { GraphContext } from './GraphContext'
import * as moment from 'moment';
import { GetTextHeight, GetTextWidth } from '@gpa-gemstone/helper-functions';
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
  showTicks?: boolean,
  showDate?: boolean,
  showRightMostTick?: boolean,
  showLeftMostTick?: boolean
}

const msPerSecond = 1000.00;
const msPerMinute = msPerSecond * 60.0;
const msPerHour = msPerMinute * 60.0;
const msPerDay = msPerHour * 24.0;
const msPerYear = msPerDay * 365;

type TimeStep = ('y' | 'M' | 'w' | 'd' | 'h' | 'm' | 's' | 'ms');
type TimeFormat = 'SSS' | 'ss.SS' | 'ss' | 'mm:ss' | 'mm' | 'HH:mm' | 'HH' | 'DD HH' | 'MM/DD' | 'MM YY' | 'YYYY';

function TimeAxis(props: IProps) {
  /*
    Used on bottom of Plot.
  */
  const context = React.useContext(GraphContext);

  const [ticks, setTicks] = React.useState<number[]>([]);
  const [tickFontSize, setTickFontSize] = React.useState<number>(1);

  const [axisHeight, setAxisHeight] = React.useState<number>(0);

  const [tickFormat, setTickFormat] = React.useState<TimeFormat>('YYYY');
  const [dFormat, setDformat] = React.useState<string>('');

  const [title, setTitle] = React.useState<string | undefined>('Time');

  // Adjust unit label
  React.useEffect(() => {
    if (props.label === undefined) {
      setTitle(undefined);
      return;
    }

    let titleFormat = "";
    let unitLabel = "";
    switch (tickFormat) {
      case ('SSS'):
        titleFormat = "MMM Do, YYYY HH:mm:ss";
        unitLabel = " (ms)";
        break;
      case ('ss.SS'):
        titleFormat = "MMM Do, YYYY HH:mm";
        unitLabel = " (sec.ms)";
        break;
      case ('ss'):
        titleFormat = "MMM Do, YYYY HH:mm";
        unitLabel = " (sec)";
        break;
      case ('mm:ss'):
        titleFormat = "MMM Do, YYYY HH";
        unitLabel = " (min:sec)";
        break;
      case ('mm'):
        titleFormat = "MMM Do, YYYY HH";
        unitLabel = " (min)";
        break;
      case ('HH:mm'):
        titleFormat = "MMM Do, YYYY";
        unitLabel = " (hour:min)";
        break;
      case ('HH'):
        titleFormat = "MMM Do, YYYY";
        unitLabel = " (hour)";
        break;
      case ('DD HH'):
        titleFormat = "MMM YYYY";
        unitLabel = " (day hour)";
        break;
      case ('MM/DD'):
        titleFormat = "YYYY";
        unitLabel = " (month/day)";
        break;
      case ('MM YY'):
        titleFormat = "";
        unitLabel = " (month year)";
        break;
      case ('YYYY'):
        titleFormat = "";
        unitLabel = " (year)";
        break;
      default:
        console.warn(`Unrecognized format: ${tickFormat}`);
        break;
    }

    if (props.label === '') {
      const formatedTitle = titleFormat === "" ? "Time" : formatTick(ticks[0], titleFormat);
      setTitle(formatedTitle + unitLabel);
    }
    else setTitle(props.label + unitLabel);
  }, [tickFormat, props.label, ticks]);

  // Adjust space for X Tick labels
  React.useEffect(() => {
    let dX = Math.max(...ticks.map(t => GetTextHeight("Segoe UI", '1em', formatTick(t, tickFormat))));
    dX = (isFinite(dX) ? dX : 0) + 12
    setAxisHeight(dX);
  }, [ticks, tickFormat]);

  React.useEffect(() => {
    const titleHeight = title !== undefined ? GetTextHeight("Segoe UI", '1em', title) : 0
    if (axisHeight + titleHeight !== props.heightAxis)
      props.setHeight(axisHeight + titleHeight);
  }, [axisHeight, title, props.heightAxis, props.setHeight])

  React.useEffect(() => {
    const deltaT = context.XDomain[1] - context.XDomain[0];
    if (deltaT === 0)
      return;

    let format: TimeFormat = 'YYYY';
    let dateFormat = '';
    if (deltaT < msPerYear * 15 && deltaT >= msPerYear) {
      format = 'MM YY';
      dateFormat = '';
    }
    if (deltaT < msPerYear && deltaT >= 30 * msPerDay) {
      format = 'MM/DD';
      dateFormat = 'YY';
    }
    if (deltaT < 30 * msPerDay && deltaT >= 2 * msPerDay) {
      format = 'DD HH';
      dateFormat = 'YY';
    }
    if (deltaT < 2 * msPerDay && deltaT >= 30 * msPerHour) {
      format = 'HH';
      dateFormat = 'MM/DD';
    }
    if (deltaT < 30 * msPerHour && deltaT >= msPerHour) {
      format = 'HH:mm';
      dateFormat = 'MM/DD';
    }
    if (deltaT < msPerHour && deltaT >= 30 * msPerMinute) {
      format = 'mm';
      dateFormat = 'MM/DD HH';
    }
    if (deltaT < 30 * msPerMinute && deltaT >= msPerMinute) {
      format = 'mm:ss';
      dateFormat = 'MM/DD HH';
    }
    if (deltaT < msPerMinute && deltaT >= 30 * msPerSecond) {
      format = 'ss';
      dateFormat = 'MM/DD HH:mm';
    }
    if (deltaT < 30 * msPerSecond && deltaT >= msPerSecond) {
      format = 'ss.SS';
      dateFormat = 'MM/DD HH:mm';
    }
    if (deltaT < msPerSecond) {
      format = 'SSS';
      dateFormat = 'MM/DD HH:mm:ss';
    }

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
    if (Tdiff.asYears() < 70 && Tdiff.asYears() >= 40) {
      step = 5;
      setTopOfYear(Ttick);
      Ttick.year(Math.floor((Ttick.year()) / 5.0) * 5.0);
    }
    if (Tdiff.asYears() < 40 && Tdiff.asYears() >= 15) {
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
    if (Tdiff.asMilliseconds() < 20) {
      stepType = 'ms';
      setTopOfms(Ttick);
      step = 1;
    }

    const newTicks = [Ttick.add(step, stepType)];
    while (newTicks[newTicks.length - 1] < Tend)
      newTicks.push(newTicks[newTicks.length - 1].clone().add(step, stepType));


    newTicks.pop();

    setTicks(newTicks.map(t => t.valueOf()));

    setTickFormat(format);

    if (props.showDate ?? false) setDformat(dateFormat);
    else setDformat('');
  }, [context.XDomain, props.showDate]);

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

  React.useEffect(() => {
    if (ticks.length === 0) return;

    // Use first tick as they should all be very similar in size
    const sampleLabel = formatTick(ticks[0], tickFormat);
    const availableWidth = props.width - props.offsetLeft - props.offsetRight - 10;
    const availableWidthPerTick = availableWidth / ticks.length;

    let newFontSize = 1;
    let sampleWidth = GetTextWidth('Segoe UI', newFontSize + 'em', sampleLabel);

    // Decrease font size until we fit, down to a mini of 0.5em.
    while (sampleWidth > availableWidthPerTick && newFontSize > 0.5) {
      newFontSize = newFontSize - 0.05;
      sampleWidth = GetTextWidth('Segoe UI', newFontSize + 'em', sampleLabel);
    }

    setTickFontSize(newFontSize);
  }, [ticks, props.width, props.offsetLeft, props.offsetRight, tickFormat]);

  return (
    <g>
      <path
        stroke='currentColor'
        style={{ strokeWidth: 1 }}
        d={`M ${props.offsetLeft - (props.showLeftMostTick ?? true ? 0 : 8)} ${props.height - props.offsetBottom} H ${props.width - props.offsetRight + (props.showRightMostTick ?? true ? 0 : 8)}`}
      />

      {props.showLeftMostTick ?? true ?
        <path
          stroke='currentColor'
          style={{ strokeWidth: 1 }}
          d={`M ${props.offsetLeft} ${props.height - props.offsetBottom} v ${8}`}
        />
        : null}

      {props.showRightMostTick ?? true ? <path
        stroke='currentColor'
        style={{ strokeWidth: 1 }}
        d={`M ${props.width - props.offsetRight} ${props.height - props.offsetBottom} v ${8}`}
      /> : null}

      {props.showTicks === undefined || props.showTicks ?
        <>
          {ticks.map((l, i) => <path key={i} stroke='currentColor' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${context.XTransformation(l)} ${props.height - props.offsetBottom + 6} v ${-6}`} />)}

          {ticks.map((l, i) =>
            <text
              fill={'currentColor'}
              key={i}
              fontSize={`${tickFontSize}em`}
              style={{ textAnchor: 'middle', dominantBaseline: 'hanging', transition: 'x 0.5s, y 0.5s' }}
              y={props.height - props.offsetBottom + 8}
              x={context.XTransformation(l)}
            >
              {formatTick(l, tickFormat)}
            </text>
          )}
        </>
        : null}

      {title !== undefined ?
        <text
          fill={'currentColor'}
          style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }}
          x={props.offsetLeft + ((props.width - props.offsetLeft - props.offsetRight) / 2)}
          y={props.height - props.offsetBottom + axisHeight}
        >
          {title}
        </text> : null}

      {(dFormat !== '' && ticks.length > 0) ?
        <text
          fill={'currentColor'}
          style={{ fontSize: '1em', textAnchor: 'end', dominantBaseline: 'middle' }}
          x={props.width - props.offsetRight}
          y={props.height - props.offsetBottom + axisHeight}
        >
          {formatTick(ticks[0], dFormat)}
        </text> : null}
    </g>)
}


function formatTick(t: number, f: string): string {
  const TS = moment.utc(t);
  return TS.format(f);
}

export default React.memo(TimeAxis);