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
import ToolTip from './ToolTip';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { Gemstone } from '@gpa-gemstone/application-typings';

export interface IProps<T> extends Gemstone.TSX.Interfaces.IBaseFormProps<T> {
  /**
    * Number of rows for the textarea
    * @type {number}
  */
  Rows: number;
  /**
    * Function to determine the validity of a field
    * @param field - Field of the record to check
    * @returns {boolean}
  */
  Valid: (field: keyof T) => boolean;
  /**
    * Feedback message to show when input is invalid
    * @type {string}
    * @optional
  */
  Feedback?: string;
  /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
  */
  Help?: string | JSX.Element;
  /**
   * Optional reference to internal text area for features like autocomplete.
   * @type {React.RefObject<HTMLTextAreaElement>}
   * @optional
   */
  TextAreaRef?: React.RefObject<HTMLTextAreaElement>

  /**
   * Optional setting to enable/disable spellcheck.
   * @type {boolean}
   * @optional
   */
  SpellCheck?: boolean;
}

export default function TextArea<T>(props: IProps<T>) {
  // Internal ref and state hooks for managing the component state.
  const internal = React.useRef<boolean>(false)
  const [guid] = React.useState<string>(CreateGuid())

  const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const [heldVal, setHeldVal] = React.useState<string>('');

  // Effect to handle changes to the record's field value.
  React.useEffect(() => {
    if (!internal.current) {
      setHeldVal(props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString());
    }
    internal.current = false;

  }, [props.Record[props.Field]]);

  // Handle value change of the textarea.
  function valueChange(value: string) {
    internal.current = true;
    props.Setter({ ...props.Record, [props.Field]: value !== '' ? value : null });
    setHeldVal(value);
  }

  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;

  return (
    <div className="form-group">
      {/* Rendering label and help icon */}
      {showHelpIcon || showLabel ?
        <label className="d-flex align-items-center">
          <span>{showLabel ? label : ''}</span>
          {showHelpIcon && (
            <span className="ml-2 d-flex align-items-center"
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              data-tooltip={guid}
            >
              <ReactIcons.QuestionMark Color="var(--info)" Size={20} />
            </span>
          )}
        </label>
        : null}

      {/* Help message component */}
      {showHelpIcon ?
        <ToolTip Show={showHelp} Target={guid} Class="info" Position="top">
          {props.Help}
        </ToolTip>
        : null}

      {/* Textarea element */}
      <textarea
        ref={props.TextAreaRef}
        rows={props.Rows}
        className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
        onChange={(evt) => valueChange(evt.target.value)}
        value={heldVal == null ? '' : heldVal}
        disabled={props.Disabled == null ? false : props.Disabled}
        spellCheck={props.SpellCheck ?? true}
      />

      {/* Invalid feedback message */}
      <div className="invalid-feedback">
        {props.Feedback == null ? (props.Field as string) + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
