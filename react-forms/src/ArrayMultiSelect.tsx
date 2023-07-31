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

export default function ArrayMultiSelect<T>(props: {
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Options: { Value: string; Label: string }[];
  Label?: string;
  Disabled?: boolean;
  Style?: React.CSSProperties;
}) {
  return (
    <div className="form-group">
      <label>{props.Label == null ? props.Field as string: props.Label}</label>
      <select
        multiple
        className="form-control"
        onChange={(evt) => {
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
        {props.Options.map((a, i) => (
          <option key={i} value={a.Value}>
            {a.Label}
          </option>
        ))}
      </select>
    </div>
  );
}
