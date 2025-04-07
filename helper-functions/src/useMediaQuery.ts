//******************************************************************************************************
//  useMediaQuery.tsx - Gbtc
//
//  Copyright (c) 2024, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA may license this file to you under the MIT License (MIT), the "License"; you may not use this
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
//  04/04/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import * as React from 'react';

/**
 * 
 * @param query A valid CSS media query string (e.g., '(min-width: 762px)').
 * @returns true if the current document state matches the media query
 */
const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = React.useState<boolean>(() => {
        if (typeof window !== 'undefined' && window.matchMedia != null) 
            return window.matchMedia(query).matches;
        
        return false;
    });

    React.useEffect(() => {
        if (typeof window === 'undefined' || window.matchMedia == null)
            return

        const mediaQueryList = window.matchMedia(query);
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
        mediaQueryList.addEventListener('change', listener);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;