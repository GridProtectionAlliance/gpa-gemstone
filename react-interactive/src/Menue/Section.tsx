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
import { Context } from './Context';

export interface IProps {
    Label?: string,
}


const Section: React.FunctionComponent<React.PropsWithChildren<IProps>> = (props) => {
    const context = React.useContext(Context)
    return (
        <>
            <hr />
            {props.Label !== undefined && !context.collapsed ?
                <>
                    <h6 className={"sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"}>
                    <span>{props.Label}</span>
                    </h6>
                </> : null}
            <ul className="navbar-nav px-3">
                {props.children}
            </ul>
        </>)

}

export default Section;