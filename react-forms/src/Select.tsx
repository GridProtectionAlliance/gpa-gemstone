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
  Record: T;
  Field: keyof T;
  Options: { Value: string; Label: string }[];
  Setter: (record: T) => void;
  Label?: string;
  Disabled?: boolean;
  EmptyOption?: boolean;
  EmptyLabel?: string;
  Help?: string|JSX.Element;
}


export default function Select<T>(props: IProps<T>) {
	const [guid, setGuid] = React.useState<string>("");
	const [showHelp, setShowHelp] = React.useState<boolean>(false);
	
	 React.useEffect(() => {
		setGuid(CreateGuid());
	  }, []);
	  
  return (
    <div className="form-group">
    {(props.Label !== "") ?
	  <label>{props.Label === null ? props.Field : props.Label} 
     {props.Help !== undefined? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
		</label> : null }
		{props.Help !== undefined? 
			<HelperMessage Show={showHelp} Target={guid}>
				{props.Help}
			</HelperMessage>
		: null}
      <select
		data-help={guid}
        className="form-control"
        onChange={(evt) => {
          const record: T = { ...props.Record };
          if (evt.target.value !== '') record[props.Field] = evt.target.value as any;
          else record[props.Field] = null as any;

          props.Setter(record);
        }}
        value={props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString()}
        disabled={props.Disabled == null ? false : props.Disabled}
      >
        {props.EmptyOption ? <option value="">{props.EmptyLabel !== undefined? props.EmptyLabel : ''}</option> : null}
        {props.Options.map((a, i) => (
          <option key={i} value={a.Value}>
            {a.Label}
          </option>
        ))}
      </select>
    </div>
  );
}
