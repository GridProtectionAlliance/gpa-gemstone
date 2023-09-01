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
import { GetNodeSize, CreateGuid } from '@gpa-gemstone/helper-functions'


interface IProps {
    Show: boolean,
    Target?: string,
  Zindex?: number,
}

interface IWrapperProps {
  Show: boolean,
  Top: number,
  Left: number,
  Width: number,
  Zindex: number,
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
    color: #000;
    background: #0DCAF0;
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
  width: ${props => `${props.Width}px`};
    border: 1px solid transparent;
  }
  
  ${props => `
    &::before {
     border-left: 8px solid transparent;
     border-right: 8px solid transparent;
     border-bottom: 8px solid #0DCAF0;
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
    const [top, setTop] = React.useState<number>(0);
    const [left, setLeft] = React.useState<number>(0);
    const [width, setWidth] = React.useState<number>(0);
    const [guid, setGuid] = React.useState<string>("");

    React.useEffect(() => {
    setGuid(CreateGuid());
    }, []);

    React.useLayoutEffect(() => {
    const [t,l,w] = UpdatePosition();

    if (t !== top)
      setTop(t);
    if (l !== left)
      setLeft(l);
    if (w !== width)
      setWidth(w);
    })

  const zIndex = (props.Zindex === undefined? 2000: props.Zindex);
  
  function UpdatePosition() {
    const target = document.querySelectorAll(`[data-help${ props.Target === undefined? '' : `="${props.Target}"`}]`);

    if (target.length === 0)
      return [-999,-999];

    const targetLocation = GetNodeSize(target[0] as HTMLElement);

    const message = document.getElementById(guid);

    if (message === null)
      return [-999,-999];
    const msgLocation = GetNodeSize(message as HTMLElement);

    const offset = 5;

    const result: [number, number, number] = [0,0,0];

  result[0] = targetLocation.top + targetLocation.height + offset;
  result[1] = targetLocation.left;
  result[2] = targetLocation.width;
  
    return result;
  }

    return (
      <WrapperDiv Show={props.Show} Top={top} Left={left} Width={width} id={guid} Zindex={zIndex}>
        {props.children}
      </WrapperDiv>
    )
}


export default HelperMessage;
  