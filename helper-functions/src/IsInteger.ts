// ******************************************************************************************************
//  IsInteger.tsx - Gbtc
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
//  07/16/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * IsInteger checks if value passed through is an integer, returning a true or false
 * @param value is the input passed through the IsInteger function
 * @returns Function will return true if value is an integer, false otherwise
 */
function IsInteger(value: any): boolean {
  const regex = /^-?[0-9]+$/;
  return value.toString().match(regex) != null;
}

export {IsInteger};
