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
import HelperMessage from './HelperMessage';
import { CreateGuid } from '@gpa-gemstone/helper-functions'

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
    * Options for the select dropdown
    * @type {{ Value: string; Label: string }[]}
  */
  Options: { Value: string; Label: string }[];
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
  Label?: string;
  /**
    * Flag to disable the input field
    * @type {boolean}
    * @optional
  */
  Disabled?: boolean;
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
  /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
  */
  Help?: string|JSX.Element;
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
    const currentValue: string = GetRecordValue();
    if (!(props.EmptyOption ?? false) && props.Options.length > 0 && props.Options.findIndex((option) => option.Value === currentValue) === -1) {
      SetRecord(props.Options[0].Value);
      // tslint:disable-next-line
      console.warn("The current value is not available as an option. Specify EmptyOption=true if the value should be allowed.")
    }
      
  }, [props.Options]);
    
  // Update the parent component's state with the new value.
  function SetRecord(value: string): void {
    const record: T = { ...props.Record };
    if (value !== '') record[props.Field] = value as any;
    else record[props.Field] = null as any;
    props.Setter(record);
  }

  // Rretrieve the current value of the select field from the record.
  function GetRecordValue(): string {
    return props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString();
  }

  return (
    <div className="form-group">
      {/* Rendering label and optional help icon */}
      {(props.Label !== "") ?
        <label>{props.Label === undefined ? props.Field : props.Label} 
        {props.Help !== undefined? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
        </label> : null 
      }
      
      {props.Help !== undefined? 
        <HelperMessage Show={showHelp} Target={guid}>
          {props.Help}
        </HelperMessage>
      : null}

      {/* Rendering the select input */}
      <select
        data-help={guid}
        className="form-control"
        onChange={(evt) => SetRecord(evt.target.value)}
        value={GetRecordValue()}
        disabled={props.Disabled == null ? false : props.Disabled}
      >
        {/* Optional empty option */}
        {(props.EmptyOption ?? false) ? <option value="">{props.EmptyLabel !== undefined? props.EmptyLabel : ''}</option> : null}
        
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
