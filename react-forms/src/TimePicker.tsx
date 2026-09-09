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
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

/** Defines record binding and formatting for the time picker. */
interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
   * Determines whether the selected time is valid.
   * @param field - Record field containing the selected time.
   * @returns Whether the field is valid.
   */
  Valid: (field: keyof T) => boolean;
  /**
   * Optional message shown when the selected time is invalid.
   */
  Feedback?: string;
  /**
   * Optional increment in seconds used by the time input, defaulting to the browser behavior unless explicitly null.
   */
  Step?: number;
}

/**
 * Renders a validated time input bound to a record field.
 * @param props - Record binding, time increment, and validation behavior.
 * @returns A labeled time input with validation feedback.
 */
export default function DatePicker<T>(props: IProps<T>) {
  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const label = props.Label === undefined ? props.Field as string : props.Label;

  return (
    <div className="form-group">
      {showLabel ?
        <label className="d-flex align-items-center">
          <span>{showLabel ? label : ''}</span>
          <HelpIcon Help={props.Help} />
        </label>
        : null}

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
        value={props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString()}
        disabled={props.Disabled == null ? false : props.Disabled}
      />

      {/* Feedback message for validation errors */}
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
