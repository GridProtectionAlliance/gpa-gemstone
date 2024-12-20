// ******************************************************************************************************
//  GetTextWidth.tsx - Gbtc
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
//  01/07/2021 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * GetTextWidth returns the width of a piece of text given its font, fontSize, and content.
 * @param font: Determines font of given text
 * @param fontSize: Determines size of given font
 * @param word: Text to measure
 * @param cssStyle: Optional css style 
 * @param height: Optional set height of measurement (default: 'auto')
 * @param whiteSpace: Optional white space arguement (default: 'no-wrap')
 * @param containerWidth: Optional width of the container wrapping the text, useful when the text is multiline and width is limited
 * @returns Width of text
 */
function GetTextWidth(font: string, fontSize: string, word: string, cssStyle?: string, height?: string, whiteSpace?: string, containerWidth?: string): number {
    const text = document.createElement("span");

    if (cssStyle !== undefined)
        text.style.cssText = cssStyle;

    // Set font properties
    text.style.font = font;
    text.style.fontSize = fontSize;
    text.style.height = height ?? 'auto';
    text.style.width = 'auto';
    text.style.whiteSpace = whiteSpace ?? 'nowrap';
    text.innerHTML = word;

    // Create a container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    container.style.overflow = 'visible'; // So overflowed text is measured
    container.style.height = height ?? 'auto';
    container.style.width = containerWidth ?? 'auto';
    container.style.whiteSpace = whiteSpace ?? 'nowrap';

    // Append text to the container
    container.appendChild(text);
    document.body.appendChild(container);

    // Measure the width
    const width = text.offsetWidth;

    // Clean up
    document.body.removeChild(container);

    return Math.ceil(width);
}


export {GetTextWidth};