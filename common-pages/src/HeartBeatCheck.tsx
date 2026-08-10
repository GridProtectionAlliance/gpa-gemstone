//******************************************************************************************************
//  HeartBeatCheck.tsx - Gbtc
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
//  06/26/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import * as React from 'react';
import { LoadingIcon, Modal } from '@gpa-gemstone/react-interactive';
import { Gemstone } from '@gpa-gemstone/application-typings';

interface IProps {
    /**
    * Function invoked on each interval to check whether the application can still
    * reach the server. Should return an AbortablePromise that resolves when the
    * server is reachable and rejects when it is not.
    * */
    HeartBeat: () => Gemstone.TSX.Interfaces.AbortablePromise<unknown>,
    /**
    * Interval, in milliseconds, between successive HeartBeat checks
    * */
    IntervalMS: number,
    /**
    * Interval, in milliseconds, before checking an in-flight HeartBeat again
    * */
    RetryIntervalMS?: number,
}

/**
* Periodically calls HeartBeat to verify connectivity to the server and, when a
* check fails, displays a blocking modal indicating the application is trying to
* reconnect. Renders nothing while the server is reachable.
*/
const HeartBeatCheck = (props: IProps) => {
    const [showError, setShowError] = React.useState<boolean>(false);
    const retryIntervalMS = props.RetryIntervalMS ?? 10000;

    //Effect to call heartbeat on consumer defined interval
    React.useEffect(() => {
        let updateServiceStatus: Gemstone.TSX.Interfaces.AbortablePromise<unknown> | null = null;
        let nextCheck: ReturnType<typeof setTimeout>;
        let isActive = true;

        const checkServiceStatus = () => {
            if (updateServiceStatus != null) {
                nextCheck = setTimeout(checkServiceStatus, retryIntervalMS);
                return;
            }

            updateServiceStatus = props.HeartBeat();
            nextCheck = setTimeout(checkServiceStatus, props.IntervalMS);

            updateServiceStatus.then(() => {
                updateServiceStatus = null;
                if (isActive)
                    setShowError(false);
            }, () => {
                updateServiceStatus = null;
                if (isActive)
                    setShowError(true);
            });
        };

        checkServiceStatus();

        return () => {
            isActive = false;
            clearTimeout(nextCheck);
            if (updateServiceStatus?.abort != null)
                updateServiceStatus.abort();
        };
    }, [props.HeartBeat, props.IntervalMS, retryIntervalMS]);

    if (!showError)
        return null;

    return (
        <Modal
            Show={true}
            Title="Error Communicating with Application"
            Size='sm'
            ShowCancel={false}
            ShowConfirm={false}
            ShowX={false}
            CallBack={() => { /* */ }}
        >
            <p> The application is trying to reconnect to the server...</p>
            <LoadingIcon Show={true} />
        </Modal>
    )
};

export default HeartBeatCheck;