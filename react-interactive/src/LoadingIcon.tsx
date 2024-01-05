// ******************************************************************************************************
//  LoadingIcon.tsx - Gbtc
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
//  01/11/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import styled, { keyframes} from "styled-components";

/**
* Props interface for the LoadingIcon component
*/
interface IProps {
    Show: boolean,
    Label?: string,
    Size?: number,
}

/**
* Keyframes for the spinning animation
*/
const spin = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;

/**
* Props interface for the Icon component
*/
interface IconProps {size: number}

/**
* Styled component for rendering the spinning icon
*/
const Icon = styled.div<IconProps>`
	animation: ${spin} 1s linear infinite;
	border: ${props => props.size/5}px solid #f3f3f3;
	border-Top: ${props => props.size/5}px solid #555;
	border-Radius: 50%;
	width: ${props => props.size}px;
	height: ${props => props.size}px
`;

/**
* Functional component for rendering a loading icon
*/
const LoadingIcon: React.FunctionComponent<IProps> = (props) => {

const h = (props.Size === undefined? 25 : props.Size);



    return (
      <div>
          <div style={{ width: (props.Label === undefined? h: undefined), margin: 'auto' }} hidden={!props.Show}>
              <Icon size={h}/>
              {props.Label !== undefined? <span>{props.Label}</span> : null}
          </div>
      </div>
    )
}

export default LoadingIcon;