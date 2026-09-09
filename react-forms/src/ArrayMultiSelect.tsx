// ******************************************************************************************************
//  ArrayMultiSelect.tsx - Gbtc
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
//
// ******************************************************************************************************

import * as React from 'react';
import { Gemstone } from '@gpa-gemstone/application-typings';

/** Defines record binding and choices for the array-backed multi-select. */
interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
   * Choices rendered in the multi-select dropdown.
   */
  Options: { Value: string; Label: string }[];
  /**
   * Optional CSS styles applied to the select element.
   */
  Style?: React.CSSProperties;
  /**
   * Optional CSS styles applied to the surrounding form group.
   */
  GroupStyle?: React.CSSProperties;
}

/**
 * Renders a multi-select control that stores selected option values in an array field.
 * @param props - Record binding, choices, and optional styling for the control.
 * @returns A labeled multi-select form control.
 */
export default function ArrayMultiSelect<T>(props: IProps<T>) {
  return (
    <div className="form-group" style={props.GroupStyle}>
      <label>{props.Label == null ? props.Field as string : props.Label}</label>

      {/* Multi-select dropdown control */}
      <select
        multiple
        className="form-control"
        onChange={(evt) => {
          // On change, update the record's field with the changes.
          const record: T = {
            ...props.Record,
            [props.Field]: Array.from(evt.target.selectedOptions).map((a) => a.value),
          };

          props.Setter(record);
        }}
        value={(props.Record[props.Field] as any) ?? ([] as any)}
        disabled={props.Disabled == null ? false : props.Disabled}
        style={props.Style}
      >

        {/* Map each option with an <option> element */}
        {props.Options.map((a, i) => (
          <option key={i} value={a.Value}>
            {a.Label}
          </option>
        ))}
      </select>
    </div>
  );
}
