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
import { BlockPicker, ColorResult } from 'react-color';
import styled from "styled-components";
import { GetNodeSize } from '@gpa-gemstone/helper-functions'
import { Portal } from 'react-portal';

interface IProps {
    CurrentColor: string,
    Colors?: string[],
    OnColorChange: (updatedColor: ColorResult) => void,
    Triangle?: ('hide' | 'top'),
    BtnText?: string
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
    color: #fff; // Dark theme color
    background: #222; // Dark theme background
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    border: 1px solid transparent;
  }
`

const ColorPicker: React.FunctionComponent<IProps> = (props) => {
    const toolTip = React.useRef(null);

    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);

    const [targetLeft, setTargetLeft] = React.useState<number>(0);
    const [targetTop, setTargetTop] = React.useState<number>(0);
    const [targetWidth, setTargetWidth] = React.useState<number>(0);
    const [targetHeight, setTargetHeight] = React.useState<number>(0);
    const [show, setShow] = React.useState<boolean>(false)
    const colorsArray = props.Colors ?? ["#A30000", "#0029A3", "#007A29", "#d3d3d3", "#edc240",
        "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed", "#BD9B33", "#EE2E2F",
        "#008C48", "#185AA9", "#F47D23", "#662C91", "#A21D21", "#B43894",
        "#737373", "#ff904f", "#ff9999"]

    React.useEffect(() => {
        const target = document.querySelectorAll(`[data-tooltip${`="color-picker"`}]`)

        if (target.length === 0) {
            setTargetHeight(0);
            setTargetWidth(0);
            setTargetLeft(-999);
            setTargetTop(-999);
        }
        else {
            const targetLocation = GetNodeSize(target[0] as HTMLElement);
            setTargetHeight(targetLocation.height);
            setTargetWidth(targetLocation.width);
            setTargetLeft(targetLocation.left);
            setTargetTop(targetLocation.top);
        }
    }, []);

    React.useLayoutEffect(() => {
        const [t, l] = UpdatePosition();
        setTop(t);
        setLeft(l);
    });

    function UpdatePosition() {

        if (toolTip.current === null)
            return [-999, -999];

        const colorPickerHeight = 280
        const colorPickerWidth = 180
        const tipLocation = GetNodeSize(toolTip.current);
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

    return (
        <>
            <button className="btn btn-block" data-tooltip={"color-picker"} onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)} style={{ backgroundColor: props.CurrentColor, borderColor: props.CurrentColor }}>
                {props.BtnText ? props.BtnText : "Color"}
            </button>
            <Portal>
                <WrapperDiv Show={show} Top={top} Left={left} ref={toolTip} onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)}>
                    <BlockPicker
                        color={props.CurrentColor}
                        colors={colorsArray}
                        onChangeComplete={(updatedColor) => {
                            props.OnColorChange(updatedColor);
                        }}
                        triangle={props.Triangle ? props.Triangle : 'hide'}
                    />
                </WrapperDiv>
            </Portal>
        </>
    )

}

export default ColorPicker;