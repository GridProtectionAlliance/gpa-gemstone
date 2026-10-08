//******************************************************************************************************
//  Console.tsx - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  10/08/2026 - Natalie Beatty
//       Generated original version of source code.
//
//******************************************************************************************************

import { Console } from '@gpa-gemstone/react-interactive';
import { Application } from '@gpa-gemstone/application-typings';
import * as React from 'react';
import moment from 'moment';

const ConsoleTestComponent = () => {
    const [status, setStatus] = React.useState<Application.Types.Status>('uninitiated');
    const [lastSuccess, setLastSuccess] = React.useState<number>(0);
    const [updating, setUpdating] = React.useState<boolean>(true);
    const [currentTime, setCurrentTime] = React.useState<number>(0);
    return (
    <>
        <button onClick={() => setCurrentTime(val => val + 500000)}>Increment Time</button>
        <button onClick={() => setUpdating(val => !val)}>Updating?</button>
        <button onClick={() => setStatus('loading')}>Loading</button>
        <button onClick={() => {setStatus('idle'); setLastSuccess(currentTime)}}>Idle</button>
        <button onClick={() => setStatus('error')}>Error</button>
        <Console 
            ShowX={true} 
            Show={true} 
            SetShow={() => true} 
            Message={"Hey Natalie"} 
            Status={updating ? status : undefined} 
            LastSuccess={updating ? lastSuccess : undefined}/>
    </>
    )
}

export default ConsoleTestComponent;