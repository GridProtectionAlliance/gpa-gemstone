// ******************************************************************************************************
//  SpacedColor.tsx - Gbtc
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
//  05/09/2023 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

// Spacing values
let currentHue: number = Math.random();
const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

/**
 * This function returns a semi-random color with a spacing value between subseqent calls.
 * adapted from https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/.
 * Assumes s, and v are contained in the set [0, 1] and
 * returns color in hex code.
 *
 * @param   Number  s   The saturation (within [0, 1])
 * @param   Number  v   The value (within [0, 1])
 * @returns String      Spaced color in hex code.
 */
function SpacedColor(saturation: number, value: number){
    currentHue = (currentHue + GOLDEN_RATIO_CONJUGATE) % 1;
    return HsvToHex(currentHue, saturation, value)
}

/**
 * Converts an HSV color value to RGB hex code. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * code from https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns color in hex code.
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @returns String          Spaced color in hex code.
 */
function HsvToHex(h: number, s: number, v: number){
    // tslint:disable-next-line
    let r, g, b: number;

    const i: number = Math.floor(h * 6);
    const f: number = h * 6 - i;
    const p: number = v * (1 - s);
    const q: number = v * (1 - f * s);
    const t: number = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        default: r = v, g = p, b = q; break;
    }

    function convertHex(deci: number) {
        return ("00" + Math.floor(deci * 255).toString(16)).slice(-2);
    }

    return "#" + convertHex(r) + convertHex(g) + convertHex(b);
}

export {SpacedColor}