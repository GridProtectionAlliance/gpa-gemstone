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
import MapTestComponent from './react-interactive/Map';
import LegendEntryTestComponent from './react-graph/LegendEntry';

declare const homePath: string;

// React Forms Page Routes/Labels
export const CheckboxPageRoute = "Checkbox";
export const RadioButtonsPageRoute = "RadioButtons";

// Common Pages Page Routes/Labels
export const TimeFilterRoute = "TimeFilter"

// React Interactive Page Routes/Labels
export const AlertPageRoute = "Alerts";
export const BtnDropdownPageRoute = "DropdownButton";
export const BreadcrumbPageRoute = "Breadcrumbs";
export const MapPageRoute = "Map";

// React Graph Page Routes/Labels
export const LegendEntryPageRoute = "LegendEntry";

/** Test App Root */
const App = () => {
    return (
        <Application
            HomePath={homePath}
            DefaultPath={"index.html"}
            AllowCollapsed={false}
        >
            <Section Label="Common Pages">
                <Page Name={TimeFilterRoute} Label={TimeFilterRoute}>
                    <TimeFilterTestComponent />
                </Page>
            </Section>

            <Section Label={'React Interactive'}>
                <Page Name={AlertPageRoute} Label={AlertPageRoute}>
                    <AlertTestComponent />
                </Page>
                <Page Name={BtnDropdownPageRoute} Label={BtnDropdownPageRoute}>
                    <BtnDropdownTestComponent />
                </Page>
                <Page Name={BreadcrumbPageRoute} Label={BreadcrumbPageRoute}>
                    <BreadcrumbTestComponent />
                </Page>
                <Page Name={MapPageRoute} Label={MapPageRoute}>
                    <MapTestComponent />
                </Page>
            </Section>

            <Section Label="React Forms" >
                <Page Name={CheckboxPageRoute} Label={CheckboxPageRoute}>
                    <CheckBoxTestComponent />
                </Page>
                <Page Name={RadioButtonsPageRoute} Label={RadioButtonsPageRoute} >
                    <RadioButtonsTestComponent />
                </Page>
            </Section>

            <Section Label="React Table">
                <Page Name={`react-table`} Label="Table">
                    <TableTestingComponent />
                </Page>
                <Page Name={`config-table`} Label="Configurable Table">
                    <ConfigurableTableTestComponent />
                </Page>
            </Section>

            <Section Label="React Graph">
                <Page Name={LegendEntryPageRoute} Label={LegendEntryPageRoute}>
                    <LegendEntryTestComponent />
                </Page>
            </Section>

        </Application>
    );
};

export default App;