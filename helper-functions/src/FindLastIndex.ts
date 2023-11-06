// ******************************************************************************************************
//  FindLastIndex.tsx - Gbtc
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
//  11/03/2023 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * This function finds the last index where predicate is true
 * @param array: array to e searched
 * @param predicate: the function to be called on every element
 * @returns Function will return the last index where predictae returns true or -1 if not found
 */
function findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
  let l = array.length;
  while (l--) {
      if (predicate(array[l], l, array))
          return l;
  }
  return -1;
}

export {findLastIndex};