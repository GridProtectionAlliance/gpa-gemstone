// ******************************************************************************************************
//  StylableSelect.tsx - Gbtc
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
//  10/14/2022 - Gabriel Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import HelperMessage from './HelperMessage';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { isEqual } from 'lodash';

export interface IOption {
  Value: any;
  Element: React.ReactElement<any>
}

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
    * Options for the select dropdown
    * @type {{  Value: any, Element: React.ReactElement<any> }[]}
  */
  Options: IOption[];
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
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
  */
  Help?: string|JSX.Element;
  /**
    * CSS styles to apply to the selected value
    * @type {React.CSSProperties}
    * @optional
  */
  Style?: React.CSSProperties;
  /**
   * CSS style to apply to the button holding the selected value
    * @type {React.CSSProperties}
    * @optional
    *    
    */
   BtnStyle?: React.CSSProperties
}

export default function StylableSelect<T>(props: IProps<T>){
  // State hooks and ref for managing component state and interactions.
  const [show, setShow] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<React.ReactElement<any>>(props.Options[0].Element);
	const [guid, setGuid] = React.useState<string>("");
	const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const stylableSelect = React.useRef<HTMLDivElement>(null);

  // Handle showing and hiding of the dropdown.
  function HandleShow(evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) {
    // Ignore if disabled or not a mousedown event
    if ((props.Disabled === undefined ? false : props.Disabled) || evt.type !== 'mousedown') return;
    
    if (!(stylableSelect.current as HTMLDivElement).contains(evt.target as Node)) setShow(false);
    else setShow(!show);
  }

  // Update the parent component's state with the selected option.
  function SetRecord(selectedOption: IOption){
    setSelected(selectedOption.Element);
    const record: T = { ...props.Record };
    if (selectedOption.Value !== '') record[props.Field] = selectedOption.Value as any;
    else record[props.Field] = null as any;

    props.Setter(record);
  }

  // Effect for initial setup and event listeners.
  React.useEffect(() => {
		setGuid(CreateGuid());
    document.addEventListener('mousedown', HandleShow, false);
    return () => {
      document.removeEventListener('mousedown', HandleShow, false);
    };
  }, []);

  // Effect to handle changes to the record's field value.
  React.useEffect(() => {
    const element: IOption | undefined = props.Options.find(e => isEqual(e.Value, props.Record[props.Field] as any));
    setSelected(element !== undefined ? element.Element : <div/>);
  }, [props.Record, props.Options]);

  return (
    <div ref={stylableSelect} style={{ position: 'relative', display: 'inline-block', width: 'inherit' }}>
      {/* Label and help icon rendering */}
      {(props.Label !== "") ?
        <label>{props.Label === undefined ? props.Field : props.Label} 
        {props.Help !== undefined? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
        </label> : null }

      {props.Help !== undefined? 
        <HelperMessage Show={showHelp} Target={guid}>
          {props.Help}
        </HelperMessage>
      : null}

      {/* Dropdown toggle button */}
      <button
        type="button"
        style={{ border: '1px solid #ced4da', padding: '.375rem .75rem', fontSize: '1rem', borderRadius: '.25rem', ...(props.BtnStyle ?? {})}}
        data-help={guid}
        className="btn form-control dropdown-toggle"
        onClick={HandleShow}
        disabled={props.Disabled === undefined ? false : props.Disabled}
      >
        <div style={props.Style}>
          {selected}
        </div>
      </button>

      {/* Dropdown menu with options */}
      <div
        style={{
          maxHeight: window.innerHeight * 0.75,
          overflowY: 'auto',
          padding: '10 5',
          display: show ? 'block' : 'none',
          position: 'absolute',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          zIndex: 401,
          minWidth: '100%',
        }}
      >
        <table className="table" style={{ margin: 0 }}>
          <tbody>
            {props.Options.map((f, i) => ( f.Value == props.Record[props.Field] ? null :
              <tr key={i} onClick={(evt) => {evt.preventDefault(); SetRecord(f); setShow(false);}}>
                <td>
                  {f.Element}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
