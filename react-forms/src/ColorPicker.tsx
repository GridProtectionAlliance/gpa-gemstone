//******************************************************************************************************
//  ColorPicker.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  03/05/2024 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { BlockPicker, Color, ColorResult } from 'react-color';
import styled from "styled-components";
import { GetNodeSize } from '@gpa-gemstone/helper-functions'
import { Portal } from 'react-portal';
import { isEqual } from 'lodash';
import { Gemstone } from '@gpa-gemstone/application-typings';
import HelpIcon from './HelpIcon';

interface IProps<T> extends Omit<Gemstone.TSX.Interfaces.IBaseFormProps<T>, "Setter"> {
  /**
   * Updates the record after a color is selected.
   * @param record - Record containing the selected color.
   * @param color - Complete result returned by the color picker.
   */
  Setter: (record: T, color: ColorResult) => void;
  /**
   * Optional callback that determines whether the color field is valid.
   * @param field - Record field containing the selected color.
   * @returns Whether the field is valid.
   */
  Valid?: (field: keyof T) => boolean;
  /**
   * Optional message shown when the selected color is invalid.
   */
  Feedback?: string;
  /**
   * Optional CSS styles applied to the form group and color button.
   */
  Style?: React.CSSProperties;
  /**
   * Optional palette displayed by the picker, defaulting to the built-in color list.
   */
  Colors?: string[];
  /**
   * Optional triangle pointer position, defaulting to `hide`.
   */
  Triangle?: 'hide' | 'top';
}

interface IWrapperProps {
  /**
   * Controls whether the color picker wrapper is visible and interactive.
   */
  Show: boolean,
  /**
   * Vertical viewport position of the wrapper in pixels.
   */
  Top: number,
  /**
   * Horizontal viewport position of the wrapper in pixels.
   */
  Left: number,
}

/**
 * Positions and fades the floating color palette relative to its trigger.
 * @param props - Visibility and viewport coordinates for the palette.
 * @returns A styled wrapper for the color palette.
 */
const WrapperDiv = styled.div<IWrapperProps>`
  & {
    border-radius: 3px;
    display: inline-block;
    font-size: 13px;
    padding: 8px;
    position: fixed;
    transition: opacity 0.3s ease-out;
    z-index: 99999;
    pointer-events: ${props => props.Show ? 'auto' : 'none'};
    opacity: ${props => props.Show ? "0.9" : "0"};
    color: currentColor;
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    border: 1px solid transparent;
  }
`;

interface ISize {
  Top: number,
  Left: number,
  Width: number,
  Height: number
}
/**
 * Renders a button that opens a palette for editing a record's color field.
 * @param props - Record binding, palette configuration, and change handler.
 * @returns A labeled color picker control and floating palette.
 */
const ColorPicker = <T,>(props: IProps<T>) => {
  const toolTipRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);

  const [targetPosition, setTargetPosition] = React.useState<ISize>({ Top: -999, Left: -999, Width: 0, Height: 0 })

  const [show, setShow] = React.useState<boolean>(false)

  const colors = props.Colors ?? [
    "#A30000", "#0029A3", "#007A29", "#d3d3d3", "#FF0000",
    "#0066CC", "#33CC33", "#4287f5", "#edc240", "#afd8f8",
    "#cb4b4b", "#4da74d", "#9440ed", "#BD9B33", "#EE2E2F",
    "#008C48", "#185AA9", "#F47D23", "#662C91", "#A21D21",
    "#B43894", "#737373"
  ];

  React.useLayoutEffect(() => {
    if (buttonRef.current === null) return;
    const targetLocation = GetNodeSize(buttonRef.current);
    const newTargetPosition = { Top: targetLocation.top, Left: targetLocation.left, Height: targetLocation.height, Width: targetLocation.width }

    if (!isEqual(newTargetPosition, targetPosition)) {
      setTargetPosition(newTargetPosition);
      const [t, l] = GetBestPosition(toolTipRef, targetLocation.top, targetLocation.height, targetLocation.left, targetLocation.width);
      setTop(t);
      setLeft(l);
    }
  });

  // Variables to control the rendering of label and help icon.
  const showLabel = props.Label !== "";
  const label = props.Label === undefined ? props.Field as string : props.Label;

  return (
    <div className={"form-group "} style={props.Style}>
      {/* Rendering label and help icon */}
      {showLabel ?
        <label className="d-flex align-items-center">
          <span>{showLabel ? label : ''}</span>
          <HelpIcon Help={props.Help} />
        </label>
        : null}

      {/* Input element */}
      <button
        disabled={props.Disabled ?? false}
        ref={buttonRef}
        className={`btn btn-block form-control${props.Valid == null || props.Valid(props.Field) ? '' : ' is-invalid'}`}
        data-tooltip={"color-picker"}
        onMouseOver={() => setShow(true)}
        onMouseOut={() => setShow(false)}
        style={{ ...props.Style, backgroundColor: props.Record[props.Field] as any, color: "#ffffff" }}
      >
        {props.Record[props.Field] as string ?? ""}
      </button>
      <Portal>
        {!(props.Disabled ?? false) ?
          <WrapperDiv className="popover popover-body border" Show={show} Top={top} Left={left} ref={toolTipRef} onMouseOver={() => (props.Disabled ?? false) ? {} : setShow(true)} onMouseOut={() => setShow(false)}>
            <BlockPicker
              color={props.Record[props.Field] as unknown as Color}
              colors={colors}
              onChangeComplete={(updatedColor) => {
                const record: T = { ...props.Record };
                record[props.Field] = updatedColor.hex as any
                props.Setter(record, updatedColor);
              }}
              triangle={props.Triangle ?? 'hide'}
            />
          </WrapperDiv>
          : <></>}
      </Portal>

      {/* Invalid feedback message */}
      <div className="invalid-feedback">
        {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}

const GetBestPosition = (ref: React.RefObject<HTMLDivElement>, targetTop: number, targetHeight: number, targetLeft: number, targetWidth: number) => {
  if (ref.current === null)
    return [-999, -999];

  const colorPickerHeight = 280
  const colorPickerWidth = 180
  const tipLocation = GetNodeSize(ref.current);
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth
  const result: [number, number] = [0, 0];

  //start by placing at the bottom of the button and rotating counter clockwise until there is enough space to fit the colorpicker
  result[0] = targetTop + targetHeight;
  result[1] = targetLeft + 0.5 * targetWidth - 0.5 * tipLocation.width;

  //try to place colorpicker to the right of the button if there isnt enough room below
  if (windowHeight - result[0] < colorPickerHeight) {
    result[0] = targetTop + 0.5 * targetHeight - 0.5 * tipLocation.height
    result[1] = targetLeft + targetWidth;

    //try to place colorpicker on the top of the button if there isnt enough room to the right
    if (windowWidth - result[1] < colorPickerWidth) {
      result[0] = targetTop - tipLocation.height;
      result[1] = targetLeft + 0.5 * targetWidth - 0.5 * tipLocation.width;

      //move colorpicker to the left of the button if there isnt enough space on the top
      if (result[0] < 0) {
        result[0] = targetTop + 0.5 * targetHeight - 0.5 * tipLocation.height;
        result[1] = targetLeft - tipLocation.width;
      }
    }
  }

  return result;
}

export default ColorPicker;