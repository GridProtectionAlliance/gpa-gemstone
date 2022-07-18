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

export default class TimePicker<T> extends React.Component<
  { Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Label?: string;
    Disabled?: boolean;
    Feedback?: string;
    Step?: number;
    Valid: (field: keyof T) => boolean;
    },
  {},
  {}
> {
  render() {
    return (
      <div className="form-group">
        {(this.props.Label !== "") ?
        <label>{this.props.Label == null ? this.props.Field : this.props.Label}</label> : null}
        <input
          className={this.props.Valid(this.props.Field) ? 'form-control' : 'form-control is-invalid'}
          type="time"
          step={this.props.Step === null ? 60 : this.props.Step}
          onChange={(evt) => {
            const record: T = { ...this.props.Record };
            if (evt.target.value !== '') record[this.props.Field] = evt.target.value as any;
            else record[this.props.Field] = null as any;

            this.props.Setter(record);
          }}
          value={
            this.props.Record[this.props.Field] == null ? '' : (this.props.Record[this.props.Field] as any).toString()
          }
          disabled={this.props.Disabled == null ? false : this.props.Disabled}
        />
        <div className="invalid-feedback">
        {this.props.Feedback == null ? this.props.Field + ' is a required field.' : this.props.Feedback}
      </div>
      </div>
    );
  }
}
