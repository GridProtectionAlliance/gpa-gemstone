// ******************************************************************************************************
//  Input.tsx - Gbtc
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
//  01/22/2020 - Billy Ernest
//       Generated original version of source code.
//  05/05/2021 - C. Lackner
//       Added Help Message.
//
// ******************************************************************************************************

import * as React from 'react';
import { IsInteger, IsNumber } from '@gpa-gemstone/helper-functions'
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

export interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
   * Determines whether the edited field is valid.
   * @param field - Record field to validate.
   * @returns Whether the field is valid.
   */
  Valid: (field: keyof T) => boolean;
  /**
   * Optional message shown when the input is invalid.
   */
  Feedback?: string;
  /**
   * Optional input value mode, defaulting to `text`.
   */
  Type?: 'number' | 'text' | 'password' | 'email' | 'color' | 'integer';
  /**
   * Optional CSS styles applied to the surrounding form group.
   */
  Style?: React.CSSProperties;
  /**
   * Optional flag that permits null values, defaulting to false.
   */
  AllowNull?: boolean;
  /**
   * Optional Bootstrap sizing applied to the input.
   */
  Size?: 'small' | 'large',
  /**
   * Optional numeric value substituted when null is not allowed, defaulting to 0.
   */
  DefaultValue?: number
  /**
   * Optional reference attached to the internal input element.
   */
  InputRef?: React.RefObject<HTMLInputElement>
}


/**
 * Renders a validated record-bound input for text or numeric values.
 * @param props - Record binding, input mode, validation, and display configuration.
 * @returns A labeled input with validation feedback.
 */
export default function Input<T>(props: IProps<T>) {
  const internal = React.useRef<boolean>(false);
  const [heldVal, setHeldVal] = React.useState<string>(''); // Need to buffer tha value because parseFloat will throw away trailing decimals or zeros

  // Handle changes to the record's field value.
  React.useEffect(() => {
    const rawValue = props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString();

    if ((props.Type === 'number' || props.Type === 'integer') && !internal.current)
      setHeldVal(rawValue);
    else if (rawValue !== heldVal)
      setHeldVal(rawValue);

    internal.current = false;
  }, [props.Record[props.Field]]);

  // Handle blur event (loss of focus) on the input.
  function onBlur() {
    const allowNull = props.AllowNull === undefined ? false : props.AllowNull;
    if (!allowNull && (props.Type === 'number' || props.Type === 'integer') && heldVal === '') {
      internal.current = false;
      props.Setter({ ...props.Record, [props.Field]: props.DefaultValue ?? 0 });
    }
  }

  // Handle value change of the input.
  function valueChange(value: string) {
    internal.current = true;

    const allowNull = props.AllowNull === undefined ? false : props.AllowNull;
    if (props.Type === 'number') {
      const v = (value.length > 0 && value[0] === '.' ? ("0" + value) : value)
      if (IsNumber(v) || (v === '' && allowNull)) {
        props.Setter({ ...props.Record, [props.Field]: v !== '' ? parseFloat(v) : null });
        setHeldVal(v);
      }
      else if (v === '') {
        setHeldVal(v);
      }
    }
    else if (props.Type === 'integer') {
      if (IsInteger(value) || (value === '' && allowNull)) {
        props.Setter({ ...props.Record, [props.Field]: value !== '' ? parseFloat(value) : null });
        setHeldVal(value);
      }
      else if (value === '') {
        setHeldVal(value);
      }
    }
    else {
      if (props.Type === 'text' && (props.AllowNull ?? false))
        console.warn("Input component: Empty strings are set to null for Type='text' and AllowNull=true to maintain current functionality.");

      props.Setter({ ...props.Record, [props.Field]: value !== '' ? value : null });
      setHeldVal(value);
    }
  }

  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const label = props.Label === undefined ? props.Field as string : props.Label;

  return (
    <div className={"form-group " + (props.Size === 'large' ? 'form-group-lg' : '') + (props.Size === 'small' ? 'form-group-sm' : '')} style={props.Style}>
      {/* Rendering label and help icon */}
      {showLabel ?
        <label className="d-flex align-items-center">
          <span>{showLabel ? label : ''}</span>
          <HelpIcon Help={props.Help} />
        </label>
        : null}

      {/* Input element */}
      <input
        ref={props.InputRef}
        type={props.Type === undefined ? 'text' : props.Type}
        className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
        onChange={(evt) => valueChange(evt.target.value)}
        value={heldVal}
        disabled={props.Disabled == null ? false : props.Disabled}
        onBlur={onBlur}
        step='any'
      />

      {/* Invalid feedback message */}
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
