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

type MessageLevel = "Normal" | "Warning" | "Error"

interface ConsoleLineProps {
    Message: String,
    Level?: MessageLevel
}

export const ConsoleLine = ({ Message, Level }: ConsoleLineProps) => {
    return <span style={{ color: GetLevelColor(Level ?? "Normal") }}>{Message}</span>
}

interface IProps {
    /**
     * Function to run on close.
     */
    OnClose?: () => void
    /**
     * Optional status to display for updating console displays.
     */
    Status?: Application.Types.Status
    /**
     * Optional last successful update to display for updating console displays.
     */
    LastSuccess?: string
    /** 
     * Whether or not to auto-scroll the console while the mouse is within the console.
     */
    AutoScroll?: boolean
    /**
     * Optional right header.
     */
    HeaderRight?: React.ReactNode
}

export const RemoteConsoleStyle: React.CSSProperties = {
    padding: 10,
    overflowY: 'auto',
    fontSize: 10,
    flex: '1 1 0',
    minHeight: 0,
    marginBottom: 0
};

const Console = ({ OnClose, Status, LastSuccess, AutoScroll, HeaderRight, children }: React.PropsWithChildren<IProps>) => {
    const [autoScroll, setAutoScroll] = React.useState<boolean>(true);
    const consoleDiv = React.useRef<HTMLPreElement | null>(null);
    const AutoScrollEnabled = AutoScroll ?? false;

    React.useLayoutEffect(() => {
        if (consoleDiv.current == null)
            return;
        if (!autoScroll || !AutoScrollEnabled)
            return;
        consoleDiv.current.scrollTop = consoleDiv.current.scrollHeight;
    })

    return (
        <div className="d-flex flex-column h-100 w-100"> 
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    {LastSuccess != null ?
                        <label className="small" >
                            <small>
                                <em>
                                    {`Last update ${LastSuccess}${Status != null && Status != 'uninitiated' ? '-' : ''}`}
                                </em>
                            </small>
                        </label>
                        : null}
                    {Status === 'idle' ? <label className="small" ><small><em>Up to date.</em></small> </label> : null}
                    {Status === 'loading' ? <label className="small" ><small><em>Updating...</em></small> </label> : null}
                    {Status === 'error' ? <label className="small" ><small><em>Failed to update.</em></small> </label> : null}
                </div>
                <div className="d-flex align-items-center">
                    <label className="small mr-2" style={{ display: autoScroll ? 'none' : undefined }} >
                        <small>
                            <em>Scrolling paused during mouse interaction...</em>
                        </small>
                    </label>
                    {HeaderRight}
                </div>
            </div>
            <pre className="small bg-dark text-white alert alert-dismissible fade show"
                style={RemoteConsoleStyle}
                onMouseEnter={() => { if (AutoScrollEnabled) setAutoScroll(false) }}
                onMouseLeave={() => { if (AutoScrollEnabled) setAutoScroll(true) }}
                ref={consoleDiv}
            >
                {OnClose != null ?
                    <button type="button" className="close" onClick={OnClose}>
                        <span aria-hidden="true">&times;</span>
                    </button> : null}
                {children}
            </pre>
        </div>
    )
};

export default Console;

function GetLevelColor(level: MessageLevel): "white" | "red" | "yellow" {
    switch (level) {
        case "Error":
            return "red"
        case "Warning":
            return "yellow"
        case "Normal":
            return "white"
        default:
            return "white"
    }
}