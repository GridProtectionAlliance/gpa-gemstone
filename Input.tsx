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
import { CreateGuid } from '@gpa-gemstone/helper-functions'

interface IProps<T> {
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Valid: (field: keyof T) => boolean;
  Label?: string;
  Feedback?: string;
  Disabled?: boolean;
  Type?: 'number' | 'text' | 'password' | 'email' | 'color';
  Help?: string|JSX.Element;
}


export default function Input<T>(props: IProps<T>) {
	const [guid, setGuid] = React.useState<string>("");
	const [showHelp, setShowHelp] = React.useState<boolean>(false);
	
	 React.useEffect(() => {
		setGuid(CreateGuid());
	  }, []);

    function valueChange(evt: any) {
        if (props.Type === 'number')
            props.Setter({ ...props.Record, [props.Field]: evt.target.value !== '' && evt.target.value.toString().indexOf('.') === -1 ? parseFloat(evt.target.value) : null })
        else
            props.Setter({ ...props.Record, [props.Field]: evt.target.value !== '' && evt.target.value.toString().indexOf('.') === -1 ? evt.target.value : null })
    }
    
  return (
    <div className="form-group">
		<label>{props.Label == null ? props.Field : props.Label} 
		{props.Help !== undefined? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
		</label>
		{props.Help !== undefined? 
			<HelperMessage Show={showHelp} Target={guid}>
				{props.Help}
			</HelperMessage>
              : null}
          <input
		data-help={guid}
              type={props.Type === undefined ? 'text' : props.Type}
              className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
        onChange={(evt) => valueChange(evt)}
        value={props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString()}
        disabled={props.Disabled == null ? false : props.Disabled}
      />
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
