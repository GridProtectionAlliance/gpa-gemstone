// ******************************************************************************************************
//  ComputeMin.tsx - Gbtc
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
//  07/08/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * Returns the smallest non-NaN value in the array, or NaN if none.
 */
export function ComputeMin(values: number[]): number {
    let min = Infinity;
    for (const v of values) {
        if (isNaN(Number(v))) continue;
        if (v < min) min = v;
    }
    return min === Infinity ? NaN : min;
}