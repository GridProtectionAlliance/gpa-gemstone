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
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from 'react-router-dom';
import { Application, Page, Section } from '@gpa-gemstone/react-interactive';
import {
    AlertTestComponent,
    BreadcrumbTestComponent,
    BtnDropdownTestComponent
} from './components/react-interactive';
import CheckBoxTestComponent from './components/react-forms/Checkbox';
import TableTestingComponent from './components/react-table/Table';
import ConfigurableTableTestComponent from './components/react-table/ConfigurableTable';

const root = ReactDOM.createRoot(document.getElementById('window'));

declare const homePath: string;

/** Test App Root */
const App: React.FC = () => {
    return (
        <Router basename="/">
            <Application
                HomePath={homePath}
                DefaultPath={"index.html"}
                UseLegacyNavigation={true}
                AllowCollapsed={false}
            >
                <Section Label="Component Tests" Style={{ marginLeft: "10px" }}>
                    <Page Name={`table`} Label="React Table" />
                    <Page Name={`interactive`} Label="React Interactive" />
                    <Page Name={`forms`} Label="React Forms" />
                </Section>

                <div className="m-3 p-0">
                    <div className="m-3">   {/* Container to center with no padding */}
                        <Routes>
                            <Route index element={<Navigate to={`table`} />} />
                            <Route path="table" element={
                                <>
                                    <div className="row">
                                        <TableTestingComponent ComponentTestID="table-test-id" />
                                    </div>
                                    <div className="row mt-3">
                                        <ConfigurableTableTestComponent ComponentTestID='configtable-test-id' />
                                    </div>
                                </>
                            } />
                            <Route path="interactive" element={
                                <div className="row">
                                    <div className="row p-0">
                                        <AlertTestComponent />
                                    </div>
                                    <div className="row p-0">
                                        <BtnDropdownTestComponent ComponentTestID="btn-dropdown-test" />
                                    </div>
                                    <div className="row p-0 mt-3">
                                        <BreadcrumbTestComponent ComponentTestID='breadcrumb-test-id' />
                                    </div>
                                </div>
                            } />
                            <Route path="forms" element={
                                <div className="row">
                                    <div className='col p-0'>
                                        <CheckBoxTestComponent ComponentTestID='checkbox-test-text'/>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </div>
                </div>
            </Application>
        </Router>
    );
};

root.render(<App />);
