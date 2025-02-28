// ******************************************************************************************************
//  Select.tsx - Gbtc
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
//  01/28/2020 - Billy Ernest
//       Generated original version of source code.
//  05/05/2021 - C. Lackner
//       Added Help Message.
//
// ******************************************************************************************************

import * as React from 'react';
import ToolTip from './ToolTip';
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
    * Options for the select dropdown
    * @type {{ Value: string; Label: string }[]}
  */
  Options: { Value: string | number, Label: string }[];
  /**
    * Flag to include an empty option in the select dropdown
    * @type {boolean}
    * @optional
  */
  EmptyOption?: boolean;
  /**
    * Label to display for the empty option
    * @type {string}
    * @optional
  */
  EmptyLabel?: string;
}


export default function Select<T>(props: IProps<T>) {
  const [guid, setGuid] = React.useState<string>("");
  const [showHelp, setShowHelp] = React.useState<boolean>(false);

  // Effect to generate a unique ID for the component.
  React.useEffect(() => {
    setGuid(CreateGuid());
  }, []);

  // Effect to validate the current value against the available options.
  React.useEffect(() => {
    const currentValue = GetRecordValue();
    if (!(props.EmptyOption ?? false) && props.Options.length > 0 && props.Options.findIndex((option) => option.Value == currentValue) === -1) {
      SetRecord(props.Options[0].Value);
      // tslint:disable-next-line
      console.warn("The current value is not available as an option. Specify EmptyOption=true if the value should be allowed.")
    }

  }, [props.Options]);

  // Update the parent component's state with the new value.
  function SetRecord(value: string | number): void {
    const record: T = { ...props.Record };
    if (value !== '') {
      const val = props.Options.find(op => op.Value == value)?.Value ?? value
      record[props.Field] = val as unknown as T[keyof T];
    }
    else
      record[props.Field] = null as unknown as T[keyof T];

    if (record[props.Field] != props.Record[props.Field])
      props.Setter(record);
  }

  // Rretrieve the current value of the select field from the record.
  function GetRecordValue() {
    return props.Record[props.Field] == null ? '' : props.Record[props.Field];
  }

  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;


  return (
    <div className="form-group">
      {/* Rendering label and optional help icon */}
      {showHelpIcon || showLabel ?
        <label className='d-flex align-items-center'>{showLabel ? label : ''}
          {showHelpIcon ?
            <button className='btn mb-1 pt-0 pb-0' onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)} data-tooltip={guid}>
              <ReactIcons.QuestionMark Color='var(--info)' Size={20} />
            </button>
            : null}
        </label> : null}

      {showHelpIcon ?
        <ToolTip Show={showHelp} Target={guid} Color="info" Position="bottom">
          {props.Help}
        </ToolTip>
        : null}

      {/* Rendering the select input */}
      <select
        className="form-control"
        onChange={(evt) => SetRecord(evt.target.value)}
        value={GetRecordValue() as string | number}
        disabled={props.Disabled == null ? false : props.Disabled}
      >
        {/* Optional empty option */}
        {(props.EmptyOption ?? false) ? <option value="">{props.EmptyLabel !== undefined ? props.EmptyLabel : ''}</option> : null}

        {/* Rendering options */}
        {props.Options.map((a, i) => (
          <option key={i} value={a.Value}>
            {a.Label}
          </option>
        ))}
      </select>
    </div>
  );
}
