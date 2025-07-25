//******************************************************************************************************
//  Table.test.ts - Gbtc
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
import { tableTestContainerWidth } from "../../components/react-table/ConfigurableTable";

const rootURL = `http://localhost:${global.PORT}/react-table`;
let driver: WebDriver;
const componentTestID = 'table-test-id';

// Before each test, create a selenium webdriver that goes to the rootURL
beforeEach(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();
    // Ensure headless mode for sizing tests. Mimics Jenkins
    options.addArguments(
        '--window-size=1600,760',
        '--headless=new',
        '--disable-gpu'
    );

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    await driver.executeScript('window.resizeTo(1600,760)')
    await driver.get(rootURL); // Navigate to the page

    await driver.wait(
        until.elementIsVisible(driver.findElement(By.css(`#${componentTestID} table`))),
        25000
    );
});

// close the driver after each test
afterEach(async () => {
    if (driver) await driver.quit();
});

describe('Table Component', () => {
    const tableSelector = `#${componentTestID} table`;

    it('Renders the table with tbody, thead, and tablerow styles', async () => {
        const body = await driver.findElement(By.css(`${tableSelector} tbody`));
        expect(await body.getCssValue('font-style')).toBe('italic');

        const head = await driver.findElement(By.css(`${tableSelector} thead`));
        expect(await head.getCssValue('font-weight')).toBe('100');

        const row = await driver.findElement(By.css(`${tableSelector} tbody tr`));
        expect(await row.getCssValue('font-weight')).toBe('700');
    });

    it('Renders the table with proper column titles', async () => {
        const tableCols = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        expect(tableCols).toHaveLength(4);

        const colTitles = ['Title', 'Author', 'Vol.', 'Category'];
        for (let i = 0; i < tableCols.length; i++) {
            const col = await tableCols[i].getText();
            expect(col).toBe(colTitles[i]);
        }
    });

    it('Renders header col widths correctly', async () => {
        const tableCols = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        const firstCol = tableCols[0]; // should be 50% table width
        await driver.sleep(500); // removes flakieness. gives time for cols to fully adjust

        const scrolled = await hasVerticalScrollbar(driver, tableSelector);
        const spacer = scrolled ? await getScrollbarWidth(driver) : 0;

        const firstColWidth = parseFloat(await firstCol.getCssValue('width'));
        const expectedFirstColWidth = (tableTestContainerWidth - spacer) * 0.5;
        const totalCols = 4;
        const expectedColWidth = (tableTestContainerWidth - expectedFirstColWidth - spacer) / (totalCols - 1);

        expect(Math.abs(firstColWidth - expectedFirstColWidth)).toBeLessThanOrEqual(1);

        for (const col of tableCols.slice(1, 4)) {
            const colWidth = parseFloat(await col.getCssValue('width'));
            expect(Math.abs(colWidth - expectedColWidth)).toBeLessThanOrEqual(0.5)
        }
    });

    it('Gives Title Col sort order icon and click changes ascending', async () => { // NOTE: does not test sorting, just the icon
        const tableCols = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        const titleCol = tableCols[0];

        let sortIcon = await titleCol.findElement(By.css(`svg path`));
        expect(await sortIcon.getAttribute('d')).toBe('M7 14l5-5 5 5z');

        for (const col of tableCols) { // Clicks each and expects the descending icon
            if (await col.getText() === 'Author') { // Second col is not clickable
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
        // Ensure no more alerts
        await driver.sleep(500); // brief delay to let any unexpected alerts appear
        try {
            alert = await driver.switchTo().alert();
            await alert.dismiss();
        } catch (err) {
            // This is expected — no more alerts
        }
    });

    /* TODO: Resizing mid-test is unreliable with selenium webdrivers
    it('Adjusts the table width when page size changes', async () => {
        type testWidths = { expectedTableValue: number, expectedFirstRow: number, expectedOtherRows: number };
        async function checkWidths(params: testWidths) {
            let table = await driver.findElement(By.css(`${tableSelector}`));
            expect(parseFloat(await table.getCssValue('width'))).toBeCloseTo(params.expectedTableValue, 1);

            const tableRows = await driver.findElements(By.css(`${tableSelector} tbody tr td`)); // first row data elements
            const firstCol = tableRows[0]; // should be 50% width
            expect(parseFloat(await firstCol.getCssValue('width'))).toBeCloseTo(params.expectedFirstRow, 1);

            for (const col of tableRows.slice(1, 4)) {
                expect(parseFloat(await col.getCssValue('width'))).toBeCloseTo(params.expectedOtherRows, 1);
            }
        }
        await checkWidths({ expectedTableValue: 698, expectedFirstRow: 341.5, expectedOtherRows: 113.828 });
        await driver.manage().window().setRect({ width: 550, height: 860 });
        await checkWidths({expectedTableValue: 533, expectedFirstRow: 259, expectedOtherRows: 86.3281});
    }); */
});

async function hasVerticalScrollbar(driver: WebDriver, tableSelector: string) {
    return await driver.executeScript(function (sel) {
        const body = document.querySelector(sel + ' tbody');
        if (!body) return false;
        return body.scrollHeight > body.clientHeight;
    }, tableSelector);
}

async function getScrollbarWidth(driver) {
    return await driver.executeScript(function () {
        return window.innerWidth - document.documentElement.clientWidth;
    }).then(w => (w && w > 0 ? w : 17));
}