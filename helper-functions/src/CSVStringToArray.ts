// ******************************************************************************************************
//  parseCSV.ts - Gbtc
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
//  08/21/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

export const CsvStringToArray = (strData: string) => {
    const regEx = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi
    const result: string[][] = [[]]
    let matches
    while ((matches = regEx.exec(strData))) {
        if (matches[1].length && matches[1] !== ',')
            result.push([])
        result[result.length - 1].push(matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3])
    }

    //Remove trailing empty row
    if (result.length !== 1 && result?.[result.length - 1]?.length === 1 && result?.[result.length - 1][0] === '')
        result.pop();

    return result
}