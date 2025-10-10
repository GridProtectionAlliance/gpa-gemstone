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
import { ToolTip } from '@gpa-gemstone/react-forms';
import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Context, SectionContext } from './Context';

export interface IProps {
    /** Needed to specify whether a user can access a NavLink via Administrator role. */
    RequiredRoles?: Application.Types.SecurityRoleName[];
    /** Name of the page thats needed for Routing */
    Name: string;
    /** Name of the NavLink on the sidebar */
    Label?: string,
    /** Icon that will show next to your NavLink */
    Icon?: React.ReactNode,
    /** Name of the path or paths thats used for Dynamic Routing with Name being the root of the path*/
    Paths?: string[],
    /** Pages where this link should remain acitive */
    OtherActivePages?: string[]
}

const Page = (props: React.PropsWithChildren<IProps>) => {
    const [hover, setHover] = React.useState<boolean>(false);
    const [className, setClassName] = React.useState<string>("nav-link");
    const context = React.useContext(Context);
    const sectionGuid = React.useContext(SectionContext);
    const location = useLocation();

    //effect to set the className based on the current path and the props.Name and set activeSection
    React.useEffect(() => {
        // Use Name as the base check and see if the current path starts with this base.
        // React v6 will try to set active or not themselves, we need to not let them to support search matching
        let currentPage = location.pathname;
        if (context.useSearchMatch) currentPage += location.search;

        const isOtherPathActive = () => {
            if (props.OtherActivePages == null)
                return false;

            for (const path of props.OtherActivePages) {
                if (currentPage.includes(path))
                    return true;
            }

            return false;
        }
        
        const isPathActive = currentPage.startsWith(`${context.homePath}${props.Name}`) || isOtherPathActive();
        
        if (isPathActive) {
            context.setActivePageLabel(props.Label ?? null);
            context.setActiveSection(sectionGuid);
        }

        setClassName(`nav-link ${(isPathActive ? "active" : "")}`);
    }, [location.pathname, (context.useSearchMatch ? location.search : null), props.OtherActivePages, props.Name]);

    if (props.RequiredRoles != null && props.RequiredRoles.filter(r => context.userRoles.findIndex(i => i === r) > -1).length === 0)
        return null;

    if (props.Label != null || props.Icon != null) {
        return (
            <>
                <li className="nav-item" style={{ position: 'relative' }}>
                    <NavLink
                        data-tooltip={props.Name}
                        className={() => className}
                        to={`${context.homePath}${props.Name}`}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        {props.Icon !== undefined ? props.Icon : null}
                        {!context.collapsed ? <span>{props.Label}</span> : null}
                    </NavLink>
                </li>
                {context.collapsed ?
                    <ToolTip Target={props.Name} Show={hover} Position={'right'}>
                        {props.Label}
                    </ToolTip>
                    : null}
            </>
        )
    }
    return null;
}

export default Page;