// ******************************************************************************************************
//  TextArea.tsx - Gbtc
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
//  11/03/2023 - C Lackner
//       Added internal state to avoid cursor jumping.
//
// ******************************************************************************************************
import * as React from 'react';
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import HelperMessage from './HelperMessage';

interface IProps<T> {
  Rows: number;
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Valid: (field: keyof T) => boolean;
  Label?: string;
  Feedback?: string;
  Disabled?: boolean;
  Help?: string | JSX.Element;
}

export default function TextArea<T>(props: IProps<T>) {
  const [guid, setGuid] = React.useState<string>("");
  const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const [internal, setInternal] = React.useState<boolean>(false);
  const [heldVal, setHeldVal] = React.useState<string>('');
  
  React.useEffect(() => {
    if (!internal) {
      setHeldVal(props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString());
    }
    setInternal(false);
   }, [props.Record[props.Field]]);

  React.useEffect(() => {
      setGuid(CreateGuid());
  }, []);

  function valueChange(value: string) {
    setInternal(true);
    props.Setter({ ...props.Record, [props.Field]: value !== '' ? value : null });
    setHeldVal(value);
   }

  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;

  return (
    <div className="form-group" data-help={guid}>
    {showHelpIcon || showLabel ?
        <label>{showLabel ? label : ''}
            {showHelpIcon ? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
        </label> : null}
    {showHelpIcon ?
        <HelperMessage Show={showHelp} Target={guid}>
            {props.Help}
        </HelperMessage>
        : null}
    <textarea
        rows={props.Rows}
        className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
        onChange={(evt) => valueChange(evt.target.value)}
        value={heldVal == null ? '' : heldVal}
        disabled={props.Disabled == null ? false : props.Disabled}
    />
    <div className="invalid-feedback">
        {props.Feedback == null ? props.Field + ' is a required field.' : props.Feedback}
    </div>
</div>
);
}
