// ******************************************************************************************************
//  JoinKeyValuePairs.tsx - Gbtc
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
//  11/09/2023 - Preston Crawford
//       Migrated code from GSF.
//
// ******************************************************************************************************
import { IsBool } from "./IsBool";

/**
 * Combines an object of key/value pairs into a delimited string.
 *
 * @param source - An object of kvp pairs.
 * @param parameterDelimiter - Delimiter between parameters (default `";"`).
 * @param keyValueDelimiter - Delimiter between key and value (default `"="`).
 * @param startValueDelimiter - Delimiter to wrap the start of values containing delimiters (default `"{"`).
 * @param endValueDelimiter - Delimiter to wrap the end of values containing delimiters (default `"}"`).
 * @returns A string of joined key/value pairs
 */
export const JoinKeyValuePairs = (source: Record<string, string>, parameterDelimiter = ";", keyValueDelimiter = "=", startValueDelimiter = "{", endValueDelimiter = "}") => {
    const values: string[] = [];

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            let value: string | null | undefined = source[key];

            if (IsBool(value ?? ''))
                value = value.toString().toLowerCase();
            else
                value = value != null ? (value?.toString() ?? '') : '';

            if (
                value.indexOf(parameterDelimiter) >= 0 ||
                value.indexOf(keyValueDelimiter) >= 0 ||
                value.indexOf(startValueDelimiter) >= 0 ||
                value.indexOf(endValueDelimiter) >= 0
            )
                value = startValueDelimiter + value + endValueDelimiter;

            values.push(key + keyValueDelimiter + value);
        }
    }

    return values.join(parameterDelimiter + " ");
}