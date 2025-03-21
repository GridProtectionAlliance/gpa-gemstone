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
import ToolTip from './ToolTip';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
    * Function to determine the validity of a field
    * @param field - Field of the record to check
    * @returns {boolean}
  */
  Valid: (field: keyof T) => boolean;
  /**
    * Feedback message to show when input is invalid
    * @type {string}
    * @optional
  */
  Feedback?: string;
  /**
    * Defines the number of intervals for time value
    * @type {number}
    * @optional
  */
  Step?: number;
}

export default function DatePicker<T>(props: IProps<T>) {
  const guid = React.useRef<string>(CreateGuid());
  const [showHelp, setShowHelp] = React.useState<boolean>(false);

  return (
    <div className="form-group">
      {(props.Help != null || props.Label !== "") ?
        <label className='d-flex align-items-center'>{props.Label ?? props.Field}
          {props.Help != null ?
            <button className='btn mb-1 pt-0 pb-0' onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)} data-tooltip={guid.current}>
              <ReactIcons.QuestionMark Color='var(--info)' Size={20} />
            </button> : <></>}
        </label>
        : <></>}
      <ToolTip Show={showHelp} Target={guid.current} Class="info" Position="bottom">
        {props.Help}
      </ToolTip>
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

      {/* Feedback message for validation errors */}
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
