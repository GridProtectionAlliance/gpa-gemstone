//******************************************************************************************************
//  RoleAccessErrorPage.tsx - Gbtc
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
//  01/21/2025 - Gabriel Santos
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { ServerErrorIcon } from '@gpa-gemstone/react-interactive';

interface IProps {
    Style?: React.CSSProperties,
    ClassName?: string,
    Logo?: string
}

const RoleAccessErrorPage: React.FunctionComponent<IProps> = (props) => 
(
    <div style={props.Style ?? { width: '100%', height: '100%' }} className={props.ClassName ?? undefined}>
        <div className="col" style={{ height: "100%", width: "100%" }}>
            <div className="row" style={{ width: "100%", height: "50%", display: "grid", alignItems: "end" }}>
                {
                    props.Logo == null ? <></> : 
                    <img src={props.Logo} className="contain"
                        style={{ width: "40%", paddingBottom: "50px", marginLeft: "auto", marginRight: "auto" }} />
                }
            </div>
            <div className="row" style={{ alignItems: "top", justifyContent: "center", width: "100%", height: `50%` }}>
                <ServerErrorIcon Show={true} Size={100} 
                    Label={'Your role does not have permission to view this page.\nPlease contact your Administrator if you believe this to be in error.'}
                />
            </div>
        </div>
    </div>
);

export default RoleAccessErrorPage;

