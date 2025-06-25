// ******************************************************************************************************
//  IsBool.tsx - Gbtc
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
 * Checks whether a value is a string representing a boolean.
 *
 * @param val - The value to check, either a boolean or a string.
 * @returns `true` if the input string is a boolean.
 */
export const IsBool = (val: string) => {
    if (typeof val === "boolean")
        return true;

    const lval = val.toString().toLowerCase();
    return lval === "true" || lval === "false";
}