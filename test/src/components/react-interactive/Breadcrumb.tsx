//******************************************************************************************************
//  Breadcrumb.tsx - Gbtc
//
//  Copyright (c) 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  05/13/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************
import { Breadcrumb } from '@gpa-gemstone/react-interactive';
import * as React from 'react';

const BreadcrumbTestComponent: React.FC<{ ComponentTestID: string }> = (props) => {
    type IStep = { Label: string; ID: string | number; IsNavigable?: boolean }
    const steps = [{
        Label: 'Step One',
        ID: '1',
        IsNavigable: true,
    },
    {
        Label: 'Step Two',
        ID: 2,
        IsNavigable: false,
    },
    {
        Label: 'Step Three',
        ID: 3,
        IsNavigable: true,
    },
    {
        Label: 'Step Four',
        ID: 4,
        IsNavigable: true,
    }]

    const [step, setStep] = React.useState<IStep>(steps[0]);

    return (<div id={props.ComponentTestID}>
        <Breadcrumb
            /**
             * List of steps to render in breadcrumb
             */
            Steps={steps}
            /**
             * Current step in Steps list
             */
            CurrentStep={step}
            /**
             * Callback function for when a step was clicked on.
             * @param step Step that was clicked on
             */
            OnClick={setStep}
        />
    </div>)
}

export default BreadcrumbTestComponent;