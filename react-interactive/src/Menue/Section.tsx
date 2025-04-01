// ******************************************************************************************************
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
import { Context, SectionContext } from './Context';
import { Application } from '@gpa-gemstone/application-typings';
import { ReactIcons } from '@gpa-gemstone/gpa-symbols';
import { CreateGuid } from '@gpa-gemstone/helper-functions';

export interface IProps {
    /**
     * Optional label to be used
     */
    Label?: string,
    /**
     * Optional style to be used on component
     */
    Style?: React.CSSProperties
    /** Needed to specify whether a user can access a section via roles. 
     * Note: Individual pages will still need to be marked with roles as well for page access control if using non-legacy navigation. */
    RequiredRoles?: Application.Types.SecurityRoleName[];
    /** Allows section to be collapsable when navbar isn't, default true */
    AllowCollapse?: boolean
}

const Section: React.FunctionComponent<IProps> = (props) => {
    const context = React.useContext(Context);
    const [show, setShow] = React.useState<boolean>(true);
    const [collapsable, setCollapsable] = React.useState<boolean>(true);
    const [guid, _setGuid] = React.useState<string>(CreateGuid());

    const chevron = React.useMemo(() => {
        if (!collapsable) return null;
        if (show) return <ReactIcons.ChevronUp Style={{width:'1em', height: '1em'}} />;
        return <ReactIcons.ChevronDown Style={{width:'1em', height: '1em'}} />;
    }, [collapsable, show]);

    React.useEffect(() => {
        if (props.Label == null || context.collapsed || guid === context.activeSection) setCollapsable(false);
        else setCollapsable(props.AllowCollapse ?? true);
    }, [context.collapsed, context.activeSection, props.Label, props.AllowCollapse]);

    const onClick = React.useCallback((event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
        if (!collapsable) return;
        setShow(s=>!s);
        event.preventDefault();
        event.stopPropagation();
    }, [collapsable]);

    if (props.RequiredRoles != null && props.RequiredRoles.filter(r => context.userRoles.findIndex(i => i === r) > -1).length === 0)
        return null;

    return (
        <SectionContext.Provider value={guid}>
            <hr />
            {(props.Label != null && !context.collapsed) ?
                <>
                    <h6 className={"sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"} 
                        onClick={onClick} style={{cursor: collapsable ? "pointer" : undefined}}>
                        <span>{props.Label} {chevron}</span>
                    </h6>
                </> : null}
            {(show || !collapsable) ?
                <ul className="navbar-nav px-3" style={props.Style}>
                    {props.children}
                </ul> : null}
        </SectionContext.Provider>
    );
}

export default Section;