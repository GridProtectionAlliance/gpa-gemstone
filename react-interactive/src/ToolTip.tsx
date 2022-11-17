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
import Modal from './Modal';
import styled from "styled-components";
import { GetNodeSize, CreateGuid } from '@gpa-gemstone/helper-functions'
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
const ToolTip: React.FunctionComponent<IProps> = (props) => {
  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);
  const [guid, setGuid] = React.useState<string>("");

  React.useEffect(() => {
    setGuid(CreateGuid());
  }, []);

  React.useLayoutEffect(() => {
    const [t,l] = UpdatePosition();

    if (t !== top)
      setTop(t);
    if (l !== left)
        setLeft(l);

  })

  const zIndex = (props.Zindex === undefined? 2000: props.Zindex);
  
  function UpdatePosition() {
    const target = document.querySelectorAll(`[data-tooltip${ props.Target === undefined? '' : `="${props.Target}"`}]`);

    if (target.length === 0)
      return [-999,-999];

    const targetLocation = GetNodeSize(target[0] as HTMLElement);

    const toolTip = document.getElementById(guid);

    if (toolTip === null)
      return [-999,-999];
    const tipLocation = GetNodeSize(toolTip as HTMLElement);

    const offset = 5;

    const result: [number,number] = [0,0];

    if (props.Position === 'left') {
      result[0] = targetLocation.top + 0.5*targetLocation.height - 0.5*tipLocation.height;
      result[1] = targetLocation.left - tipLocation.width - offset;
    }
    else if (props.Position === 'right') {
      result[0] = targetLocation.top + 0.5*targetLocation.height - 0.5*tipLocation.height
      result[1] = targetLocation.left + targetLocation.width + offset;
    }
    else if (props.Position === 'top' || props.Position === undefined) {
      result[0] = targetLocation.top - tipLocation.height - offset;
      result[1] = targetLocation.left + 0.5* targetLocation.width - 0.5* tipLocation.width;
    }
    else if (props.Position === 'bottom') {
      result[0] = targetLocation.top + targetLocation.height + offset;
      result[1] = targetLocation.left + 0.5* targetLocation.width - 0.5* tipLocation.width;
    }

    return result;
  }

  const theme = (props.Theme === undefined? 'dark' : props.Theme);

    return (
      <Portal>
      <WrapperDiv Show={props.Show} Theme={theme} Top={top} Left={left} id={guid} Location={props.Position === undefined? 'top' : props.Position} Zindex={zIndex}>
        {props.children}
      </WrapperDiv>
      </Portal>
    )
}


export default ToolTip;
