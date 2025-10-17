//******************************************************************************************************
//  App.tsx - Gbtc
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
//  05/05/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { Application, Page, Section } from '@gpa-gemstone/react-interactive';
import { AlertTestComponent, BreadcrumbTestComponent, BtnDropdownTestComponent } from './react-interactive';
import CheckBoxTestComponent from './react-forms/Checkbox';
import TableTestingComponent from './react-table/Table';
import ConfigurableTableTestComponent from './react-table/ConfigurableTable';
import TimeFilterTestComponent from './common-pages/TimeFilter';
import { RadioButtonsTestComponent } from './react-forms';

declare const homePath: string;

export const InteractivePageLabel = "React Interactive";
export const FormsPageLabel = 'React Forms';

export const TimeFilterPageLabel = "Time Filter";
export const TimeFilterRoute = "TimeFilter"

/** Test App Root */
const App = () => {
    return (
        <Application
            HomePath={homePath}
            DefaultPath={"index.html"}
            AllowCollapsed={false}
        >
            <Section Label="Common Pages">
                <Page Name={TimeFilterRoute} Label={TimeFilterPageLabel}>
                    <TimeFilterTestComponent />
                </Page>
            </Section>
            <Section Label="Component Tests" >
                <Page Name={`interactive`} Label={InteractivePageLabel}>
                    <AlertTestComponent />
                    <BtnDropdownTestComponent />
                    <BreadcrumbTestComponent />
                </Page>
                <Page Name={`forms`} Label={FormsPageLabel}>
                    <CheckBoxTestComponent />
                    <RadioButtonsTestComponent />
                </Page>
                <Page Name={`application-typings`} Label="Application Typings" />
                <Page Name={`symbols`} Label="GPA Symbols" />
                <Page Name={`graph`} Label="React Graph" />
            </Section>

            <Section Label="React Table">
                <Page Name={`react-table`} Label="Table">
                    <TableTestingComponent />
                </Page>
                <Page Name={`config-table`} Label="Configurable Table">
                    <ConfigurableTableTestComponent />
                </Page>
            </Section>


        </Application>
    );
};

export default App;