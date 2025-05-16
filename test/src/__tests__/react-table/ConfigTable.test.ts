//******************************************************************************************************
//  ConfigTable.test.ts - Gbtc
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
import { afterEach, beforeEach, expect, describe, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import 'selenium-webdriver/chrome';
import 'chromedriver';

const rootURL = `http://localhost:${global.PORT}`;
let driver: WebDriver;
const componentTestID = 'configtable-test-id';

// Before each test, create a selenium webdriver that goes to the rootURL
beforeEach(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().setSize(1600, 750);
    await driver.get(rootURL); // Navigate to the page
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${componentTestID}-1 table thead tr th`))), 25000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${componentTestID}-2 table thead tr th`))), 25000);
});

// close the driver after each test
afterEach(async () => {
    if (driver) await driver.quit();
});

const componentVariants = [
    ['ConfigTable Component 1', '1'],
    ['ConfigTable Component 2: Children Load Columns', '2'],
];

describe.each(componentVariants)('%s', (desc, idSuffix) => {
    const tableSelector = `#${componentTestID}-${idSuffix} table`;

    it('Renders the table with proper styles', async () => {
        const body = await driver.findElement(By.css(`${tableSelector} tbody`));
        expect(await body.getCssValue('font-style')).toBe('italic');

        const head = await driver.findElement(By.css(`${tableSelector} thead`));
        expect(await head.getCssValue('font-weight')).toBe('100');

        const row = await driver.findElement(By.css(`${tableSelector} tbody tr`));
        expect(await row.getCssValue('font-weight')).toBe('700');
    });

    it('Renders the table with proper, default column titles', async () => {
        await driver.executeScript('window.localStorage.clear();');
        const tableCols = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        expect(tableCols.length).toBe(5); // 4 data col + 1 config col

        const colTitles = ['Title', 'Author', 'Volume', 'Category'];

        for (let i = 0; i < colTitles.length; i++) {
            const colText = await tableCols[i].getText();
            expect(colText).toBe(colTitles[i]);
        }

        const configIcon = await tableCols[4].findElement(By.css('svg.feather-file-text'));
        expect(configIcon).toBeDefined();
    });
});
