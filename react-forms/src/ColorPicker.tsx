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

interface IProps<T> {
    /**
      * Record to be used in the form
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
      * @param record - Updated record of type T
      * @param color - Color result from the picker
      * @returns {void}
    */
    Setter: (record: T, color: ColorResult) => void;
    /**
      * Label to display for the form, defaults to the Field prop
      * @type {string}
      * @optional
    */
    Label: string;
    /**
      * Flag to disable the input field
      * @type {boolean}
      * @optional
    */
    Disabled?: boolean;
    /**
      * Feedback message to show when input is invalid
      * @type {string}
      * @optional
    */
    Feedback?: string;
    /**
      * CSS styles to apply to the button
      * @type {React.CSSProperties}
      * @optional
    */
    Style?: React.CSSProperties;
    /**
      * List of colors to be used in the color picker
      * @type {string[]}
      * @optional
    */
    Colors?: string[];
    /**
      * Position of the triangle pointer in the color picker
      * @type {'hide' | 'top'}
      * @optional
    */
    Triangle?: 'hide' | 'top';
}

interface IWrapperProps {
    Show: boolean,
    Top: number,
    Left: number,
}

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
`

interface ISize {
    Top: number,
    Left: number,
    Width: number,
    Height: number
}

export default function ColorPicker<T>(props: IProps<T>) {
    const toolTipRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);

    const [targetPosition, setTargetPosition] = React.useState<ISize>({ Top: -999, Left: -999, Width: 0, Height: 0 })

    const [show, setShow] = React.useState<boolean>(false)
    const colors = props.Colors ?? ["#A30000", "#0029A3", "#007A29", "#d3d3d3", "#edc240",
        "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed", "#BD9B33", "#EE2E2F",
        "#008C48", "#185AA9", "#F47D23", "#662C91", "#A21D21", "#B43894",
        "#737373", "#ff904f", "#ff9999"]

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

    return (
        <>
            <button disabled={props.Disabled ?? false} ref={buttonRef} className="btn btn-block" data-tooltip={"color-picker"} onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)} style={props.Style}>
                {props.Label ?? ""}
            </button>
            {props.Feedback !== undefined && (props.Disabled ?? false) ?
                <div className="text-danger">
                    {props.Feedback}
                </div> : null}
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
        </>
    )
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
