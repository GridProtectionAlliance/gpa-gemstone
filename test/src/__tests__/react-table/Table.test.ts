import { afterAll, beforeAll, expect, describe, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import 'selenium-webdriver/chrome';
import 'chromedriver';

const rootURL = 'http://localhost:8080';
let driver: WebDriver;
const componentTestID = 'table-test-id';

// Before each test, create a selenium webdriver that goes to the rootURL
beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get(rootURL); // Navigate to the page
    await driver.wait(until.titleIs('GPA Test'), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('Table Component', () => {
    
});