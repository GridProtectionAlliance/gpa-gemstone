//******************************************************************************************************
//  useStringMemonization.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  03/20/2026 - C. Lackner
//       Generated original version of source code.
//
//******************************************************************************************************
import * as React from 'react';

/**
 * 
 * @param object A complex JSON object.
 * @returns The object as a React State that is memonized and only changes if the stringified version of object changes.
 */
function useStringMemonization<T> (object: T): T|null {
    const stringifiedObject = React.useMemo(() => object != null? JSON.stringify(object) : "", [object]);
    const [memonizedObject, setMemonizedObject] = React.useState<T|null>(object);

    React.useEffect(() => {
        if (stringifiedObject === "")
            setMemonizedObject(null);
        else
            setMemonizedObject(JSON.parse(stringifiedObject));
    }, [stringifiedObject]);

    return memonizedObject;
}

export default useStringMemonization;