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
import ToolTip from './ToolTip';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { isEqual } from 'lodash';
import { Portal } from 'react-portal';
import { Gemstone } from '@gpa-gemstone/application-typings';
import * as _ from 'lodash';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

export interface IOption {
  Value: any;
  Element: React.ReactElement<any> | string,
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
      * Label to display for the form, defaults to the Field prop
      * @type {string | JSX.Element}
      * @optional
  */
  Label?: string | JSX.Element;

  /**
    * Help message or element to display
    * @type {string | JSX.Element}
    * @optional
  */
  Help?: string | JSX.Element;
  /**
    * Flag to disable the input field
    * @type {boolean}
    * @optional
  */
  Disabled?: boolean;
  /**
    * Setter function to update the Record
    * @param record - Updated Record
  */
  Setter: (record: T, option: IOption) => void
  /**
* Options for the select dropdown
* @type {{  Value: any, Element: React.ReactElement<any> }[]}
*/
  Options: IOption[];
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

export default function StylableSelect<T>(props: IProps<T>) {
  // State hooks and ref for managing component state and interactions.
  const stylableSelect = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);

  const [show, setShow] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<React.ReactElement<any> | string>(props.Options[0].Element);
  const [guid, setGuid] = React.useState<string>("");
  const [showHelp, setShowHelp] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });

  React.useEffect(() => {
    const updatePosition = _.debounce(() => {
      if (stylableSelect.current != null) {
        const rect = stylableSelect.current.getBoundingClientRect();
        setPosition({ Top: rect.bottom, Left: rect.left, Width: rect.width, Height: rect.height });
      }
    }, 200);

    const handleScroll = (event: Event) => {
      if (tableContainer.current == null) return

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

  // Handle showing and hiding of the dropdown.
  const HandleShow = React.useCallback((evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent) => {
    // Ignore if disabled or not a mousedown event
    if ((props.Disabled === undefined ? false : props.Disabled) || evt.type !== 'mousedown' || stylableSelect.current == null) return;

    //ignore the click if it was inside the table or table container
    if ((selectTable.current != null && selectTable.current.contains(evt.target as Node)) || (tableContainer.current != null && tableContainer.current.contains(evt.target as Node)))
      return

    if (!stylableSelect.current.contains(evt.target as Node)) setShow(false);
    else setShow(!show);
  }, [props.Disabled, show])


  // Update the parent component's state with the selected option.
  function SetRecord(selectedOption: IOption) {
    setSelected(selectedOption.Element);
    const record: T = { ...props.Record };
    if (selectedOption.Value !== '') record[props.Field] = selectedOption.Value as any;
    else record[props.Field] = null as any;

    props.Setter(record, selectedOption);
  }

  // Effect for initial setup and event listeners.
  React.useEffect(() => {
    setGuid(CreateGuid());
    document.addEventListener('mousedown', HandleShow, false);
    return () => {
      document.removeEventListener('mousedown', HandleShow, false);
    };
  }, [HandleShow]);

  // Effect to handle changes to the record's field value.
  React.useEffect(() => {
    const element: IOption | undefined = props.Options.find(e => isEqual(e.Value, props.Record[props.Field] as any));
    setSelected(element !== undefined ? element.Element : <div />);
  }, [props.Record, props.Options]);

  const handleOptionClick = (evt: React.MouseEvent<HTMLTableRowElement, MouseEvent>, option: IOption) => {
    SetRecord(option);
    setShow(false);
  }

  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const showHelpIcon = props.Help !== undefined;
  const label = props.Label === undefined ? props.Field : props.Label;

  return (
    <div ref={stylableSelect} style={{ position: 'relative', display: 'inline-block', width: 'inherit' }}>
      {/* Label and help icon rendering */}
      {showHelpIcon || showLabel ?
        <label className="d-flex align-items-center">
          <span>{showLabel ? label : ''}</span>
          {showHelpIcon && (
            <span
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              data-tooltip={guid}
              className="ml-2 d-flex align-items-center"
            >
              <ReactIcons.QuestionMark Color="var(--info)" Size={20} />
            </span>
          )}
        </label>
        : null}

      {props.Help !== undefined ?
        <ToolTip Show={showHelp} Target={guid} Class="info" Position="bottom">
          {props.Help}
        </ToolTip>
        : null}

      {/* Dropdown toggle button */}
      <button
        type="button"
        style={{ border: '1px solid #ced4da', padding: '.375rem .75rem', fontSize: '1rem', borderRadius: '.25rem', ...(props.BtnStyle ?? {}) }}
        className="btn form-control dropdown-toggle"
        onClick={HandleShow}
        disabled={props.Disabled === undefined ? false : props.Disabled}
      >
        <div style={props.Style}>
          {selected}
        </div>
      </button>

      {/* Dropdown menu with options */}
      <Portal>
        <div ref={tableContainer} className='popover'
          style={{
            maxHeight: window.innerHeight - position.Top,
            overflowY: 'auto',
            padding: '10 5',
            display: show ? 'block' : 'none',
            position: 'absolute',
            zIndex: 9999,
            top: `${position.Top}px`,
            left: `${position.Left}px`,
            minWidth: `${position.Width}px`,
            maxWidth: '100%'
          }}
        >
          <table className="table table-hover" style={{ margin: 0 }} ref={selectTable}>
            <tbody>
              {props.Options.map((f, i) => (
                f.Value === props.Record[props.Field] ? null :
                  <tr key={i} onMouseDown={(evt) => handleOptionClick(evt, f)}>
                    <td>
                      {f.Element}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Portal>

    </div>
  );
}
