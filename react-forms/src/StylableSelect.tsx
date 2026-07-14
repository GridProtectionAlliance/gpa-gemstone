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
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { isEqual } from 'lodash';
import { Portal } from 'react-portal';
import { Gemstone } from '@gpa-gemstone/application-typings';
import * as _ from 'lodash';
import HelpIcon from './HelpIcon';

/** Describes a value and presentation metadata shown in the stylable select. */
export interface IOption {
  /** Value applied when the option is selected. */
  Value: any;
  /** Element or text rendered for the option. */
  Element: React.ReactElement<any> | string,
  /** Optional CSS class applied to the option row. */
  RowClass?: string;
  /** Optional inline styles applied to the option row. */
  RowStyle?: React.CSSProperties;
  /** Optional flag that prevents the option from being selected. */
  Disabled?: boolean;
}

/** Defines record binding and option presentation for the stylable select. */
interface IProps<T> {
  /**
   * Optional callback that determines whether the selected field value is valid.
   * @param field - Record field to validate.
   * @returns Whether the field is valid.
   */
  Valid?: (field: keyof T) => boolean;
  /**
   * Optional message shown when the selection is invalid.
   */
  Feedback?: string;
  /**
   * Record containing the currently selected value.
   */
  Record: T;
  /**
   * Record field updated by the selected option.
   */
  Field: keyof T;
  /**
   * Optional content shown above the select, defaulting to the field name.
   */
  Label?: string | JSX.Element;

  /**
   * Optional help content displayed beside the label.
   */
  Help?: string | JSX.Element;
  /**
   * Optional flag that disables option selection, defaulting to false.
   */
  Disabled?: boolean;
  /**
   * Updates the record after an option is selected.
   * @param record - Record containing the selected value.
   * @param option - Option selected by the user.
   */
  Setter: (record: T, option: IOption) => void
  /**
   * Choices rendered in the dropdown with custom React content.
   */
  Options: IOption[];
  /**
   * Optional CSS styles applied to the selected option content.
   */
  Style?: React.CSSProperties;
  /**
   * Optional CSS styles applied to the button that displays the selected option.
   */
  BtnStyle?: React.CSSProperties
  /**
   * Optional callback fired after the dropdown opens and its contents are rendered.
   */
  OnDropdownOpen?: () => void;
  /**
   * Optional callback fired after the dropdown closes.
   */
  OnDropdownClose?: () => void;
}

/**
 * Renders a dropdown whose options and selected value use custom React content.
 * @param props - Record binding, custom option content, and dropdown behavior.
 * @returns A stylable single-selection dropdown.
 */
export default function StylableSelect<T>(props: IProps<T>) {
  // State hooks and ref for managing component state and interactions.
  const stylableSelect = React.useRef<HTMLDivElement>(null);
  const selectTable = React.useRef<HTMLTableElement>(null);
  const tableContainer = React.useRef<HTMLDivElement>(null);

  const [show, setShow] = React.useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<number>(0);
  const [position, setPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: 0, Left: 0, Width: 0, Height: 0 });

  React.useLayoutEffect(() => {
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

  React.useEffect(() => {
    if (show) props.OnDropdownOpen?.();
    else props.OnDropdownClose?.();
  }, [show]);

  // Handle showing and hiding of the dropdown.
  const HandleShow = React.useCallback((evt: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent) => {
    // Ignore if disabled or not a mousedown event
    if ((props.Disabled === undefined ? false : props.Disabled) || evt.type !== 'mousedown' || stylableSelect.current == null) return;

    // if we’re about to OPEN it, measure right now
    if (!show && stylableSelect.current != null) {
      const rect = stylableSelect.current.getBoundingClientRect();
      setPosition({
        Top: rect.bottom,
        Left: rect.left,
        Width: rect.width,
        Height: rect.height
      });
    }

    //ignore the click if it was inside the table or table container
    if ((selectTable.current != null && selectTable.current.contains(evt.target as Node)) || (tableContainer.current != null && tableContainer.current.contains(evt.target as Node)))
      return

    if (!stylableSelect.current.contains(evt.target as Node)) setShow(false);
    else setShow(!show);
  }, [props.Disabled, show])

  // Update the parent component's state with the selected option.
  function SetRecord(selectedOption: IOption) {
    setSelectedOptionIndex(props.Options.findIndex(e => isEqual(e.Value, selectedOption.Value)));
    const record: T = { ...props.Record };
    if (selectedOption.Value !== '') record[props.Field] = selectedOption.Value as any;
    else record[props.Field] = null as any;

    props.Setter(record, selectedOption);
  }

  // Effect for initial setup and event listeners.
  React.useEffect(() => {
    document.addEventListener('mousedown', HandleShow, false);
    return () => {
      document.removeEventListener('mousedown', HandleShow, false);
    };
  }, [HandleShow]);

  // Effect to handle changes to the record's field value.
  React.useEffect(() => {
    const elementIndex: number = props.Options.findIndex(e => isEqual(e.Value, props.Record[props.Field] as any));
    setSelectedOptionIndex(elementIndex !== -1 ? elementIndex : 0);
  }, [props.Record, props.Options]);

  const handleOptionClick = (evt: React.MouseEvent<HTMLTableRowElement, MouseEvent>, option: IOption) => {
    SetRecord(option);
    setShow(false);
  }

  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const label = props.Label === undefined ? props.Field as string : props.Label;

  return (
    <div ref={stylableSelect} className="form-group" style={{ position: 'relative', display: 'inline-block', width: 'inherit' }}>
      {/* Label and help icon rendering */}
      {showLabel ?
        <label className="d-flex align-items-center">
          <span>
            {showLabel ? label : ''}
          </span>
          <HelpIcon Help={props.Help} />
        </label>
        : null}

      {/* Dropdown toggle button */}
      <div
        role="button"
        tabIndex={(props.Disabled ?? false) ? -1 : 0}
        style={{
          padding: '.375rem .75rem',
          ...(props.Disabled ?? false ? { pointerEvents: 'none', opacity: 0.65 } : {}),
          ...(props.BtnStyle ?? {})
        }}
        className={`dropdown-toggle form-control ${(props.Valid?.(props.Field) ?? true) ? '' : 'is-invalid'}`}
        onMouseDown={(evt) => evt.preventDefault()}
        onClick={(evt) => {
          HandleShow(evt);
          if(props.Disabled ?? false) return;
        }}

      >
        <div style={props.Style}>
          {props.Options[selectedOptionIndex]?.Element}
        </div>
      </div>

      {/* Invalid feedback message */}
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
      </div>

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
              {props.Options.map((f, i) => i === selectedOptionIndex ? null : ((
                <tr
                  key={`${i}-${JSON.stringify(f.Value)}`}
                  className={f.RowClass ?? ''}
                  style={f.RowStyle}
                  onMouseDown={(evt) => {
                    if (f.Disabled ?? false) {
                      evt.stopPropagation();
                      evt.preventDefault();
                      return;
                    }
                    handleOptionClick(evt, f);
                  }}
                  aria-disabled={f.Disabled ?? false}
                >
                  <td>
                    {f.Element}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Portal>

    </div>
  );
}
