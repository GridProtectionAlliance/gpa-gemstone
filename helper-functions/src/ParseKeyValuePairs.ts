// ******************************************************************************************************
//  ParseKeyValuePairs.tsx - Gbtc
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

import { RegexEncode } from "./RegexEncode";
import { ReplaceAll } from "./ReplaceAll";

/**
 * Pre-scans the input string to determine which start/end value delimiter
 * positions form properly matched pairs. Returns a Set of character indices
 * that participate in a valid match. Unmatched delimiters are excluded so
 * the main parser can treat them as literal characters.
 */
const findMatchedDelimiterPositions = (
    str: string,
    startValueDelimiter: string,
    endValueDelimiter: string
): Set<number> => {
    const matched = new Set<number>();
    let escaped = false;
    let depth = 0;
    let outerStart = -1;
    const nestedStarts: number[] = [];

    for (let i = 0; i < str.length; i++) {
        const ch = str[i];

        if (!escaped) {
            if (ch === startValueDelimiter) {
                escaped = true;
                outerStart = i;
                depth = 0;
            }
            // Stray end delimiter outside escaped mode -- just skip it
        } else {
            if (ch === startValueDelimiter) {
                nestedStarts.push(i);
                depth++;
            } else if (ch === endValueDelimiter) {
                if (depth > 0) {
                    const nestedStart = nestedStarts.pop()!;
                    matched.add(nestedStart);
                    matched.add(i);
                    depth--;
                } else {
                    // Closes the outer pair
                    matched.add(outerStart);
                    matched.add(i);
                    escaped = false;
                    outerStart = -1;
                }
            }
        }
    }

    // If we're still in escaped mode at end-of-string, the outer start
    // and any unclosed nested starts are unmatched -- they were intentionally
    // left out of the matched set. Any nested pairs that DID close inside
    // are already in the set and stay valid.

    return matched;
};

/**
 * Parses a delimited string into key/value pairs
 *
 * @param str - The input string containing key/value pairs.
 * @param parameterDelimiter - Delimiter between parameters (default `';'`).
 * @param keyValueDelimiter - Delimiter between key and value (default `'='`).
 * @param startValueDelimiter - Delimiter marking the start of a nested value (default `'{'`).
 * @param endValueDelimiter - Delimiter marking the end of a nested value (default `'}'`).
 * @param ignoreDuplicateKeys - If `true`, later values overwrite earlier ones for duplicate keys (default `true`).
 * @returns A `Map<string, string>` of parsed keys to their corresponding values.
 * @throws If any delimiters are not unique, or if duplicate keys are disallowed and encountered.
 */
export const ParseKeyValuePairs = (
    str: string,
    parameterDelimiter = ';',
    keyValueDelimiter = "=",
    startValueDelimiter = "{",
    endValueDelimiter = "}",
    ignoreDuplicateKeys = true
) => {

    if (parameterDelimiter === keyValueDelimiter ||
        parameterDelimiter === startValueDelimiter ||
        parameterDelimiter === endValueDelimiter ||
        keyValueDelimiter === startValueDelimiter ||
        keyValueDelimiter === endValueDelimiter ||
        startValueDelimiter === endValueDelimiter)
        throw "All delimiters must be unique";

    const escapedParameterDelimiter = RegexEncode(parameterDelimiter);
    const escapedKeyValueDelimiter = RegexEncode(keyValueDelimiter);
    const escapedStartValueDelimiter = RegexEncode(startValueDelimiter);
    const escapedEndValueDelimiter = RegexEncode(endValueDelimiter);
    const backslashDelimiter = RegexEncode("\\");

    // First pass: find which { } positions are properly matched.
    // Unmatched delimiters will be treated as literal characters.
    const matchedPositions = findMatchedDelimiterPositions(str, startValueDelimiter, endValueDelimiter);

    const keyValuePairs = new Map();
    const escapedValue = [];
    let valueEscaped = false;
    let delimiterDepth = 0;

    // Escape any parameter or key/value delimiters within tagged value sequences
    //      For example, the following string:
    //          "normalKVP=-1; nestedKVP={p1=true; p2=false}")
    //      would be encoded as:
    //          "normalKVP=-1; nestedKVP=p1\\u003dtrue\\u003b p2\\u003dfalse")
    for (let i = 0; i < str.length; i++) {
        const character = str[i];
        const isMatchedDelimiter = matchedPositions.has(i);

        if (character === startValueDelimiter && isMatchedDelimiter) {
            if (!valueEscaped) {
                valueEscaped = true;
                continue; // Don't add tag start delimiter to final value
            }

            // Handle nested delimiters
            delimiterDepth++;
        }

        if (character === endValueDelimiter && isMatchedDelimiter) {
            if (valueEscaped) {
                if (delimiterDepth > 0) {
                    // Handle nested delimiters
                    delimiterDepth--;
                } else {
                    valueEscaped = false;
                    continue; // Don't add tag stop delimiter to final value
                }
            }
            // Unmatched end delimiters that somehow got here are treated as literals below
        }

        if (valueEscaped) {
            // Escape any delimiter characters inside nested key/value pair
            if (character === parameterDelimiter)
                escapedValue.push(escapedParameterDelimiter);
            else if (character === keyValueDelimiter)
                escapedValue.push(escapedKeyValueDelimiter);
            else if (character === startValueDelimiter)
                escapedValue.push(escapedStartValueDelimiter);
            else if (character === endValueDelimiter)
                escapedValue.push(escapedEndValueDelimiter);
            else if (character === "\\")
                escapedValue.push(backslashDelimiter);
            else
                escapedValue.push(character);
        } else {
            if (character === "\\")
                escapedValue.push(backslashDelimiter);
            else
                escapedValue.push(character);
        }
    }

    // Parse key/value pairs from escaped value
    const pairs = escapedValue.join("").split(parameterDelimiter);

    for (let i = 0; i < pairs.length; i++) {
        // Separate key from value
        const elements = pairs[i].split(keyValueDelimiter);

        if (elements.length === 2) {
            // Get key
            const key = elements[0].trim();
            let unescapedValue = elements[1].trim();

            // Get unescaped value
            unescapedValue = ReplaceAll(unescapedValue, escapedParameterDelimiter, parameterDelimiter);
            unescapedValue = ReplaceAll(unescapedValue, escapedKeyValueDelimiter, keyValueDelimiter);
            unescapedValue = ReplaceAll(unescapedValue, escapedStartValueDelimiter, startValueDelimiter);
            unescapedValue = ReplaceAll(unescapedValue, escapedEndValueDelimiter, endValueDelimiter);
            unescapedValue = ReplaceAll(unescapedValue, backslashDelimiter, "\\");

            // Add key/value pair to dictionary
            if (ignoreDuplicateKeys) {
                // Add or replace key elements with unescaped value
                keyValuePairs.set(key, unescapedValue);
            } else {
                // Add key elements with unescaped value throwing an exception for encountered duplicate keys
                if (keyValuePairs.has(key))
                    throw "Failed to parse key/value pairs: duplicate key encountered. Key \"" +
                    key +
                    "\" is not unique within the string: \"" +
                    str +
                    "\"";

                keyValuePairs.set(key, unescapedValue);
            }
        }
    }

    return keyValuePairs;
};