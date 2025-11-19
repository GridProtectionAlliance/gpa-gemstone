// ******************************************************************************************************
//  GetScrollBarWidth.tsx - Gbtc
//
//  Copyright © 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  04/03/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************


const GetScrollbarWidth = () => {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    document.body.appendChild(outer);
  
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const outerWidth = outer.getBoundingClientRect().width;
    const innerWidth = inner.getBoundingClientRect().width;

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outerWidth - innerWidth);
  
    // Removing temporary elements from the DOM
    outer.parentNode!.removeChild(outer);
  
    return scrollbarWidth;
}

export default GetScrollbarWidth;