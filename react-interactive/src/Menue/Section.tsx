﻿// ******************************************************************************************************
//  Header.tsx - Gbtc
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
import { Context } from './Context';
import { Application } from '@gpa-gemstone/application-typings';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';

export interface IProps {
    Label?: string,
    Style?: React.CSSProperties
    /** Needed to specify whether a user can access a section via roles. 
     * Note: Individual pages will still need to be marked with roles as well for page access control if using non-legacy navigation. */
    RequiredRoles?: Application.Types.SecurityRoleName[];
}

const Section: React.FunctionComponent<IProps> = (props) => {
    const context = React.useContext(Context);
    const [show, setShow] = React.useState<boolean>(true);

    const chevron = React.useMemo(() => {
        if (!context.allowSectionCollapse) return null;
        if (show) return <ReactIcons.ChevronUp Style={{width:'1em', height: '1em'}} />;
        return <ReactIcons.ChevronDown Style={{width:'1em', height: '1em'}} />;
    }, [context.allowSectionCollapse, show]);

    React.useEffect(() => {
        if (!context.allowSectionCollapse) setShow(true);
    }, [context.allowSectionCollapse]);

    const onClick = React.useCallback((event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
        if (!context.allowSectionCollapse) return;
        setShow(s=>!s);
        event.preventDefault();
        event.stopPropagation();
    }, [context.allowSectionCollapse]);

    if (props.RequiredRoles != null && props.RequiredRoles.filter(r => context.userRoles.findIndex(i => i === r) > -1).length === 0)
        return null;

    return (
        <>
            <hr />
            {props.Label !== undefined && !context.collapsed ?
                <>
                    <h6 className={"sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"} 
                        onClick={onClick} style={{cursor: context.allowSectionCollapse ? "pointer" : undefined}}>
                        <span>{props.Label} {chevron}</span>
                    </h6>
                </> : null}
            {show ?
                <ul className="navbar-nav px-3" style={props.Style}>
                    {props.children}
                </ul> : null}
        </>
    );
}

export default Section;