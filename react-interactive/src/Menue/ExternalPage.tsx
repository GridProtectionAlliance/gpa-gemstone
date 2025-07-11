// ******************************************************************************************************
//  ExternalPage.tsx - Gbtc
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
//  07/11/2025 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import { Application } from '@gpa-gemstone/application-typings';
import { ToolTip } from '@gpa-gemstone/react-forms';
import * as React from 'react';
import { Context } from './Context';

export interface IExternalPageProps {
    OnClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
    /**
     * Roles allowed to see this item
     */
    RequiredRoles?: Application.Types.SecurityRoleName[];
    /**
     * Text label for the nav item
     */
    Label?: string;
    /**
     * Icon to display next to the label
     */
    Icon?: React.ReactNode;
}

const ExternalPage: React.FunctionComponent<IExternalPageProps> = (props) => {
    const [hover, setHover] = React.useState<boolean>(false);
    const context = React.useContext(Context);

    if (props.RequiredRoles && props.RequiredRoles.filter(r => context.userRoles.includes(r)).length === 0)
        return null;

    if (!props.Label && !props.Icon)
        return null;

    return (
        <>
            <li className="nav-item" style={{ position: 'relative' }}>
                <a
                    data-tooltip={props.Label}
                    onClick={props.OnClick}
                    className="nav-link"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {props.Icon ?? null}
                    {!context.collapsed ? <span>{props.Label}</span> : null}
                </a>
            </li>
            {context.collapsed ?
                <ToolTip Target={props.Label} Show={hover} Position={'right'}>
                    {props.Label}
                </ToolTip>
                : null
            }
        </>
    );
};

export default ExternalPage;
