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

import { HsvToHex } from "./HsvToHex";

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

export {SpacedColor}