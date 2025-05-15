import { afterEach, beforeEach, expect, describe, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import 'selenium-webdriver/chrome';
import 'chromedriver';

const rootURL = 'http://localhost:9000'; // TODO: CHANGE THIS
let driver: WebDriver;
const componentTestID = 'table-test-id';

// Before each test, create a selenium webdriver that goes to the rootURL
beforeEach(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().setSize(750, 780);
    await driver.get(rootURL); // Navigate to the page
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`#${componentTestID} table`))), 25000);
});

// close the driver after each test
afterEach(async () => {
    if (driver) await driver.quit();
});

describe('Table Component', () => {
    const tableSelector = `#${componentTestID} table`;

    it('Renders the table with proper styles', async () => {
        const body = await driver.findElement(By.css(`${tableSelector} tbody`));
        expect(await body.getCssValue('font-style')).toBe('italic');

        const head = await driver.findElement(By.css(`${tableSelector} thead`));
        expect(await head.getCssValue('font-weight')).toBe('100');

        const row = await driver.findElement(By.css(`${tableSelector} tbody tr`));
        expect(await row.getCssValue('font-weight')).toBe('700');
    })

    it('Renders the table with proper column titles', async () => {
        const tableCols = await driver.findElements(By.css(`thead tr th`));
        expect(tableCols).toHaveLength(4);

        const colTitles = ['Title', 'Author', 'Vol.', 'Category'];
        for (let i = 0; i < tableCols.length; i++) {
            const col = await tableCols[i].getText();
            expect(col).toBe(colTitles[i]);
        }
    })
});