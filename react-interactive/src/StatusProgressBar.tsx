// ******************************************************************************************************
//  StatusProgressBar.tsx - Gbtc
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
//  06/19/2025 - Preston Crawford
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';

interface IProps {
    /**
    * Current Percentage out of 100
    */
    CurrentPercentage: number,

    /**
     * Class for progress div
     */
    Class?: string
}

const StatusProgressBar = (props: React.PropsWithChildren<IProps>) => {
    return (
        <div className={`progress ${props.Class ?? "w-75"}`}>
            <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-valuenow={props.CurrentPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: `${props.CurrentPercentage}%` }}
            >
                {props.children == null ? `${props.CurrentPercentage}%` : props.children}
            </div>
        </div>
    )
}

export default StatusProgressBar;