// ******************************************************************************************************
//  IsRegex.tsx - Gbtc
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
//  11/09/2023 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * This function checks if any regex is valid regex, returning true or false
 * @param regex: regex is the string passed through the IsRegex function
 * @returns Function will return true if regex is valid, false otherwise
 */
function IsRegex(regex: string): boolean {
    try {
        new RegExp(regex);
        return true;
    }
    catch {
        return false;
    }
  }
  
  export {IsRegex};