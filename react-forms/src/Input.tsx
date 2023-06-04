// ******************************************************************************************************
//  Input.tsx - Gbtc
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
//  05/05/2021 - C. Lackner
//       Added Help Message.
//
// ******************************************************************************************************

import * as React from 'react';
import HelperMessage from './HelperMessage';
import { CreateGuid, IsInteger, IsNumber } from '@gpa-gemstone/helper-functions'

interface IProps<T> {
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Valid: (field: keyof T) => boolean;
  Label?: string;
  Feedback?: string;
  Disabled?: boolean;
  Type?: 'number' | 'text' | 'password' | 'email' | 'color' | 'integer';
  Help?: string|JSX.Element;
  Style?: React.CSSProperties;
  AllowNull?: boolean;
  Size?: 'small'|'large'
}


export default function Input<T>(props: IProps<T>) {
	const [guid, setGuid] = React.useState<string>("");
	const [showHelp, setShowHelp] = React.useState<boolean>(false);
	const [internal, setInternal] = React.useState<boolean>(false);
	const [heldVal, setHeldVal] = React.useState<string>(''); // Need to buffer tha value because parseFloat will throw away trailing decimals or zeros
	
	 React.useEffect(() => {
		setGuid(CreateGuid());
	  }, []);
	
    React.useEffect(() => {
      if (!internal) {
        setHeldVal(props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString());
      }
      setInternal(false);
     }, [props.Record[props.Field]]);

	function valueChange(value: string) {
        setInternal(true);

    const allowNull = props.AllowNull === undefined? false : props.AllowNull;
    if (props.Type === 'number') {
      const v = (value.length > 0 && value[0] === '.'? ("0" + value) : value)
      if (IsNumber(v) || (v === '' && allowNull)) {
          props.Setter({ ...props.Record, [props.Field]: v !== '' ? parseFloat(v) : null });
          setHeldVal(v);
        }
      
    }
    else if (props.Type === 'integer') {
        if (IsInteger(value) || (value === '' && allowNull)) {
            props.Setter({ ...props.Record, [props.Field]: value !== '' ? parseFloat(value) : null });
            setHeldVal(value);
        }
    }
    else {
        props.Setter({ ...props.Record, [props.Field]: value !== '' ? value : null });
        setHeldVal(value);
    }
  }
  
  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;

  return (
    <div className={"form-group " + (props.Size === 'large'? 'form-group-lg' : '') + (props.Size === 'small'? 'form-group-sm' : '')} style={props.Style}>
    {showHelpIcon || showLabel ?
		<label>{showLabel ? label : ''} 
		{showHelpIcon? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
		</label> : null}
		{showHelpIcon? 
			<HelperMessage Show={showHelp} Target={guid}>
				{props.Help}
			</HelperMessage>
		: null}
      <input
		    data-help={guid}
        type={props.Type === undefined ? 'text' : props.Type}
        className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
        onChange={(evt) => valueChange(evt.target.value)}
        value={heldVal}
        disabled={props.Disabled == null ? false : props.Disabled}
      />
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
