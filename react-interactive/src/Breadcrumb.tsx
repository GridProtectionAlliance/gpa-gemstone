// ******************************************************************************************************
//  Breadcrumb.tsx - Gbtc
//
//  Copyright © 2024, Grid Protection Alliance.  All Rights Reserved.
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
//  10/30/2024 - Preston Crawford
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';

interface IStep {
    /**
     * Text displayed for the breadcrumb step.
     */
    Label: string,
    /**
     * Identifier used to compare the step with the current step.
     */
    ID: string | number,
    /**
     * Optional flag that allows navigation to the step, defaulting to true.
     */
    IsNavigable?: boolean
}

interface IProps {
    /**
     * Ordered steps rendered in the breadcrumb trail.
     */
    Steps: IStep[],
    /**
     * Step marked as the current, non-navigable breadcrumb location.
     */
    CurrentStep: IStep;
    /**
     * Callback fired when the user clicks a navigable step.
     * @param step - Breadcrumb step selected by the user.
     */
    OnClick: (step: IStep) => void
}

/**
 * Renders an ordered breadcrumb trail with navigation for eligible steps.
 * @param props - Supplies the breadcrumb steps, current location, and selection callback.
 * @returns The breadcrumb navigation element.
 */
const Breadcrumb = (props: IProps) => {
    return (
        <nav>
            <ol className='breadcrumb'>
                {props.Steps.map((step, i) => (
                    <li key={`${step.ID}${i}`} className={`breadcrumb-item ${props.CurrentStep.ID === step.ID ? 'active' : ''}`}>
                        {(step.ID !== props.CurrentStep.ID && (step.IsNavigable ?? true)) ?
                            <a href="#" onClick={(e) => { e.preventDefault(); props.OnClick(step) }}>
                                {step.Label}
                            </a>
                            : step.Label
                        }
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb;