// ******************************************************************************************************
//  HexToHsv.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  09/07/2023 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * Converts RGB hex code to a HSV color. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * code from https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c.
 * Assumes color in hex code.
 * returns h, s, and v that are contained in the set [0, 1].
 *
 * @param   Number  h       Hex Code (format of #123456 or 123456 digits)
 * @returns String          Spaced color in hex code.
 */
function HexToHsv(hex: string){
    const hexTrimmed = hex[0] === "#" ? hex.slice(1) : hex;
    function convertHex(valueIndex: number) {
        return (Number("0x"+ hexTrimmed.slice(2*valueIndex, 2*(valueIndex+1))));
    }
    const r = convertHex(0)/255; const g = convertHex(1)/255; const b = convertHex(2)/255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0; const s = max == 0 ? 0 : d / max; const v = max;

    if(max === min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {h, s, v};
}

export {HexToHsv}