// ******************************************************************************************************
//  ToggleSwitch.tsx - Gbtc
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
//  04/19/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { CreateGuid } from '@gpa-gemstone/helper-functions'
import ToolTip from './ToolTip';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
    * CSS styles to apply to the form group
    * @type {React.CSSProperties}
    * @optional
  */
  Style?: React.CSSProperties;
}

export default function ToggleSwitch<T>(props: IProps<T>) {
  const [helpID] = React.useState<string>(CreateGuid());
  const [switchID] = React.useState<string>(CreateGuid());
  const [showHelp, setShowHelp] = React.useState<boolean>(false);

  // Variables to control the rendering of label and help icon.
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;

  return (
    <div className="custom-control custom-switch" style={props.Style}>
      <input
        type="checkbox"
        className="custom-control-input"
        onChange={(evt) => {
          const record: T = { ...props.Record };
          record[props.Field] = evt.target.checked as any;
          props.Setter(record);
        }}
        value={(props.Record[props.Field] as unknown as boolean) ? 'on' : 'off'}
        checked={(props.Record[props.Field] as unknown as boolean)}
        disabled={props.Disabled == null ? false : props.Disabled}
        id={switchID}
      />
      <label className="custom-control-label d-flex align-items-center" htmlFor={switchID}>
        <span>
          {label}
        </span>
        {showHelpIcon ?
          <>
            <span className="ml-2 d-flex align-items-center"
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              data-tooltip={helpID}
            >
              <ReactIcons.QuestionMark Color="var(--info)" Size={20} />
            </span>
            <ToolTip Show={showHelp} Target={helpID} Zindex={9999} Class="info" Position="bottom">
              {props.Help}
            </ToolTip>
          </>
          : null}
      </label>
    </div>
  );

}
