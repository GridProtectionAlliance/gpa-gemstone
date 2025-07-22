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

declare const homePath: string;

/** Test App Root */
const App = () => {
    return (
        <Application
            HomePath={homePath}
            DefaultPath={"index.html"}
            AllowCollapsed={false}
        >
            <Section Label="Component Tests" >
                <Page Name={`interactive`} Label="React Interactive">
                    <div className="row">
                        <div className="row p-0">
                            <AlertTestComponent ComponentTestID="alert-test-id" />
                        </div>
                        <div className="row p-0">
                            <BtnDropdownTestComponent ComponentTestID="btn-dropdown-test" />
                        </div>
                        <div className="row p-0 mt-3">
                            <BreadcrumbTestComponent ComponentTestID='breadcrumb-test-id' />
                        </div>
                    </div>
                </Page>
                <Page Name={`forms`} Label="React Forms">
                    <CheckBoxTestComponent ComponentTestID='checkbox-test-text' />
                </Page>
                <Page Name={`application-typings`} Label="Application Typings" />
                <Page Name={`common-pages`} Label="Common Pages" />
                <Page Name={`symbols`} Label="GPA Symbols" />
                <Page Name={`graph`} Label="React Graph" />
            </Section>

            <Section Label="Table Tests">
                <Page Name={`react-table`} Label="React Table">
                    <TableTestingComponent ComponentTestID="table-test-id" />
                </Page>
                <Page Name={`config-table`} Label="Configurable Table">
                    <ConfigurableTableTestComponent ComponentTestID='configtable-test-id' />
                </Page>
            </Section>
            
        </Application>
    );
};

export default App;