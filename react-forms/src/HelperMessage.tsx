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
import {Portal } from 'react-portal'

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
  Width: number,
  Zindex: number,
  Color?: string,
  Background?: string
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
     left: 50%;
     top: -6px;
     margin-left: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  `}`
  
  
  const HelperMessage: React.FunctionComponent<IProps> = (props) => {
    const helpMessage = React.useRef(null);

    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);

    const [targetLeft, setTargetLeft] = React.useState<number>(0);
    const [targetTop, setTargetTop] = React.useState<number>(0);
    const [targetWidth, setTargetWidth] = React.useState<number>(0);
    const [targetHeight, setTargetHeight] = React.useState<number>(0);

    React.useEffect(() => {
      const target = document.querySelectorAll(`[data-help${props.Target === undefined ? '' : `="${props.Target}"`}]`);

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
  }, [props.Show]);


    React.useLayoutEffect(() => {
    const [t,l,w] = UpdatePosition();
      setTop(t);
      setLeft(l);
      setWidth(w);
    })

  const zIndex = (props.Zindex === undefined? 9999: props.Zindex);
  
  function UpdatePosition() {
    if (helpMessage.current === null)
      return [-999,-999];

    const offset = 5;

    const result: [number, number, number] = [0,0,0];

    result[0] = targetTop + targetHeight + offset;
    result[1] = targetLeft;
    result[2] = targetWidth;
    
    return result;
  }

    return (
      <Portal>
      <WrapperDiv Show={props.Show} Top={top} Left={left} Width={width} ref={helpMessage} Zindex={zIndex} Color={props.Color} Background={props.Background}>
        {props.children}
      </WrapperDiv>
      </Portal>
    )
}


export default HelperMessage;
  