// ******************************************************************************************************
//  ConfigurableTableAlert.tsx - Gbtc
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
//  02/25/2025 - Preston Crawford
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Alert from "../Alert";
import { ConfigurableTableKey } from './AlertKeys';

export const ConfigurableTableAlert = () => {
    const [show, setShow] = React.useState<boolean>(true);

    //Effect to set the show state onMount
    React.useEffect(() => {
        const dismissed = localStorage.getItem(ConfigurableTableKey);
        if (dismissed === "true")
            setShow(false);

    }, []);

    const handleOnClick = () => {
        localStorage.setItem(ConfigurableTableKey, "true");
    };

    return (
        <>
            {show ?
                <Alert OnClick={handleOnClick} Class="alert-primary" >
                    Use the gear at the far right of the header row to choose columns to show or hide.
                </Alert>
                : null}
        </>
    )
}