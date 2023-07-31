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

interface IProps {
    Show: boolean,
    Position?: ('top'|'bottom'|'left'|'right'),
    Theme?: ('dark'|'light'),
    Target?: string,
    Zindex?: number,
}

interface IWrapperProps {
  Show: boolean,
  Theme: ('dark'|'light'),
  Top: number,
  Left: number,
  Location: ('top'|'bottom'|'left'|'right'),
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
    opacity: ${props => props.Show ? "0.9" : "0"};
    color: ${props => (props.Theme === 'dark' ? "#fff" :'#222')};
    background: ${props => (props.Theme === 'dark' ? "#222" :'#fff')};
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    border: 1px solid transparent;
  }
  ${props => (props.Location === 'top'? `
    &::after {
     border-left: 8px solid transparent;
     border-right: 8px solid transparent;
     border-top: 8px solid ${(props.Theme === 'dark' ? "#222" :'#fff')};
     left: 50%;
     bottom: -6px;
     margin-left: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  ` : '')}
  ${props => (props.Location === 'bottom'? `
    &::before {
     border-left: 8px solid transparent;
     border-right: 8px solid transparent;
     border-bottom: 8px solid ${(props.Theme === 'dark' ? "#222" :'#fff')};
     left: 50%;
     top: -6px;
     margin-left: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  `: '')}
  ${props => (props.Location === 'left'? `
    &::before {
     border-top: 8px solid transparent;
     border-bottom: 8px solid transparent;
     border-left: 8px solid ${(props.Theme === 'dark' ? "#222" :'#fff')};
     top: 50%;
     left: 100%;
     margin-top: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  `: '')}
  ${props => (props.Location === 'right'? `
    &::before {
     border-top: 8px solid transparent;
     border-bottom: 8px solid transparent;
     border-right: 8px solid ${(props.Theme === 'dark' ? "#222" :'#fff')};
     top: 50%;
     left: -6px;
     margin-top: -8px;
     content: "";
     width: 0px;
     height: 0px;
     position: absolute
    }
  `: '')}`

// The other element needs to be labeld as data-tooltip that will only be used for positioning
const ToolTip: React.FunctionComponent<React.PropsWithChildren<IProps>> = (props) => {
  const toolTip = React.useRef(null);

  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);

  const [targetLeft, setTargetLeft] = React.useState<number>(0);
  const [targetTop, setTargetTop] = React.useState<number>(0);
  const [targetWidth, setTargetWidth] = React.useState<number>(0);
  const [targetHeight, setTargetHeight] = React.useState<number>(0);

  const [x,setX] = React.useState<boolean>(false);


  React.useEffect(() => {
    const target = document.querySelectorAll(`[data-tooltip${ props.Target === undefined? '' : `="${props.Target}"`}]`)

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

    const h = setTimeout(() => {
      setX((a) => !a)
    }, 500);

    return () => { if (h !== null) clearTimeout(h); };

  }, [x])

  React.useEffect(() => {
    const [t,l] = UpdatePosition();
    if (t !== top)
      setTop(t);
    if (l !== left)
        setLeft(l); 
   }, [targetLeft,targetTop,targetWidth,targetHeight]);

   
  const zIndex = (props.Zindex === undefined? 2000: props.Zindex);
  
  function UpdatePosition() {
   
    if (toolTip.current === null)
      return [-999,-999];
  
    const tipLocation = GetNodeSize(toolTip.current);

    const offset = 5;

    const result: [number,number] = [0,0];

    if (props.Position === 'left') {
      result[0] = targetTop + 0.5*targetHeight - 0.5*tipLocation.height;
      result[1] = targetLeft - tipLocation.width - offset;
    }
    else if (props.Position === 'right') {
      result[0] = targetTop + 0.5*targetHeight - 0.5*tipLocation.height
      result[1] = targetLeft + targetWidth + offset;
    }
    else if (props.Position === 'top' || props.Position === undefined) {
      result[0] = targetTop - tipLocation.height - offset;
      result[1] = targetLeft + 0.5* targetWidth - 0.5* tipLocation.width;
    }
    else if (props.Position === 'bottom') {
      result[0] = targetTop + targetHeight + offset;
      result[1] = targetLeft + 0.5* targetWidth - 0.5* tipLocation.width;
    }

    return result;
  }

  const theme = (props.Theme === undefined? 'dark' : props.Theme);

    return (
      <Portal>
      <WrapperDiv Show={props.Show} Theme={theme} Top={top} Left={left} ref={toolTip} Location={props.Position === undefined? 'top' : props.Position} Zindex={zIndex}>
        {props.children}
      </WrapperDiv>
      </Portal>
    )
}


export default ToolTip;
