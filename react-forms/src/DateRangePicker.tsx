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
import * as moment from 'moment';

type Duration =   ('Custom' | '1 Day' | '7 Days' | '30 Days' | '90 Days' | '180 Days' | '365 Days')

export default function DateRangePicker<T>(props: {
  Record: T;
  FromField: keyof T;
  ToField: keyof T;
  Setter: (record: T) => void;
  Label: string;
  Valid: (fieldFrom: keyof T, fieldTo: keyof T) => boolean;
  Disabled?: boolean;
  Feedback?: string;
  Format?: string;
  Type?: ('datetime-local' | 'date');
}) {
  // Range box vars, need a secondary var to avoid looping react hooks
  const [formRange, setFormRange] = React.useState<Duration>('Custom');
  const [range, setRange] = React.useState<Duration>('Custom');

  // Tracks weather or not props.Record changes are due to internal input boxes or externally
  const [internal, setInternal] = React.useState<boolean>(false);
  // Adds a buffer between the outside props and what the box is reading to prevent box overwriting every render with a keystroke
  const [boxRecord, setBoxRecord] = React.useState<T>(ParseRecord());
  
  // Formats that will be used for dateBoxes
  const boxFormat = "YYYY-MM-DD" + (props.Type === undefined || props.Type === 'date' ? "" : "[T]hh:mm:ss");
  const recordFormat = props.Format !== undefined ? props.Format : "YYYY-MM-DD" + (props.Type === undefined || props.Type === 'date' ? "" : "[T]hh:mm:ss.SSS[Z]");

  React.useEffect(() => {
    setRange(ToRange(moment(props.Record[props.ToField], recordFormat).diff(moment(props.Record[props.FromField], recordFormat), 'days')));
    if (!internal)
      setBoxRecord(ParseRecord());
    setInternal(false);
  },[props.Record]);

  React.useEffect(() => {
    setRange(formRange);
    const toTime: moment.Moment =  moment(props.Record[props.FromField], recordFormat).add(GetDays(formRange), 'days');
    props.Setter({...props.Record, [props.ToField]: toTime.format(recordFormat) as any});
    setBoxRecord({...boxRecord, [props.ToField]: toTime.format(boxFormat) as any});
  }, [formRange]);

  function ParseRecord(): T{
    const record: T = { ...props.Record };
    const ParseExternalField: (field: keyof T) => any = (field: keyof T) => {return props.Record[field] === null ? '' : moment(props.Record[field] as any, recordFormat).format(boxFormat)};
    record[props.ToField] = ParseExternalField(props.ToField);
    record[props.FromField] = ParseExternalField(props.FromField);
    return record;
  }

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

  function ToRange(days: number) {
    if (days === 1) return ('1 Day');
    else if (days === 7) return('7 Days');
    else if (days === 30) return('30 Days');
    else if (days === 90) return('90 Days');
    else if (days === 180) return('180 Days');
    else if (days === 365) return('365 Days');
    else return('Custom');
  }

  function dateBox(field: keyof T): any {
    return <div className="col">
      <input
        className={"form-control" + (props.Valid(props.FromField, props.ToField) ? '' : ' is-invalid')}
        type={props.Type === undefined ? 'date' : props.Type}
        onChange={(evt) => {
          const record: T = { ...props.Record };
          if (evt.target.value !== '')
            record[field] = moment(evt.target.value, boxFormat).format(recordFormat) as any;
          else
            record[field] = null as any;
          // These two updates should be batched together
          props.Setter(record);
          setBoxRecord({...boxRecord, [field]: evt.target.value});
          setInternal(true);
        }}
        value={boxRecord[field] as any}
        disabled={props.Disabled === undefined ? false : props.Disabled}
      />
      {field !== props.FromField ? null :
      <div className="invalid-feedback">
        {props.Feedback === undefined ? 'From and to dates required, and from must be before to.' : props.Feedback}
      </div>}
    </div>
  }


  return (
    <div className="form-group">
      {props.Label === "" ? null : <label>{props.Label}</label>}
      <div className="row">
        <div className="col">
          <select className="form-control" value={range} onChange={(evt) => setFormRange(evt.target.value as Duration)}>
            <option value="Custom">Custom</option>
            <option value="1 Day">1 Day</option>
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="90 Days">90 Days</option>
            <option value="180 Days">180 Days</option>
            <option value="365 Days">365 Days</option>
          </select>
        </div>
        {dateBox(props.FromField)}
        {dateBox(props.ToField)}
      </div>
    </div>
  );
}
