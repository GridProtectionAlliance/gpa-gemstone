// ******************************************************************************************************
//  Calender.tsx - Gbtc
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

interface IWeek {
  sunday: moment.Moment,
  monday:  moment.Moment,
  tuesday: moment.Moment,
  wednesday: moment.Moment,
  thursday: moment.Moment,
  friday: moment.Moment,
  saturday: moment.Moment
}
export default function Calender(props: IProps) {

  const [weeks,setWeeks] = React.useState<IWeek[]>([]);
  const [month, setMonth] = React.useState<number>(props.DateTime.month());
  const [year, setYear] = React.useState<number>(props.DateTime.year());
  const [mode, setMode] = React.useState<('month'|'year'|'dozenYear')>('month')
  const [hover, setHover] = React.useState<('None'|'Center'|'Next'|'Previous')>('None')

  React.useEffect(() => {
    setMonth(isNaN(props.DateTime.month())? 0 : props.DateTime.month());
    setYear(isNaN(props.DateTime.year())? moment.utc().year() : props.DateTime.year());
  }, [props.DateTime])

  React.useEffect(() => {
    let d1 = moment([year, month, 1]).startOf('week');
    const w: IWeek[] = [];
    while ((d1.month() <= month && d1.year() === year) || (d1.year() < year)) {
      w.push({
        sunday: moment(d1),
        monday:  moment(d1).add(1,'day'),
        tuesday: moment(d1).add(2,'day'),
        wednesday: moment(d1).add(3,'day'),
        thursday: moment(d1).add(4,'day'),
        friday: moment(d1).add(5,'day'),
        saturday: moment(d1).add(6,'day')
      });
      d1.add(1,'week');
      d1 = moment(d1).startOf('week');
    }
    setWeeks(w);
  }, [month, year])

  function toNext() {
    if (mode === 'month' && month === 11) {
      setMonth(0);
      setYear(y => y +1);
    }
    else if (mode === 'month') {
      setMonth(m => m + 1);
    }
    else if (mode === 'year') {
      setYear(y => y + 1);
    }
    else {
      setYear((y) => y + 12)
    }

  }

  function toPrev() {
    if (mode === 'month' && month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    }
    else if (mode === 'month') {
      setMonth(m => m - 1);
    }
    else if (mode === 'year') {
      setYear(y => y - 1);
    }
    else {
      setYear((y) => y - 12)
    }
  }

  function setDate(d: moment.Moment) {
    let ud = moment(props.DateTime);
    if (!ud.isValid())
      ud = moment.utc().startOf('d');
      
    ud.year(d.year()).month(d.month()).date(d.date());
    props.Setter(ud);
  }

  const headerWidth = (mode === 'month'? 5 : 2)
  return (
    <div style={{ background: '#f0f0f0', opacity: 1}}>
      <table style={{textAlign: 'center'}}>
        <thead style={{verticalAlign: 'middle', fontWeight: 'bold'}}>
          <tr style={{height: 20, lineHeight: '20px'}}>
            <th style={{width: 20, padding: 5, cursor: 'pointer' }}
            onMouseEnter={() => setHover('Previous')}
            onMouseLeave={() => setHover('None')}
            onClick={toPrev}
            >{'<'}</th>
            <th style={{width: 145, padding: 5, cursor: 'pointer'}} colSpan={headerWidth}
            onClick={(evt) => {
               evt.stopPropagation();
               if (mode==='month') setMode('year')
               }}
               onMouseEnter={() => setHover('Center')}
               onMouseLeave={() => setHover('None')}
               >
              {mode === 'month' ? moment([year, month, 1]).format('MMMM YYYY') : ''}
              {mode === 'year' ? year : ''}
              {mode === 'dozenYear' ? `${year-6}-${year+5}` : ''}
              </th>
            <th style={{width: 20, padding: 5, cursor: 'pointer'}}
             onClick={toNext}
             onMouseEnter={() => setHover('Next')}
             onMouseLeave={() => setHover('None')}
             >{'>'}</th>
          </tr>
          {mode === 'month'? <tr style={{height: 20, lineHeight: '20px'}}>
            <td style={{width: 20, padding: 5}}>SU</td>
            <td style={{width: 20, padding: 5}}>MO</td>
            <td style={{width: 20, padding: 5}}>TU</td>
            <td style={{width: 20, padding: 5}}>WE</td>
            <td style={{width: 20, padding: 5}}>TH</td>
            <td style={{width: 20, padding: 5}}>FR</td>
            <td style={{width: 20, padding: 5}}>SA</td>
            </tr> : null}
        </thead>
        <tbody>
          
          {mode === 'month'? weeks.map((w) => <tr key={w.sunday.isoWeek()} style={{height: 20, lineHeight: '20px'}}>
            <DayCell date={w.sunday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.sunday);}}/>
            <DayCell date={w.monday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.monday);}}/>
            <DayCell date={w.tuesday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.tuesday);}}/>
            <DayCell date={w.wednesday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.wednesday);}}/>
            <DayCell date={w.thursday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.thursday);}}/>
            <DayCell date={w.friday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.friday);}}/>
            <DayCell date={w.saturday} month={month} day={props.DateTime.date()} onClick={(evt) => {evt.stopPropagation(); setDate(w.saturday);}}/>
            </tr>): null}
          {mode === 'year'? <>
          <tr style={{height: 54, lineHeight: '54px'}}>
            <MonthCell date={moment([year,0,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(0)}}/>
            <MonthCell date={moment([year,1,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(1)}}/>
            <MonthCell date={moment([year,2,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(2)}}/>
            <MonthCell date={moment([year,3,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(3)}}/>
          </tr>
          <tr style={{height: 54, lineHeight: '54px'}}>
            <MonthCell date={moment([year,4,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(4)}}/>
            <MonthCell date={moment([year,5,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(5)}}/>
            <MonthCell date={moment([year,6,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(6)}}/>
            <MonthCell date={moment([year,7,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(7)}}/>
          </tr>
          <tr style={{height: 54, lineHeight: '54px'}}>
            <MonthCell date={moment([year,8,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(8)}}/>
            <MonthCell date={moment([year,9,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(9)}}/>
            <MonthCell date={moment([year,10,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(10)}}/>
            <MonthCell date={moment([year,11,1])} month={month} onClick={(evt) => {evt.stopPropagation(); setMode('month'); setMonth(11)}}/>
          </tr>
          </> : null}
        </tbody>
      </table>
    </div>

  );
}

const DayCell = (props: {date: moment.Moment, onClick: (evt: any) => void, month: number, day: number}) => {
   const [active, setActive] = React.useState<boolean>(false);
   const [hover, setHover] = React.useState<boolean>(false);
   const [disabled, setDisabled] = React.useState<boolean>(false);

  React.useEffect(() => {
    setActive(props.date.date() === props.day && props.month === props.date.month())
    setDisabled(props.date.month() !== props.month);
  }, [props.month, props.date, props.day])


  const color = (disabled? '#777' : (active? '#fff' : undefined));
  const bg = (active? '#337ab7' : hover? '#d3d3d3' : undefined)
  return <td style={{
      width: 20, 
      padding: 5,
      color,
      backgroundColor: bg,
      cursor: (!active? 'pointer' : 'default')
    }} 
    onClick={props.onClick}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    >
      {props.date.format("DD")}
    </td>
}

const MonthCell = (props: {date: moment.Moment, onClick: (evt: any) => void, month: number}) => {
  const [active, setActive] = React.useState<boolean>(false);
  const [hover, setHover] = React.useState<boolean>(false);
  React.useEffect(() => {
    setActive(props.date.month() === props.month)
    
  }, [props.month, props.date])

  const color = (active? '#fff' : undefined);
  const bg = (active? '#337ab7' : hover? '#d3d3d3' : undefined)

  return <td style={{
    width: 54, 
    padding: 5,
    color,
    backgroundColor: bg,
    cursor: (!active? 'pointer' : 'default')
  }}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={props.onClick}>
    {props.date.format("MMM")}
  </td>

}


