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
import chrome from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';

const rootURL = `http://localhost:${global.PORT}`;
let driver: WebDriver;
const componentTestID = 'configtable-test-id';

// Before each test, create a selenium webdriver that goes to the rootURL
beforeEach(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();
    // Ensure headless mode for sizing tests. Mimics Jenkins
    options.addArguments('--window-size=1600,760', '--headless=new');

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    await driver.get(rootURL); // Navigate to the page
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${componentTestID}-1 table thead tr th`))), 25000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${componentTestID}-2 table tbody tr`))), 25000);
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

    it('Renders col widths correctly', async () => {
        const tableCols = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        const titleCol = tableCols[0];
        await driver.sleep(500); // removes flakieness. gives time for cols to fully adjust

        if (idSuffix == '1') {
            expect(parseFloat(await titleCol.getCssValue('width'))).toBeCloseTo(275.5, 1);
            for (const col of tableCols.slice(1, 4)) {
                expect(parseFloat(await col.getCssValue('width'))).toBeCloseTo(91.8281, 1);
            }
        } else {
            for (const col of tableCols.slice(0, 4)) {
                expect(parseFloat(await col.getCssValue('width'))).toBeCloseTo(137.75, 1);
            }
        }
    });

    it('Renders col rowstyles correctly', async () => {
        const tableRows = await driver.findElements(By.css(`${tableSelector} tbody tr td`)); // first row data elements
        const firstCol = tableRows[0]; // should be 50% width

        if (idSuffix == '1') {
            expect(parseFloat(await firstCol.getCssValue('width'))).toBeCloseTo(275.5, 1);
            for (const col of tableRows.slice(1, 4)) {
                expect(parseFloat(await col.getCssValue('width'))).toBeCloseTo(91.8281, 1);
            }
        } else {
            for (const col of tableRows.slice(0, 4)) {
                expect(parseFloat(await col.getCssValue('width'))).toBeCloseTo(137.75, 1);
            }
        }
    });

    it('Gives Title Col sort order icon and click changes ascending', async () => { // NOTE: does not test sorting, just the icon
        const tableCols = (await driver.findElements(By.css(`${tableSelector} thead tr th`))).slice(0, 3);
        const titleCol = tableCols[0];

        let sortIcon = await titleCol.findElement(By.css(`svg path`));
        expect(await sortIcon.getAttribute('d')).toBe('M7 14l5-5 5 5z');

        for (const col of tableCols) { // Clicks each and expects the descending icon
            if (await col.getText() === 'Author' && idSuffix != '2') { // Second col is not clickable on first table
                await col.click();
                const icon = await col.findElements(By.css(`svg path`));
                expect(icon.length).toBe(0); // should not find any svg's as children
                return;
            }
            await col.click();
            sortIcon = await col.findElement(By.css(`svg path`));
            expect(await sortIcon.getAttribute('d')).toBe('M7 10l5 5 5-5z');
        }
    });

    it('Does the onClick for a row', async () => {
        const tableRows = await driver.findElements(By.css(`${tableSelector} tbody tr`)); // first row
        const firstRow = tableRows[0];

        await firstRow.click();
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();

        expect(await alert.getText()).toContain(`${componentTestID}: The Great Conversation`);
        await alert.accept();
        // Two alerts pop up
        await driver.wait(until.alertIsPresent(), 5000);
        alert = await driver.switchTo().alert();
        await alert.accept();
    });
});
