// ******************************************************************************************************
//  ArrayCheckBoxes.tsx - Gbtc
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
import {CreateGuid} from '@gpa-gemstone/helper-functions';

interface IProps<T> {
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
    * Array of checkboxes with their IDs and labels
    * @type {{ ID: string; Label: string }[]}
  */
  Checkboxes: { ID: string; Label: string }[];
    /**
    * Label to display for the form, defaults to the Field prop
    * @type {string}
    * @optional
  */
  Label?: string;
}

export default function ArrayCheckBoxes<T>(props: IProps<T>) {

  // Remove an ID from the array
  const Remove = (cb: { ID: string; Label: string }) => {
    const a = [...((props.Record[props.Field] as any) as string[])];
    const i = a.indexOf(cb.ID);
    a.splice(i, 1);
    return a;
    };

  // Add an ID to the array making sure there are no duplicates and array is sorted
  const Add = (cb: { ID: string; Label: string }) => {
    const a = [...((props.Record[props.Field] as any) as string[])];
    const i = a.indexOf(cb.ID);
    if (i < 0) a.push(cb.ID);
    a.sort();
    return a;
  };
  const id = React.useRef("array-checkbox-" + CreateGuid());
  return (
    <div className="form-group">
      <label>{props.Label == null ? props.Field : props.Label}</label>
      <br />
      <div className="form-check form-check-inline">
          <input
            id={`${id.current}-all`}
            className="form-check-input"
            type="checkbox"
            checked={JSON.stringify(props.Record[props.Field]) === JSON.stringify(props.Checkboxes.map(x => x.ID))}
            onChange={(evt) =>
              props.Setter({ ...props.Record, [props.Field]: evt.target.checked ? props.Checkboxes.map(x => x.ID): [] })
            }
          />
          <label htmlFor={`${id.current}-all`} className="form-check-label">All</label>
        </div>
      {props.Checkboxes.map((cb, i) => (
        <div key={i} className="form-check form-check-inline">
          <input
            id={`${id.current}-${i}`}
            className="form-check-input"
            type="checkbox"
            checked={(props.Record[props.Field] as any).find((x: string) => cb.ID === x) !== undefined}
            onChange={(evt) =>
              props.Setter({ ...props.Record, [props.Field]: evt.target.checked ? Add(cb) : Remove(cb) })
            }
          />
          <label htmlFor={`${id.current}-${i}`} className="form-check-label">{cb.Label}</label>
        </div>
      ))}
    </div>
  );
}
