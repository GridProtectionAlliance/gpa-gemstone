//******************************************************************************************************
//  Alert.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  05/01/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import { Alert } from '@gpa-gemstone/react-interactive';
import * as React from 'react';

const ALERT_TEST_ID = 'alert-test-id';
export const AlertID1 = ALERT_TEST_ID + '1'
export const AlertID2 = ALERT_TEST_ID + '2'

const AlertTestComponent = () => {
    const [retriggerFlag, setRetriggerFlag] = React.useState<number>(0);
    const [alertGone, setAlertGone] = React.useState<boolean>(false);
    const triggerClick = () => {
        setRetriggerFlag(x => x + 1);
        setAlertGone(false);
    }

    return (
        <div className="row">
            <div className="align-items-start">
                <div className="col-md" id={AlertID1}>
                    <Alert
                        Class="alert-primary"
                        ShowX={true}
                        OnClick={() => { alert('Closing Alert'); setAlertGone(true); }}
                        ReTrigger={retriggerFlag}
                    >
                        Alert component with X
                    </Alert>
                </div>
                <div className={`col-auto ${alertGone ? 'd-block' : 'd-none'}`}>
                    <button type="button" className="btn btn-secondary btn-block mb-3" onClick={triggerClick}
                        id={`${AlertID1}-button`}>
                        Bring Back Closed Alert
                    </button>
                </div>
            </div>

            {/* Second Row */}
            <div id={AlertID2}>
                <div className="col">
                    <Alert
                        Class="alert-primary"
                        ShowX={false}
                        OnClick={() => alert('Closing Alert')}
                    >
                        Alert component without X
                    </Alert>
                </div>
            </div>
        </div>
    )
}

export default AlertTestComponent;