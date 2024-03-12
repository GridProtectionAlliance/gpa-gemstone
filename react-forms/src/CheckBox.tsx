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

interface IProps<T>{
Record: T,
Field: keyof T,
Setter: (record: T) => void;
Label?: string,
Disabled?: boolean,
Help?: string|JSX.Element;
}

export default function CheckBox<T>(props: IProps<T>) {
  const [guid, setGuid] = React.useState<string>("");
  const [showHelp, setShowHelp] = React.useState<boolean>(false);

  const showHelpIcon = props.Help !== undefined;
  
  React.useEffect(() => {
    setGuid(CreateGuid());
    }, []);
    
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
          value={props.Record[props.Field] != null ? 'on' : 'off'}
          checked={props.Record[props.Field] != null ? true : false}
          disabled={props.Disabled == null ? false : props.Disabled}
        />
        <label className="form-check-label">{props.Label == null ? props.Field : props.Label}</label>
        {showHelpIcon ? 
      <div 
        style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} 
        onMouseEnter={() => setShowHelp(true)} 
        onMouseLeave={() => setShowHelp(false)}
      > 
        ? 
      </div> 
      : null}
    {showHelpIcon? 
      <HelperMessage Show={showHelp} Target={guid}>
        {props.Help}
      </HelperMessage>
    : null}
      </div>
    );
  
}
