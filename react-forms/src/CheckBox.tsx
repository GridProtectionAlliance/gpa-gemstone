// ******************************************************************************************************
//  CheckBox.tsx - Gbtc
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
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import HelperMessage from './HelperMessage';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

// Interface defining the props for other components. 
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
    * Label to display for the form, defaults to the Field prop
    * @type {string}
    * @optional
  */
  Label?: string,
  /**
    * Flag to disable the input field
    * @type {boolean}
    * @optional
  */
  Disabled?: boolean,
  /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
  */
  Help?: string | JSX.Element;
}

export default function CheckBox<T>(props: IProps<T>) {
  const [guid, setGuid] = React.useState<string>("");
  const [showHelp, setShowHelp] = React.useState<boolean>(false);

  // Runs once, setting a unique GUID for each checkbox instance.
  React.useEffect(() => {
    setGuid(CreateGuid());
  }, []);

  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;

  return (
    <div className="form-check" data-help={guid}>
      <input
        type="checkbox"
        className="form-check-input"
        style={{ zIndex: 1 }}
        onChange={(evt) => {
          const record: T = { ...props.Record };
          record[props.Field] = evt.target.checked as any;
          props.Setter(record);
        }}
        value={(props.Record[props.Field] as unknown as boolean) ? 'on' : 'off'}
        checked={(props.Record[props.Field] as unknown as boolean)}
        disabled={props.Disabled == null ? false : props.Disabled}
      />
      {showHelpIcon || showLabel ?
        <label className='form-check-label'>{showLabel ? label : ''}
          {showHelpIcon ?
            <button className='btn mb-1 pt-0 pb-0' onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}>
              <ReactIcons.QuestionMark Color='var(--info)' Size={20} />
            </button>
            : null}
        </label> : null}

      {showHelpIcon ?
        <HelperMessage Show={showHelp} Target={guid}>
          {props.Help}
        </HelperMessage>
        : null}
    </div>
  );

}
