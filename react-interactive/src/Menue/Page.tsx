// ******************************************************************************************************
//  Page.tsx - Gbtc
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
//  10/05/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import { Application } from '@gpa-gemstone/application-typings';
import ToolTip from '../ToolTip';
import * as React from 'react';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import { Context } from './Context';


export interface IProps {
    /** Needed to specify whether a user can access a NavLink via Administrator role. */
    RequiredRoles?: Application.Types.SecurityRoleName[];
    /** Name of the page thats needed for Routing */
    Name: string;
    /** Name of the NavLink on the sidebar */
    Label?: string,
    /** Icon that will show next to your NavLink */
    Icon?: React.ReactNode,
    /** Name of the path or paths thats used for Dynamic Routing*/
    Paths?: string[]
}


const Page: React.FunctionComponent<IProps> = (props) => {

    const [hover, setHover] = React.useState<boolean>(false);
    const context = React.useContext(Context)
    const location = useLocation();

    
    const isPathActive = () => {
        // Use Name for a direct match if Paths isn't provided
        if (location.pathname.startsWith(`${context.homePath}${props.Name}`)) {
            return true;
        }
        
        // Use Paths for a dynamic match
        if(props.Paths){
        for (let path of props.Paths) {
            const matched = matchPath(
                { path: `${context.homePath}${props.Name}${path}`},
                location.pathname, 
            );
            
            if (matched) return true;
        }
    }
        
        return false;
    }
    

    if (props.RequiredRoles !== undefined && props.RequiredRoles.filter(r => context.userRoles.findIndex(i => i === r) > -1).length === 0)
        return null;

    const linkStyle = {
        color: isPathActive() ? '#007bff' : '#78828d'
    };    
    

    if (props.Label !== undefined || props.Icon !== undefined)
        return (
            <>
                <li className="nav-item" style={{ position: 'relative' }}>
                    <NavLink 
                        data-tooltip={props.Name} 
                        className="nav-link" 
                        to={`${context.homePath}${props.Name}`} 
                        style={linkStyle}
                        onMouseEnter={() => setHover(true)} 
                        onMouseLeave={() => setHover(false)}>
                        {props.Icon !== undefined ? props.Icon : null}
                        {!context.collapsed ? <span>{props.Label}</span> : null}
                    </NavLink>
                </li>
                {context.collapsed ? <ToolTip Target={props.Name} Show={hover} Position={'right'}> {props.Label}</ToolTip> : null
}
            </>);
    return null;
}

export default Page;