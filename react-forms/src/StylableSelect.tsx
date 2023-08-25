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

interface IOption {
  Value: any;
  Element: React.ReactElement<any>
}

interface IProps<T> {
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Options: IOption[];
  Label?: string;
  Disabled?: boolean;
  Help?: string|JSX.Element;
  Style?: React.CSSProperties;
}

export default function StylableSelect<T>(props: IProps<T>){
  const [show, setShow] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<React.ReactElement<any>>(props.Options[0].Element);
	const [guid, setGuid] = React.useState<string>("");
	const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const stylableSelect = React.useRef<HTMLDivElement>(null);

  function HandleShow(evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) {
    // Ignore if disabled or not a mousedown event
    if ((props.Disabled === undefined ? false : props.Disabled) || evt.type !== 'mousedown') return;
    
    if (!(stylableSelect.current as HTMLDivElement).contains(evt.target as Node)) setShow(false);
    else setShow(!show);
  }

  function SetRecord(selectedOption: IOption){
    setSelected(selectedOption.Element);
    const record: T = { ...props.Record };
    if (selectedOption.Value !== '') record[props.Field] = selectedOption.Value as any;
    else record[props.Field] = null as any;

    props.Setter(record);
  }

  React.useEffect(() => {
		setGuid(CreateGuid());
    document.addEventListener('mousedown', HandleShow, false);
    return () => {
      document.removeEventListener('mousedown', HandleShow, false);
    };
  }, []);

  React.useEffect(() => {
    const element: IOption | undefined = props.Options.find(e => e.Value === props.Record[props.Field] as any);
    setSelected(element !== undefined ? element.Element : <div/>);
  }, [props.Record]);

  return (
    <div ref={stylableSelect} style={{ position: 'relative', display: 'inline-block', width: 'inherit' }}>
      {(props.Label !== "") ?
      <label>{props.Label === undefined ? props.Field : props.Label} 
      {props.Help !== undefined? <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }} onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
      </label> : null }
      {props.Help !== undefined? 
        <HelperMessage Show={showHelp} Target={guid}>
          {props.Help}
        </HelperMessage>
      : null}
      <button
        type="button"
        style={{ border: '1px solid #ced4da', padding: '.375rem .75rem', fontSize: '1rem', borderRadius: '.25rem' }}
        data-help={guid}
        className="btn form-control dropdown-toggle"
        onClick={HandleShow}
        disabled={props.Disabled === undefined ? false : props.Disabled}
      >
        <div style={props.Style}>
          {selected}
        </div>
      </button>
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
            {props.Options.map((f, i) => (
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
