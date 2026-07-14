// ******************************************************************************************************
//  EnumCheckBoxes.tsx - Gbtc
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

/** Defines record binding and enum choices for the checkbox group. */
interface IProps<T>{
  /**
   * Record containing the array of selected enumeration values.
   */
  Record: T;
  /**
   * Record field that stores the selected enumeration values.
   */
  Field: keyof T;
  /**
   * Updates the record when a checkbox selection changes.
   * @param record - Record containing the updated selection.
   */
  Setter: (record: T) => void;
  /**
   * Enumeration values rendered as individual checkboxes.
   */
  Enum: string[];
  /**
   * Optional text shown above the checkboxes, defaulting to the field name.
   */
  Label?: string;
  /**
   * Optional callback that determines whether an enumeration choice is disabled.
   * @param item - Enumeration value represented by the checkbox.
   * @returns Whether the checkbox is disabled.
   */
  IsDisabled?: (item: string) => boolean
}

/**
 * Renders enumeration choices as checkboxes backed by a numeric flag field.
 * @param props - Record binding, enumeration values, and optional disabled-state callback.
 * @returns Checkbox controls for modifying the field's bit flags.
 */
export default function EnumCheckBoxes<T>(props: IProps<T>) {
  // Determine if an enum flag is set.
  /* tslint:disable-next-line:no-bitwise */
  const EquateFlag = (index: number) => (((props.Record[props.Field] as any) / Math.pow(2, index)) & 1) !== 0;

  // Turn off a flag in the enumeration.
  const DecrementFlag = (index: number) => (props.Record[props.Field] as any) - Math.pow(2, index);
  
  // Turn on a flag in the enumeration.
  const IncrementFlag = (index: number) => (props.Record[props.Field] as any) + Math.pow(2, index);

  return (
    <div className="form-group">
      {/* Label for the checkbox group. */}
      <label>{props.Label == null ? props.Field as string : props.Label}</label>
      <br />
      
      {/* Checkbox for selecting/deselecting all options. */}
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          checked={(props.Record[props.Field] as any) === (Math.pow(2,props.Enum.length) - 1)}
          onChange={(evt) =>
            props.Setter({ ...props.Record, [props.Field]: evt.target.checked ? Math.pow(2,props.Enum.length) -1 : 0 })
          }
        />
        <label className="form-check-label">All</label>
      </div>

      {/* Create a checkbox for each enum. */}
      {props.Enum.map((flag, i) => (
        <div key={i} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            checked={EquateFlag(i)}
            disabled={props.IsDisabled !== undefined? props.IsDisabled(flag) : false}
            onChange={(evt) =>
              props.Setter({ ...props.Record, [props.Field]: evt.target.checked ? IncrementFlag(i) : DecrementFlag(i) })
            }
          />
          <label className="form-check-label">{flag}</label>
        </div>
      ))}
    </div>
  );
}
