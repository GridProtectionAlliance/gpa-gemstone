// ******************************************************************************************************
//  ReplaceAll.tsx - Gbtc
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

/**
 * Replaces all occurrences of a substring in the source string, escaping special characters and supporting optional case-insensitivity.
 *
 * @param source - The original string to perform replacements on.
 * @param findText - The substring or pattern to find (treated literally).
 * @param replaceWith - The replacement string (dollar signs are escaped automatically).
 * @param ignoreCase - Flag to ignore case (default `false`).
 * @returns A new string with all matches replaced.
 */
export const ReplaceAll = (source: string, findText: string, replaceWith: string, ignoreCase?: boolean) => {
    var replaceVal = typeof replaceWith === "string" ? replaceWith.replace(/\$/g, "$$$$") : replaceWith;
    var flags = ignoreCase ? "gi" : "g";
    var pattern = new RegExp(findText.replace(/([\/\\\,\!\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), flags);
    return source.replace(pattern, replaceVal);
}