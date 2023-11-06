// ******************************************************************************************************
//  useEffectWithPrevious.tsx - Gbtc
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
import * as React from 'react';

/**
 * This hook provides the ability to run Effects with the previous value beoing provided to the Effect.
 *
 * @param   effect  The effect to be run
 * @param   Number  the state that should be cached.
 */
function useEffectWithPrevious<T>( effect: (prevVal: T|undefined) => (void| (() => void)) ,state: T) {
    const ref = React.useRef<(T|undefined)>(undefined);
    React.useEffect(() => {
        const fx = effect(ref.current);
        ref.current = state; 
        return fx;
    }, [state]); 
    return ref.current; 
}

export { useEffectWithPrevious }