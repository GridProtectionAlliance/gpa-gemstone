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

// Interface for the props
interface IProps {
    /**
    * Flag to show the helper message
    * @type {boolean}
   */
    Show: boolean,
    /**
    * Value of the target element's data-help attribute
    * @type {string}
    * @optional
    */
    Target?: string,
    /**
    * z-index for the helper message
    * @type {number}
   */
    Zindex?: number,
}

// Interface for the properties of the WrapperDiv component
interface IWrapperProps {
  Show: boolean,
  Top: number,
  Left: number,
  Zindex: number,
  TargetLeft: number,
  TargetWidth: number,
  Width: number
}

// Styled component for the wrapper of the helper message.
const WrapperDiv = styled.div<IWrapperProps>`
  & {
    border-radius: 3px;
    display: inline-block;
    font-size: 13px;
    padding: 8px 21px;
    position: fixed;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
    z-index: ${(props: IWrapperProps) => props.Zindex};
    opacity: ${(props: IWrapperProps) => props.Show ? "1.0" : "0"};
    top: ${(props: IWrapperProps) => `${props.Top}px`};
    left: ${(props: IWrapperProps) => `${props.Left}px`};
    width: ${(props: IWrapperProps) => `${props.Width}px`};
    border: 1px solid transparent;
  }
  ${(props: IWrapperProps) => `
    &::before {
     border-left: 8px solid transparent;
     border-right: 8px solid transparent;
     border-bottom: 8px solid var(--info);
     left: ${props.TargetLeft - props.Left + props.TargetWidth / 2}px;
     top: -6px;
     margin-left: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  `}`
  
  /**
   * HelperMessage Component.
   * Displays a floating message box.
   */
  const HelperMessage: React.FunctionComponent<IProps> = (props) => {
    const helpMessage = React.useRef(null);

    // State variables for positioning and sizing the helper message.
    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);


    // State variables for the target element's position and size.
  const [targetPosition, setTargetPosition] = React.useState<Gemstone.TSX.Interfaces.IElementPosition>({ Top: -999, Left: -999, Width: 0, Height: 0 })

    // Effect for updating the target element's position and size.
    React.useEffect(() => {
      const target = document.querySelectorAll(`[data-help${props.Target === undefined ? '' : `="${props.Target}"`}]`);
  
      if (target.length === 0) {
        setTargetPosition({ Height: 0, Top: -999, Left: -999, Width: 0 })
        return;
      }
  
      const targetLocation = GetNodeSize(target[0] as HTMLElement);
      const newPosition = { Height: targetLocation.height, Top: targetLocation.top, Left: targetLocation.left, Width: targetLocation.width }
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
      <WrapperDiv className='bg-info' Show={props.Show} Top={top} Left={left} ref={helpMessage} Zindex={zIndex} TargetLeft={targetPosition.Left} TargetWidth={targetPosition.Width} Width={targetPosition.Width}>
        {props.children}
      </WrapperDiv>
    </Portal>
  )
}


const UpdatePosition = (helpMessage: React.MutableRefObject<HTMLDivElement | null>, targetPosition: Gemstone.TSX.Interfaces.IElementPosition) => {
  if (helpMessage.current === null)
    return [-999, -999];

  const offset = 5;
  const windowWidth = window.innerWidth;

  const top = targetPosition.Top + targetPosition.Height + offset
  let left = targetPosition.Left
  const width = targetPosition.Width;

  // If tooltip goes beyond the right viewport boundary, adjust the left position to fit
  if (left + width >= windowWidth)
    left = windowWidth - width - offset;

  // If tooltip goes beyond the left viewport boundary, adjust the left position to fit
  if (left <= 0)
    left = offset;

  return [top, left, width];
}

export default HelperMessage;