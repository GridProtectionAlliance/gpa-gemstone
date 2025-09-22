// ******************************************************************************************************
//  useInitializeHook.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  08/13/2024 - Preston Crawford
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import ReadOnlyGenericSlice from './ReadOnlyGenericSlice';

/**
 * Custom hook to initialize data fetching for a read-only generic slice.
 * @param slice - The read-only generic slice instance.
 * @param dispatch - The Redux dispatch function.
 * @param useSelector - The Redux useSelector hook.
 * @param parentID - The optional parent ID for the data fetch.
 * @returns The current fetch status.
 */
export function useInitializeWithFetch<T>(slice: ReadOnlyGenericSlice<T>, dispatch: (action: any) => void, useSelector: any, parentID?: string | number) {
  const status = useSelector(slice.FetchStatus);
  const ParentID = useSelector(slice.ParentID);

  React.useEffect(() => {
    if (status === 'uninitiated' || status === 'changed' || ParentID != parentID)
      dispatch(slice.Fetch({ parentID: parentID }));

  }, [status, dispatch]);

  return status
}
