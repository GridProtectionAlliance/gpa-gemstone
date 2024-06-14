// ******************************************************************************************************
//  TimePicker.tsx - Gbtc
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
//  03/21/2022 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import HelperMessage from './HelperMessage';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

export default function TimePicker<T>(props: {
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Valid: (field: keyof T) => boolean;
  Label?: string;
  Disabled?: boolean;
  Feedback?: string;
  Step?: number;
  Help?: string|JSX.Element;
}) {
  const guid = React.useRef<string>(CreateGuid());
  const [showHelp, setShowHelp] = React.useState<boolean>(false);

  return (
    <div className="form-group">
      {(props.Help != null || props.Label !== "") ?
      <label>{props.Label ?? props.Field}
        {props.Help != null ? 
          <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} 
          onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : <></>}
      </label> 
      : <></>}
      <HelperMessage Show={showHelp} Target={guid.current}>
        {props.Help}
      </HelperMessage>
      <input
        className={'form-control' + (props.Valid(props.Field) ? '' : ' is-invalid')}
        type="time"
        step={props.Step === null ? 60 : props.Step}
        onChange={(evt) => {
          const record: T = { ...props.Record };
          if (evt.target.value !== '') record[props.Field] = evt.target.value as any;
          else record[props.Field] = null as any;

          props.Setter(record);
        }}
        value={
          props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString()
        }
        disabled={props.Disabled == null ? false : props.Disabled}
      />
      <div className="invalid-feedback">
      {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
    </div>
    </div>
  );
}
