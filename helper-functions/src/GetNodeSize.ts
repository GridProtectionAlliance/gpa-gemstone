// ******************************************************************************************************
//  GetNodeSize.tsx - Gbtc
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
//  01/15/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

interface INodeSize {height: number, width: number, left: number, top: number}

/**
 * GetNodeSize returns the dimensions of an html element 
 * @param node: An HTML element, or null can be passed through
 * @returns Dimensions of HTML element
 */
function GetNodeSize(node: HTMLElement | null): INodeSize {
  if (node === null)
	  return {
		height: 0,
		width: 0,
		top: 0,
		left: 0,
	  };
  
  const { height, width, top, left } = node.getBoundingClientRect();
  return {
    height: parseInt(height.toString(), 10),
    width: parseInt(width.toString(), 10),
    top: parseInt(top.toString(), 10),
    left: parseInt(left.toString(), 10),
  };
} 

export {GetNodeSize};