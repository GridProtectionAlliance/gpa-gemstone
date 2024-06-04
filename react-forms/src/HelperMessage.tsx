// ******************************************************************************************************
//  HelperMessage.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  05/05/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import styled from "styled-components";
import { GetNodeSize } from '@gpa-gemstone/helper-functions'
import { Portal } from 'react-portal'
import { isEqual } from 'lodash';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps {
  Show: boolean,
  Target?: string,
  Zindex?: number,
  Color?: string,
  Background?: string
}

interface IWrapperProps {
  Show: boolean,
  Top: number,
  Left: number,
  Zindex: number,
  Color?: string,
  Background?: string,
  TargetLeft: number,
  TargetWidth: number,
  Width: number
}

const WrapperDiv = styled.div<IWrapperProps>`
  & {
    border-radius: 3px;
    display: inline-block;
    font-size: 13px;
    padding: 8px 21px;
    position: fixed;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
    z-index: ${props => props.Zindex};
    opacity: ${props => props.Show ? "1.0" : "0"};
    color: ${props => props.Color ?? '#000'};;
    background: ${props => props.Background ?? '#0DCAF0'};
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    width: ${props => `${props.Width}px`};
    border: 1px solid transparent;
  }
  ${props => `
    &::before {
     border-left: 8px solid transparent;
     border-right: 8px solid transparent;
     border-bottom: 8px solid ${props.Background ?? '#0DCAF0'};
     left: ${props.TargetLeft - props.Left + props.TargetWidth / 2}px;
     top: -6px;
     margin-left: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  `}`

const HelperMessage: React.FunctionComponent<IProps> = (props) => {
  const helpMessage = React.useRef<HTMLDivElement | null>(null);

  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);
  const [targetPosition, setTargetPosition] = React.useState<Gemstone.Interfaces.IElementSize>({ Top: -999, Left: -999, Width: 0, Height: 0 })

  React.useEffect(() => {
    const target = document.querySelectorAll(`[data-help${props.Target === undefined ? '' : `="${props.Target}"`}]`);

    if (target.length === 0) {
      setTargetPosition({ Height: 0, Top: -999, Left: -999, Width: 0 })
      return;
    }

    const targetLocation = GetNodeSize(target[0] as HTMLElement);
    let newPosition = { Height: targetLocation.height, Top: targetLocation.top, Left: targetLocation.left, Width: targetLocation.width }
    if (!isEqual(newPosition, targetPosition))
      setTargetPosition(newPosition)

  }, [props.Show]);


  React.useLayoutEffect(() => {
    const [t, l] = UpdatePosition(helpMessage, targetPosition);
    setTop(t);
    setLeft(l);
  }, [targetPosition])

  const zIndex = (props.Zindex === undefined ? 9999 : props.Zindex);

  return (
    <Portal>
      <WrapperDiv Show={props.Show} Top={top} Left={left} ref={helpMessage} Zindex={zIndex} Color={props.Color} Background={props.Background} TargetLeft={targetPosition.Left} TargetWidth={targetPosition.Width} Width={targetPosition.Width}>
        {props.children}
      </WrapperDiv>
    </Portal>
  )
}


const UpdatePosition = (helpMessage: React.MutableRefObject<HTMLDivElement | null>, targetPosition: Gemstone.Interfaces.IElementSize) => {
  if (helpMessage.current === null)
    return [-999, -999];

  const offset = 5;
  const windowWidth = window.innerWidth;

  let top = targetPosition.Top + targetPosition.Height + offset
  let left = targetPosition.Left
  let width = targetPosition.Width;

  // If tooltip goes beyond the right viewport boundary, adjust the left position to fit
  if (left + width >= windowWidth)
    left = windowWidth - width - offset;

  // If tooltip goes beyond the left viewport boundary, adjust the left position to fit
  if (left <= 0)
    left = offset;

  return [top, left, width];
}

export default HelperMessage;