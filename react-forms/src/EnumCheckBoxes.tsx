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

interface IProps<T>{
  /**
    * Record to be used in form
    * @type {T}
  */
  Record: T;
  /**
    * Field of the record to be edited
    * @type {keyof T}
  */
  Field: keyof T;
  /**
    * Setter function to update the Record
    * @param record - Updated Record
  */
  Setter: (record: T) => void;
  /**
    * Array of enumerable values to create checkboxes for
    * @type {string[]}
  */
  Enum: string[];
  /**
    * Label to display for the form, defaults to the Field prop
    * @type {string}
    * @optional
  */
  Label?: string;
  /**
    * Function to determine if a checkbox should be disabled
    * @param item - The enumeration value
    * @returns {boolean}
    * @optional
  */
  IsDisabled?: (item: string) => boolean
}

/**
 * EnumCheckBoxes Component.
 * Renders a set of checkboxes based on an enumeration, allowing multiple selection.
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
      <label>{props.Label == null ? props.Field : props.Label}</label>
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
