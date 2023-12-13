// ******************************************************************************************************
//  MultiCheckBoxSelect.tsx - Gbtc
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
//  07/17/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import { CreateGuid } from '@gpa-gemstone/helper-functions';
import * as React from 'react';
import HelperMessage from './HelperMessage';

interface IProps {
  Label?: string;
  Options: { Value: number | string; Text: string; Selected: boolean }[];
  OnChange: (evt: any, Options: { Value: number | string; Text: string; Selected: boolean }[]) => void;
  Help?: string|JSX.Element;
}
const MultiSelect = (props: IProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>("");
  const multiSelect = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setGuid(CreateGuid());
    }, []);
    
  function HandleShow(evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) {
    if (multiSelect.current === null) setShow(!show);
    else if (!(multiSelect.current as HTMLDivElement).contains(evt.target as Node)) setShow(false);
    else setShow(true);
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', HandleShow, false);
    return () => {
      document.removeEventListener('mousedown', HandleShow, false);
    };
  }, []);

  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? 'Select' : props.Label;
  
  return (
    <div className="form-group">
    {showLabel || showHelpIcon ?
    <label>{showLabel? label : ''} 
    {showHelpIcon? <div 
    style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-block', background: '#0D6EFD', marginLeft: 10, textAlign: 'center', fontWeight: 'bold' }}
     onMouseEnter={() => setShowHelp(true)} 
     onMouseLeave={() => setShowHelp(false)}> ? </div> : null}
    </label> : null}
    {showHelpIcon? 
      <HelperMessage Show={showHelp} Target={guid}>
        {props.Help}
      </HelperMessage>
    : null}
    <div ref={multiSelect} style={{ position: 'relative', display: 'block', width: 'inherit' }}>
      <button
        type="button"
        style={{ border: '1px solid #ced4da', padding: '.375rem .75rem', fontSize: '1rem', borderRadius: '.25rem' }}
        className="btn form-control dropdown-toggle"
        onClick={HandleShow}
      >
        {props.Options.filter((x) => x.Selected).length !== props.Options.length
          ? props.Options.filter((x) => x.Selected).length
          : 'All '}{' '}
        Selected
      </button>
      <div
        style={{
          maxHeight: window.innerHeight * 0.75,
          overflowY: 'auto',
          padding: '10 5',
          display: show ? 'block' : 'none',
          position: 'absolute',
          backgroundColor: '#fff',
          color: 'black',
          boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
          zIndex: 401,
          minWidth: '100%',
        }}
      >
        <table className="table" style={{ margin: 0 }}>
          <tbody>
            <tr
              onClick={(evt) => {
                evt.preventDefault();
                props.OnChange(
                  evt,
                  props.Options.filter(
                    (x) => x.Selected === (props.Options.filter((o) => o.Selected).length === props.Options.length),
                  ),
                );
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={props.Options.filter((x) => x.Selected).length === props.Options.length}
                  onChange={() => null}
                />
              </td>
              <td>All</td>
            </tr>
            {props.Options.map((f, i) => (
              <tr key={i} onClick={(evt) => props.OnChange(evt, [f])}>
                <td>
                  <input type="checkbox" checked={f.Selected} onChange={() => null} />
                </td>
                <td>{f.Text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};
export default MultiSelect;
