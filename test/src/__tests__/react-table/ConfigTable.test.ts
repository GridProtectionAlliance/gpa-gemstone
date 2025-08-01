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
import { Builder, By, until, WebDriver, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';
import { CONFIGTABLE1_TEST_ID, CONFIGTABLE2_TEST_ID, tableTestContainerWidth } from '../../components/react-table/ConfigurableTable';

const rootURL = `http://localhost:${global.PORT}/config-table`;
let driver: WebDriver;
const expectedHeaders = ['Title', 'Author', 'Volume', 'Category'];
const modalSelector = `.modal.show`;

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

    //Configure logging
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    options.setLoggingPrefs(prefs);

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    await driver.executeScript('window.resizeTo(1600,760)')

    await driver.get(rootURL);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${CONFIGTABLE1_TEST_ID} table thead tr th`))), 10000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${CONFIGTABLE2_TEST_ID} table tbody tr`))), 10000);
});

// close the driver after each test
afterEach(async () => {
    if (driver) await driver.quit();
});

const testIDS = [['Config Table 1', CONFIGTABLE1_TEST_ID], ['Config Table 2',CONFIGTABLE2_TEST_ID]];

describe.each(testIDS)('%s', (desc, testID) => {
    const tableSelector = `#${testID} table`;

    /**
    * Enables or disables provided column or all non-disabled column checkboxes if none provided
    * @param targetValue 'on' to enable, 'off' to disable
    * @param col optional string of table column title text
    */
    const setColumnState = async (targetValue: 'on' | 'off', col?: string) => {
        let tableHeaders = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        const configButton = await tableHeaders.slice(-1)[0];
        await configButton.click();

        if (col != null) {
            const checkbox = await driver.findElement(
                By.xpath(`//label[span[text()="${col}"]]/preceding-sibling::input[@type="checkbox"]`)
            );
            const isDisabled = await checkbox.getAttribute('disabled');
            const currentValue = await checkbox.getAttribute('value');

            if (!isDisabled && currentValue !== targetValue) {
                await checkbox.click();

                // Wait until the column header is updated
                await driver.wait(async () => {
                    const colHeader = await driver.findElements(By.css(`${tableSelector} thead tr th#${col}`));
                    if (colHeader.length === 0) return true;
                    const isDisplayed = await colHeader[0].isDisplayed();
                    if (targetValue == 'off') return !isDisplayed;
                    else return isDisplayed;
                }, 5000, `Timed out waiting for ${col} column to be updated`);

            }

            expect(await checkbox.getAttribute('value')).toBe(targetValue);

            // Check headers after removal
            const tableHeaders = await driver.findElements(By.css(`${tableSelector} thead tr th`));
            const texts = await Promise.all(tableHeaders.map((el) => el.getText()));
            targetValue == 'off' ? expect(texts).not.toContain(col) : expect(texts).toContain(col);

            const configIcon = await tableHeaders.slice(-1)[0].findElement(By.css('svg.feather-file-text'));
            expect(configIcon).toBeDefined();
        } else {
            const checkboxes = await driver.findElements(By.css(`${modalSelector} .form-check-input`));
            const enabledCols: string[] = [];

            for (const box of checkboxes) {
                const isDisabled = await box.getAttribute('disabled');
                const currentValue = await box.getAttribute('value');

                if (!isDisabled && currentValue !== targetValue) {
                    await box.click();
                }

                if (isDisabled) {
                    const label = await box.findElement(By.xpath(`following-sibling::label/span[1]`));
                    const labelText = await label.getText();
                    enabledCols.push(labelText);
                }
            }

            // Verify all checkboxes are now in the expected state
            for (const box of checkboxes) {
                const isDisabled = await box.getAttribute('disabled');
                const value = await box.getAttribute('value');
                if (!isDisabled) {
                    expect(value).toBe(targetValue);
                }
            }

            tableHeaders = await driver.findElements(By.css(`${tableSelector} thead tr th`));
            const colTitles = ['Title', 'Author', 'Volume', 'Category'].filter((c) =>
                targetValue === 'on' ? true : enabledCols.includes(c)
            );

            for (let i = 0; i < colTitles.length; i++) {
                const colText = await tableHeaders[i].getText();
                expect(colText).toBe(colTitles[i]);
            }

            const configIcon = await tableHeaders.slice(-1)[0].findElement(By.css('svg.feather-file-text'));
            expect(configIcon).toBeDefined();
        }

        const closeButton = await driver.findElement(
            By.css(`${modalSelector} .modal-header > button.close`)
        );
        await closeButton.click();
    };

    it('Renders the table with proper styles', async () => {
        const body = await driver.findElement(By.css(`${tableSelector} tbody`));
        const fontStyle = await body.getCssValue('font-style');
        expect(fontStyle).toBe('italic');

        const head = await driver.findElement(By.css(`${tableSelector} thead`));
        const headerFontWeight = await head.getCssValue('font-weight')
        expect(headerFontWeight).toBe('100');

        const row = await driver.findElement(By.css(`${tableSelector} tbody tr`));
        const bodyFontWeight = await row.getCssValue('font-weight')
        expect(bodyFontWeight).toBe('700');
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

        const totalCols = 4;
        const settingsIconColWidth = 17;

        const expectedTitleWidth = (tableTestContainerWidth - settingsIconColWidth) * 0.5;

        const expectedColWidthID1 = (tableTestContainerWidth - expectedTitleWidth - settingsIconColWidth) / (totalCols - 1);
        const expectedColWidthID2 = (tableTestContainerWidth - settingsIconColWidth) / totalCols;

        if (testID === CONFIGTABLE1_TEST_ID) {
            const titleColWidth = parseFloat(await titleCol.getCssValue('width'));
            expect(titleColWidth).toBeCloseTo(expectedTitleWidth, 1);
            for (const col of tableCols.slice(1, 4)) {
                const colWidth = parseFloat(await col.getCssValue('width'));
                expect(colWidth).toBeCloseTo(expectedColWidthID1, 1);
            }
        } else {
            for (const col of tableCols.slice(0, 4)) {
                const colWidth = parseFloat(await col.getCssValue('width'));
                expect(colWidth).toBeCloseTo(expectedColWidthID2, 1);
            }
        }

    });

    it.each(expectedHeaders)('Shows sort icon after clicking %s header', async (expectedHeader) => {
        // Wait for the table to render with 5 columns
        await driver.wait(async () => {
            return await driver.findElements(By.css(`${tableSelector} thead tr th`))
                .then((h) => h.length === 5);
        }, 5000, 'Timed out waiting for 5 table columns');

        // Expect correct headers
        const header = await driver.findElement(By.css(`${tableSelector} thead tr th#${expectedHeader}`));
        const headerId = await header.getAttribute('id');
        expect(headerId).toBe(expectedHeader);

        // Author column should not sort
        const isAuthorCol = expectedHeader === 'Author';
        if (isAuthorCol) {
            await header.click().then(async () => {
                const iconPaths = await header.findElements(By.css('svg path'));
                expect(iconPaths.length).toBe(0); // No sort icon should appear
            });
            return;
        }

        // Expect header click to be functional
        let clickedSuccessfully = false;
        await header.click().then(() => clickedSuccessfully = true);
        expect(clickedSuccessfully).toBeTruthy();

        // Header set to ascending, title header descending
        const isTitleHeader = expectedHeader === 'Title';
        await driver.wait(async () => { // TODO: Is the header gone or the svg not showing
            try {
                const newH = await driver.findElement(By.css(`${tableSelector} thead tr th#${expectedHeader}`));
                const icon = await newH.findElement(By.css('svg path'));
                const d = await icon.getAttribute('d');
                return d === (isTitleHeader ? 'M7 10l5 5 5-5z' : 'M7 14l5-5 5 5z');
            } catch {
                return false;
            }
        }, 5000, `Sort icon did not update to ascending for header "${expectedHeader}"`);

        const newH = await driver.findElement(By.css(`${tableSelector} thead tr th#${expectedHeader}`));
        const icon = await newH.findElement(By.css('svg path'));
        const d = await icon.getAttribute('d');
        expect(d).toBe(isTitleHeader ? 'M7 10l5 5 5-5z' : 'M7 14l5-5 5 5z');
    });

    it('Does the onClick for a row', async () => {
        const tableRows = await driver.findElements(By.css(`${tableSelector} tbody tr`)); // first row
        const firstRow = tableRows[0];

        await firstRow.click();
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();

        expect(await alert.getText()).toContain(`${testID}: The Great Conversation`);
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

    it('Can disable and enable table columns and update localStorage', async () => {
        await setColumnState('off', 'Author');

        // Validate Author is removed
        let headers = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        const visibleTexts = await Promise.all(headers.map(h => h.getText()));
        expect(visibleTexts).not.toContain('Author');

        // check localStorage
        let storage = await driver.executeScript(
            `return window.localStorage.getItem('${testID}');`
        );
        expect(storage).not.toContain('Author');

        // re-enable it
        await setColumnState('on', 'Author');

        headers = await driver.findElements(By.css(`${tableSelector} thead tr th`));
        const recheckTexts = await Promise.all(headers.map(h => h.getText()));
        expect(recheckTexts).toContain('Author');

        // check localStorage
        storage = await driver.executeScript(
            `return window.localStorage.getItem('${testID}');`
        );
        expect(storage).toContain('Author');
    });
});
