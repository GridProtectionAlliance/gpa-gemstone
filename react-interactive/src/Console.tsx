// ******************************************************************************************************
//  Console.tsx - Gbtc
//
//  Copyright © 2026, Grid Protection Alliance.  All Rights Reserved.
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
// ******************************************************************************************************

import * as React from 'react';
import { Application } from '@gpa-gemstone/application-typings';
import moment from 'moment';

type MessageColor = 'red' | 'yellow' | 'white'

export interface IMessage {
    Message: string
    Color?: MessageColor
}

interface IProps {
    /**
     * Messages to display in the console.
     */
    Messages: IMessage[]
    /**
     * Whether or not to display the console.
     */
    Show: boolean
    /**
     * Setter for the Show value.
     */
    SetShow: React.Dispatch<React.SetStateAction<boolean>>
    /**
     * Whether or not to display an 'X' to hide the console.
     */
    ShowX: boolean
    /**
     * Optional status to display for updating console displays.
     */
    Status?: Application.Types.Status
    /**
     * Optional last successful update to display for updating console displays.
     */
    LastSuccess?: number
    /**
     * Fill the height of the console's container? Defaults to false.
     */
    FillY?: boolean
}

export const RemoteConsoleStyle: React.CSSProperties = {
    padding: 10,
    overflow: 'auto',
    fontSize: 10,
    height: '100%'
};

const Console = ({Messages, Show, SetShow, ShowX, Status, LastSuccess, FillY}: IProps) => {
    return (
         Show ?
                <>
                    <div className="row">
                        <div className="col">
                            {LastSuccess != null ?
                                <label className="small" ><small><em>{`Last update ${moment(LastSuccess).format('MM/DD/YYYY HH:mm')}${Status != null && Status != 'uninitiated' ? '-'  : ''}`}</em></small> </label>
                                  : null}
                            {Status === 'idle' ? <label className="small" ><small><em>Up to date.</em></small> </label> : null}
                            {Status === 'loading' ? <label className="small" ><small><em>Updating...</em></small> </label> : null}
                            {Status === 'error' ? <label className="small" ><small><em>Failed to update.</em></small> </label> : null}
                          
                        </div>
                    </div>
                    <div className={`row ${FillY ? 'h-100' : ''}`}>
                        <div className={"col-12"}>
                            <pre className="small bg-dark text-white alert alert-dismissible fade show" style={RemoteConsoleStyle}>
                                {ShowX ? 
                                    <button type="button" className="close" onClick={() => SetShow(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button> : null}
                                {Messages.map((message: IMessage) => {
                                    return <span style={{ color: message.Color ?? 'white'}}>{message.Message}</span>
                                })
                                }
                            </pre>
                        </div>
                    </div>
                </>
                : null
    )
};

export default Console;