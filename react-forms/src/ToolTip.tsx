// ******************************************************************************************************
//  ToolTip.tsx - Gbtc
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
//  01/14/2021 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import styled from "styled-components";
import { GetNodeSize } from '@gpa-gemstone/helper-functions'
import { Portal } from 'react-portal';
import { isEqual } from 'lodash';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps {
  Show: boolean,
  Position?: 'top' | 'bottom' | 'left' | 'right',
  Target?: string,
  Zindex?: number,
  // These are bootstrap colors
  Color?: 'none' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white'
}

// Props to style wrapper div around tooltip content.
interface IWrapperProps {
  Show: boolean,
  Top: number,
  Left: number,
  Zindex: number,
}

// The styled tooltip wrapper component.
const WrapperDiv = styled.div<IWrapperProps>`
  & {
    display: inline-block;
    font-size: 13px;
    position: fixed;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
    z-index: ${props => props.Zindex};
    opacity: ${props => props.Show ? "0.9" : "0"};
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    max-width: 100%;
  }
`;

interface IArrowProps {
  ColorVar?: string,
  Position?: string
}

const WrapperArrow = styled.div<IArrowProps>`
  ${(props: IArrowProps) => `
    &::after {
      ${(props.ColorVar == null || props.ColorVar === 'none') ? '' :
      `border-${props.Position ?? "top"}-color: var(--${props.ColorVar}) !important;`
      }
    }
  `}`

const defaultTargetPosition = { Top: -999, Left: -999, Width: 0, Height: 0 }

// The other element needs to have data-tooltip attribute equal the target prop used for positioning
const ToolTip: React.FunctionComponent<IProps> = (props) => {
  const toolTip = React.useRef<HTMLDivElement | null>(null);
  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);
  const [arrowPositionPercent, setArrowPositionPercent] = React.useState<number>(50);

  const [targetPosition, setTargetPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>(defaultTargetPosition)

  const useBootStrapColor = React.useMemo(() => (props.Color != null && props.Color != 'none'), [props.Color]);
  const textColor = React.useMemo(() => getTextColor(props.Color), [props.Color]);

  React.useEffect(() => {
    const target = document.querySelectorAll(`[data-tooltip${props.Target === undefined ? '' : `="${props.Target}"`}]`)
    if (target.length === 0) {
      setTargetPosition(defaultTargetPosition)
      return;
    }

    const targetLocation = GetNodeSize(target[0] as HTMLElement);
    const newPosition = { Height: targetLocation.height, Top: targetLocation.top, Left: targetLocation.left, Width: targetLocation.width }
    if (!isEqual(newPosition, targetPosition))
      setTargetPosition(newPosition)
  }, [props.Show, props.Target, targetPosition]);

  React.useLayoutEffect(() => {
    const [t, l, arrowLeft] = getPosition(toolTip, targetPosition, props.Position ?? 'top');
    setTop(t);
    setLeft(l);
    setArrowPositionPercent(arrowLeft);
  }, [targetPosition, props?.children, props.Position]);

  const zIndex = (props.Zindex === undefined ? 9999 : props.Zindex);

  return (
    <Portal>
      <WrapperDiv className={`${useBootStrapColor ? `bg-${props.Color} border-${props.Color} ` : ''}popover border bs-popover-${props.Position ?? 'top'}`} Show={props.Show} Top={top} Left={left} ref={toolTip} Zindex={zIndex}>
        <WrapperArrow
        className='arrow' 
        style={props.Position === 'left' || props.Position === 'right' ? { top: `calc(${arrowPositionPercent}% - 1em)` } : { left: `calc(${arrowPositionPercent}% - 1em)` }}
        ColorVar={props.Color}
        Position={props.Position}
        />
        <div className={`${useBootStrapColor ? `text-${textColor} ` : ''}popover-body`}>
          {props.children}
        </div>
      </WrapperDiv>
    </Portal>
  )
}

//Helper function
const getPosition = (toolTip: React.MutableRefObject<HTMLDivElement | null>, targetPosition: Gemstone.TSX.Interfaces.IElementPosition, position: ('top' | 'bottom' | 'left' | 'right')) => {
  if (toolTip.current === null)
    return [-999, -999];

  const tipLocation = GetNodeSize(toolTip.current);
  const offset = 5;
  let top = 0;
  let left = 0;
  const windowWidth = window.innerWidth;

  if (position === 'left') {
    top = targetPosition.Top + 0.5 * targetPosition.Height - 0.5 * tipLocation.height;
    left = targetPosition.Left - tipLocation.width - offset;
  }
  else if (position === 'right') {
    top = targetPosition.Top + 0.5 * targetPosition.Height - 0.5 * tipLocation.height
    left = targetPosition.Left + targetPosition.Width + offset;
  }
  else if (position === 'top' || position === undefined) {
    top = targetPosition.Top - tipLocation.height - offset;
    left = targetPosition.Left + 0.5 * targetPosition.Width - 0.5 * tipLocation.width;

    // If tooltip goes beyond right viewport boundary adjust left position to fit
    if (left + tipLocation.width > windowWidth)
      left = windowWidth - tipLocation.width - offset;

    // If tooltip goes beyond left viewport boundary adjust left position to fit
    if (left < 0)
      left = offset;
  }
  else if (position === 'bottom') {
    top = targetPosition.Top + targetPosition.Height + offset;
    left = targetPosition.Left + 0.5 * targetPosition.Width - 0.5 * tipLocation.width;

    //If tooltip goes beyond right viewport boundary adjust left position to fit
    if (left + tipLocation.width >= windowWidth)
      left = windowWidth - tipLocation.width - offset;

    //If tooltip goes beyond left viewport boundary adjust left position to fit
    if (left <= 0)
      left = offset;
  }

  let arrowPositionPercent = 50; // Default to center

  if (position === 'top' || position === 'bottom') {
    const targetCenter = targetPosition.Left + 0.5 * targetPosition.Width;
    arrowPositionPercent = ((targetCenter - left) / tipLocation.width) * 100;
  } else if (position === 'left' || position === 'right') {
    const targetCenter = targetPosition.Top + 0.5 * targetPosition.Height;
    arrowPositionPercent = ((targetCenter - top) / tipLocation.height) * 100;
  }

  return [top, left, arrowPositionPercent];
}

const getTextColor = (color?: string) => {
  switch(color) {
    case 'none': case undefined: return undefined;
    case 'warning': case 'light': case 'white': return 'dark';
    default: return 'white';
  }
}

export default ToolTip;