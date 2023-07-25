// ******************************************************************************************************
//  GetTextHeight.tsx - Gbtc
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
//  03/12/2021 - c. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * This function returns the height of a piece of text given a font, fontsize, and a word
 * @param font: Determines font of given text
 * @param fontSize: Determines size of given font
 * @param word: Text to measure
 * @param cssStyle: Optional css style 
 * @param width: Optional set width of measurement (default: 'auto')
 * @param whiteSpace: Optional white space arguement (default: 'no-wrap')
 * @returns Height of text
 */
function GetTextHeight(font: string, fontSize: string, word: string, cssStyle?: string, width?: string, whiteSpace?: string): number {

    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = font;
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = width ?? 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = whiteSpace ?? 'no-wrap';
    
    if (cssStyle !== undefined)
        text.style.cssText = cssStyle

    text.innerHTML = word;

    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return height;

} 

export {GetTextHeight};