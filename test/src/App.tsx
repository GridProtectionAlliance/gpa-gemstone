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
import AlertTestComponent from './components/react-interactive/Alert';
import CheckBoxTestComponent from './components/react-forms/Checkbox';
import BreadcrumbTestComponent from './components/react-interactive/Breadcrumb';
import BtnDropdownTestComponent from './components/react-interactive/DropdownButton';
import TableTestingComponent from './components/react-table/Table';
import ConfigurableTableTestComponent from './components/react-table/ConfigurableTable';

const root = ReactDOM.createRoot(document.getElementById('window'));

/** Test App Root */
const App: React.FC = () => {
    return (
        <div className="container my-3">
            <div className="row">
                <div className="col">
                    <TableTestingComponent ComponentTestID="table-test-id" />
                </div>
            </div>
            <div className="row mt-3">
                <ConfigurableTableTestComponent ComponentTestID='configtable-test-id' />
            </div>
            <div className="row mt-3">
                <div className="col">
                <AlertTestComponent />
                <CheckBoxTestComponent />
                <BreadcrumbTestComponent ComponentTestID='breadcrumb-test-id' />
                <BtnDropdownTestComponent ComponentTestID="btn-dropdown-test" />
                </div>
            </div>
        </div>
    );
};

root.render(<App />);