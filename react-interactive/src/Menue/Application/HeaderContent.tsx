// ******************************************************************************************************
//  HeaderContent.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  02/13/2022 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import { ReactIcons } from "@gpa-gemstone/gpa-symbols";

interface IProps {
    SetCollapsed: (c: boolean) => void,
    HomePath: string,
    Logo?: string,
    OnSignOut?: () => void,
    ShowOpen: boolean,
    ShowClose: boolean,
    NavBarContent?: React.ReactNode,
}

const HeaderContent = React.forwardRef<HTMLDivElement, IProps>((props, ref) => {
    return <>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow" ref={ref}>
            {props.ShowOpen ? <a style={{ color: 'var(--light)', marginLeft: 15, cursor: 'pointer' }} onClick={() => props.SetCollapsed(false)} >
                <ReactIcons.ArrowForward />
            </a> : null}
            {props.ShowClose ? <a style={{ color: 'var(--light)', marginLeft: 15, cursor: 'pointer' }} onClick={() => props.SetCollapsed(true)}>
                <ReactIcons.ArrowBackward />
            </a> : null}
            {props.Logo !== undefined ?
                < a className="navbar-brand col-sm-2 col-md-1 mr-0 mr-auto" href={props.HomePath} ><img style={{ maxHeight: 35, margin: -5 }} src={props.Logo} /></a> : null}
            <ul className="navbar-nav px-3 ml-auto">
                <li className="nav-item text-nowrap" style={{ cursor: props.OnSignOut !== undefined ? 'pointer' : 'default' }}>
                    {props.OnSignOut !== undefined ? <a className="nav-link" onClick={props.OnSignOut} >Sign out</a> : null}
                </li>
            </ul>
            {props.NavBarContent}
        </nav>
    </>
});

export default HeaderContent;