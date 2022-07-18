// ******************************************************************************************************
//  DateRangePicker.tsx - Gbtc
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
//  02/05/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';

type Duration =   ('Custom' | '1 Day' | '7 Days' | '30 Days' | '90 Days' | '180 Days' | '365 Days')

export default function DateRangePicker<T>(props: {
  Record: T;
  FromField: keyof T;
  ToField: keyof T;
  Setter: (record: T) => void;
  Disabled?: boolean;
  Label: string;
  Valid?: boolean;
}) {
  const [range, setRange] = React.useState<Duration>('Custom');

  const [Tstart, setTstart] = React.useState<Date|null>(ToDate(props.Record[props.FromField]));
  const [Tend, setTend] = React.useState<Date|null>(ToDate(props.Record[props.ToField]));

  const [StartInput, setStartInput] = React.useState<string>(Tstart != null? ToString(Tstart) : '');
  const [EndInput, setEndInput] = React.useState<string>(Tend != null? ToString(Tend) : '');

  React.useEffect(() => {
      const propsStart = ToDate(props.Record[props.FromField]);
      const propsEnd = ToDate(props.Record[props.ToField]);

      if (propsStart == null || Tstart == null) {
    		if (!(propsStart == null && Tstart == null ))
               setTstart(propsStart);
  	   }
      else if (propsStart.getTime() !== Tstart.getTime())
        setTstart(propsStart);

      if (propsEnd == null || Tend == null) {
			     if (!(propsEnd == null && Tend == null ))
				       setTstart(propsEnd);
     }
      else if (propsEnd.getTime() !== Tend.getTime())
        setTend(propsEnd);

  },[props.Record]);

  React.useEffect(() => {
      const days = (Tstart != null && Tend != null? Math.round((Tend.getTime() - Tstart.getTime()) / (1000 * 60 * 60 * 24)) : 0)
      if (ToRange(days) !== range)
        setRange(ToRange(days));
      UpdateTime();
  },[Tstart, Tend]);

  React.useEffect(() => {

    const days = GetDays(range);
      if (days > 0) {
		if (Tstart != null)
			setTend(new Date(Tstart.valueOf() + 1000*24*60*60*days))
		else if (Tend != null)
      setTstart(new Date(Tend.valueOf() - 1000*24*60*60*days))
    else {
			setTstart(new Date(new Date().valueOf() - 1000*24*60*60*days))
      setTend(new Date())
    }

	  }
  }, [range]);

  function GetDays(val: Duration) {
    if (val === '1 Day')
      return 1;
    if (val === '7 Days')
      return 7;
    if (val === '30 Days')
      return 30;
    if (val === '90 Days')
      return 90;
    if (val === '180 Days')
      return 180;
    if (val === '365 Days')
      return 365;
    return 0;
  }

  function ToDate(str: any) {
      if (str === null)
        return null;

      const dt = new Date(str);

      if (isNaN(dt.getTime()))
        return null;

      return dt;
  }

  React.useEffect(() => {
    if (Tstart != null)
          setStartInput(ToString(Tstart));
  }, [Tstart])

  React.useEffect(() => {
      // only if InputStart is a valid ToString
      if (StartInput.match('^([0-9][0-9][0-9][0-9])-([0-1][0-9])-([0-3][0-9])') != null)
        setTstart(ToDate(StartInput));
      else
        setTstart(null)
  }, [StartInput]);

  React.useEffect(() => {
    if (Tend != null)
          setEndInput(ToString(Tend));
  }, [Tend])

  React.useEffect(() => {
      // only if EndInput is a valid ToString
      if (EndInput.match('^([0-9][0-9][0-9][0-9])-([0-1][0-9])-([0-3][0-9])') != null)
        setTend(ToDate(EndInput));
      else
        setTend(null)
  }, [EndInput]);

  function UpdateTime() {

    const to = (Tend !== null? ToString(Tend) : '')

    const from = (Tstart !== null? ToString(Tstart) : '')

    const record: T = {
      ...props.Record,
      [props.ToField]: to,
      [props.FromField]: from,
    };
    props.Setter(record);

  }

  function ToString(dt: Date) {
     return   `${dt.getUTCFullYear()}-${(dt.getUTCMonth() + 1).toString()
         .padStart(2, '0')}-${dt.getUTCDate().toString().padStart(2, '0')}`
  }

  function ToRange(days: number) {
    if (days === 1) return ('1 Day');
    else if (days === 7) return('7 Days');
    else if (days === 30) return('30 Days');
    else if (days === 90) return('90 Days');
    else if (days === 180) return('180 Days');
    else if (days === 365) return('365 Days');
    else return('Custom');
  }

  let startValid = (Tstart !== null) && (!isNaN(Tstart.getTime()));
  let endValid = (Tend !== null) && (!isNaN(Tend.getTime())) && (!startValid || ((Tstart !== null) && (Tstart.getTime() < Tend.getTime())));

  startValid = (props.Valid === undefined? startValid : props.Valid);
  endValid = (props.Valid === undefined? endValid : props.Valid);
  return (
    <div className="form-group">
      <label>{props.Label}</label>
      <div className="row">
        <div className="col">
          <select className="form-control" value={range} onChange={(evt) => setRange(evt.target.value as Duration)}>
            <option value="Custom">Custom</option>
            <option value="1 Day">1 Day</option>
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="90 Days">90 Days</option>
            <option value="180 Days">180 Days</option>
            <option value="365 Days">365 Days</option>
          </select>
        </div>
        <div className="col">
          <input
            className={"form-control" + (startValid? '' : ' is-invalid')}
            type="date"
            onChange={(evt) => { setStartInput(evt.target.value as string) }}
            value={StartInput}
            disabled={props.Disabled == null ? false : props.Disabled}
          />
        </div>
        <div className="col">
          <input
            className={"form-control" + (endValid? '' : ' is-invalid')}
            type="date"
            onChange={(evt) => {setEndInput(evt.target.value as string) }}
            value={EndInput}
            disabled={props.Disabled == null ? false : props.Disabled}
          />
        </div>
      </div>
    </div>
  );
}
