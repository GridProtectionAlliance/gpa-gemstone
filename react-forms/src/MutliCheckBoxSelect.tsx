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
import { Gemstone } from '@gpa-gemstone/application-typings';
import { Portal } from 'react-portal';
import * as _ from 'lodash';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

interface IProps {
  /**
    * Label to display for the form, defaults to the Field prop
    * @type {string}
    * @optional
  */
  Label?: string;
  /**
    * Array of options for the multi-select checkboxe
    * @type {{ Value: number | string; Text: string; Selected: boolean }[]}
  */
  Options: { Value: number | string; Text: string; Selected: boolean }[];
  /**
    * Function to handle changes in the selection
    * @param evt - The change event
    * @param Options - The updated options array
    * @returns {void}
  */
  OnChange: (evt: any, Options: { Value: number | string; Text: string; Selected: boolean }[]) => void;
  /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
  */
  Help?: string | JSX.Element;
  /**
    * Tooltip style for the items
    * @type {'no-tip' | 'dark' | 'light'}
    * @optional
  */
  ItemTooltip?: 'no-tip' | 'dark' | 'light';
}

const MultiSelect = (props: IProps) => {
  // State hooks for managing the visibility of the dropdown and help message.
  const multiSelect = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);

  const [show, setShow] = React.useState<boolean>(false);
  const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const [showItems, setShowItems] = React.useState<boolean>(false);
  const [guid, setGuid] = React.useState<string>("");
  const showLabel = React.useMemo(() => props.Label !== "", [props.Label]);
  const showHelpIcon = React.useMemo(() => props.Help !== undefined, [props.Help]);
  const selectedOptions = React.useMemo(() => props.Options.filter(opt => opt.Selected), [props.Options]);
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });

  React.useEffect(() => {
    const updatePosition = _.debounce(() => {
      if (multiSelect.current != null) {
        const rect = multiSelect.current.getBoundingClientRect();
        setPosition({ Top: rect.bottom, Left: rect.left, Width: rect.width, Height: rect.height });
      }
    }, 200);
  
    const handleScroll = (event: Event) => {
      if(tableContainer.current == null) return

      if (event.type === 'scroll' && !tableContainer.current.contains(event.target as Node)) 
          setShow(false);
        updatePosition()
    };

    if (show) {
      updatePosition();
  
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
  
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updatePosition);
        updatePosition.cancel();
      };
    }
  
  }, [show]);

  // Effect to generate a unique ID for the component.
  React.useEffect(() => {
    setGuid(CreateGuid());
  }, []);

  // Handle showing and hiding of the dropdown.
  function HandleShow(evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) {
    if(selectTable.current != null && selectTable.current.contains(evt.target as Node)) return;

    //ignore the click if it was inside the table or table container
    if((selectTable.current != null && selectTable.current.contains(evt.target as Node)) || (tableContainer.current != null && tableContainer.current.contains(evt.target as Node)))
      return 

    if (multiSelect.current === null) setShow(!show);
    else if (!(multiSelect.current as HTMLDivElement).contains(evt.target as Node)) setShow(false);
    else setShow(true);
  }

  // Effect to add and remove event listener for clicking outside the component.
  React.useEffect(() => {
    document.addEventListener('mousedown', HandleShow, false);
    return () => {
      document.removeEventListener('mousedown', HandleShow, false);
    };
  }, []);

  return (
    <div className="form-group">
      {/* Rendering label and help icon */}
      {showLabel || showHelpIcon ?
        <label className='d-flex align-items-center'>{showLabel ?
          (props.Label === undefined ? 'Select' : props.Label) : ''}
          {showHelpIcon ?
            <button className='btn btn mb-1 pt-0 pb-0' onMouseEnter={() => setShowHelp(true)} onMouseLeave={() => setShowHelp(false)}>
            <ReactIcons.QuestionMark Color='var(--info)' Size={20}/>
          </button>
            : null}
        </label> : null
      }

      {showHelpIcon ?
        <HelperMessage Show={showHelp} Target={guid}>
          {props.Help}
        </HelperMessage>
        : null}
      {(props.ItemTooltip ?? 'no-tip') !== 'no-tip' ?
        <HelperMessage Show={showItems} Target={guid} Background={props.ItemTooltip === 'dark' ? "#222" : '#fff'} Color={props.ItemTooltip === 'dark' ? "#fff" : '#222'}>
          <p>Selected Options:</p>
          {selectedOptions.slice(0, 10).map(opt => <p>{opt.Text}</p>)}
          {selectedOptions.length > 10 ? <p>{`and ${selectedOptions.length - 10} other(s)`}</p> : null}
        </HelperMessage>
        : null}

      {/* Rendering the dropdown */}
      <div ref={multiSelect} style={{ position: 'relative', display: 'block', width: 'inherit' }}>
        <button
          data-help={guid}
          type="button"
          style={{ border: '1px solid #ced4da', padding: '.375rem .75rem', fontSize: '1rem', borderRadius: '.25rem' }}
          className="btn form-control dropdown-toggle"
          onClick={HandleShow}
          onMouseEnter={() => setShowItems(true)}
          onMouseLeave={() => setShowItems(false)}
        >
          {props.Options.filter((x) => x.Selected).length !== props.Options.length
            ? props.Options.filter((x) => x.Selected).length
            : 'All '}{' '}
          Selected
        </button>
        {/* Dropdown menu */}
        <Portal>
          <div ref={tableContainer}
            style={{
              maxHeight: window.innerHeight - position.Top,
              overflowY: 'auto',
              padding: '10 5',
              display: show ? 'block' : 'none',
              position: 'absolute',
              backgroundColor: '#fff',
              color: 'black',
              boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
              zIndex: 9999,
              top: `${position.Top}px`,
              left: `${position.Left}px`,
              width: `${position.Width}px`
            }}
          >
            {/* Table for checkboxes and options */}
            <table className="table" style={{ margin: 0 }} ref={selectTable}>
              <tbody>
                {/* Checkbox for selecting/deselecting all options */}
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

                {/* Checkboxes for individual options */}
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
        </Portal>
      </div>
    </div>
  );
};
export default MultiSelect;
