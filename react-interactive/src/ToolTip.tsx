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

interface IProps {
  Show: boolean,
  Position?: ('top' | 'bottom' | 'left' | 'right'),
  Target?: string,
  Zindex?: number,
}

// Props to style wrapper div around tooltip content.
interface IWrapperProps {
  Show: boolean,
  Top: number,
  Left: number,
  Location: ('top' | 'bottom' | 'left' | 'right'),
  Zindex: number,
  TargetLeft: number,
  TargetWidth: number
}

type IElementPosition = {
  Top: number,
  Left: number,
  Width: number,
  Height: number
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

// The other element needs to have data-tooltip attribute equal the target prop used for positioning
const ToolTip: React.FunctionComponent<IProps> = (props) => {
  const toolTip = React.useRef<HTMLDivElement | null>(null);
  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);

  const [targetPosition, setTargetPosition] = React.useState<IElementPosition>({ Top: -999, Left: -999, Width: 0, Height: 0 })

  React.useEffect(() => {
    const target = document.querySelectorAll(`[data-tooltip${props.Target === undefined ? '' : `="${props.Target}"`}]`)
    if (target.length === 0) {
      setTargetPosition({ Top: -999, Left: -999, Width: 0, Height: 0 })
      return;
    }

    const targetLocation = GetNodeSize(target[0] as HTMLElement);
    const newPosition = { Height: targetLocation.height, Top: targetLocation.top, Left: targetLocation.left, Width: targetLocation.width }
    if (!isEqual(newPosition, targetPosition))
      setTargetPosition(newPosition)
  }, [props.Show, props.Target, targetPosition]);

  React.useLayoutEffect(() => {
    const [t, l] = getPosition(toolTip, targetPosition, props.Position ?? 'top');
    setTop(t);
    setLeft(l);
  }, [targetPosition, props?.children, props.Position]);

  const zIndex = (props.Zindex === undefined ? 2000 : props.Zindex);

  return (
    <Portal>
      <WrapperDiv className={`popover bs-popover-${props.Position ?? 'top'} border`} Show={props.Show} Top={top} Left={left} ref={toolTip} Location={props.Position === undefined ? 'top' : props.Position} Zindex={zIndex} TargetLeft={targetPosition.Left} TargetWidth={targetPosition.Width}>
        <div className='arrow' style={{ left: 'calc(50% - 1em)' }} />
        <div className='popover-body'>
          {props.children}
        </div>
      </WrapperDiv>
    </Portal>
  )
}

//Helper function
const getPosition = (toolTip: React.MutableRefObject<HTMLDivElement | null>, targetPosition: IElementPosition, position: ('top' | 'bottom' | 'left' | 'right')) => {
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

  return [top, left];
}

export default ToolTip;