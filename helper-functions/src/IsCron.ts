// ******************************************************************************************************
//  IsCron.ts - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  07/18/2022 - G. Santos
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * This function returns a boolean signifing if the string passed in is a valid Cron string or not.
 * @param value: String to be validated
 */
function IsCron(value: string): boolean {
    const minuteToken: string = "[1-5]?[0-9]"; // Do we do this string manipulation every time? A way to save on this memory?
    const hourToken: string = "[1]?[0-9]|2[0-3]";
    const monthDayToken: string = "[1-9]|[12][0-9]|3[01]";
    const monthToken: string = "[1-9]|1[0-2]";
    const weekdayToken: string = "[0-6]";
    const regexCommonExpression: string = "((?:\\*)|(?:({token},)+{token}{1})|(?:{token}-{token})|(?:(?:\\*\\/)?{token}))";
    const regexToken: string = "(^[*]$)|(^" +
        regexCommonExpression.replace(/{token}/g, minuteToken) + " " +
        regexCommonExpression.replace(/{token}/g, hourToken) + " " +
        regexCommonExpression.replace(/{token}/g, monthDayToken) + " " +
        regexCommonExpression.replace(/{token}/g, monthToken) + " " +
        regexCommonExpression.replace(/{token}/g, weekdayToken) + "$)"
    return value.toString().match(regexToken) != null;
}

export {IsCron};