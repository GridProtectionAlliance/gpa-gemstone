import { afterAll, beforeAll, expect, describe, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import 'selenium-webdriver/chrome';
import 'chromedriver';

const rootURL = 'http://localhost:8080';
let driver: WebDriver;

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

describe('BtnDropdown Component', () => {
    it('renders all dropdown buttons', async () => {
        const buttons = await driver.findElements(By.css('#btn-dropdown-test .btn-group'));
        expect(buttons.length).toBe(4);

        const sizes = ['btn-group-sm', 'btn-group-lg', 'btn-group-xlg', 'btn-group-sm'];
        for (let i = 0; i < buttons.length; i++) {
            const className = await buttons[i].getAttribute('class');
            expect(className).toContain(sizes[i]);
        }
    });

    it('shows dropdown menu on toggle click', async () => {
        const toggleButtons = await driver.findElements(By.css('#btn-dropdown-test .dropdown-toggle'));
        await toggleButtons[0].click();

        const menu = await driver.findElement(By.css('#btn-dropdown-test .dropdown-menu.show'));
        expect(await menu.isDisplayed()).toBe(true);
    });

    it('renders dropdown items and dividers correctly', async () => {
        const toggleButtons = await driver.findElements(By.css('#btn-dropdown-test-1 .dropdown-toggle'));
        await toggleButtons[0].click();

        const options = await driver.findElements(By.css('#btn-dropdown-test-1 .dropdown-item'));
        expect(options.length).toBe(5);

        const dividers = await driver.findElements(By.css('#btn-dropdown-test-1 .dropdown-divider'));
        expect(dividers.length).toBe(1);
    });

    it('executes callback on enabled dropdown item click', async () => {
        const toggleButtons = await driver.findElements(By.css('#btn-dropdown-test-1 .dropdown-toggle'));
        await toggleButtons[0].click();

        const option = await driver.findElement(By.xpath("//div[@id='btn-dropdown-test-1']//a[text()='Option 1']"));
        expect(await option.getAttribute('class')).not.toContain('disabled');
        await option.click();

        // when clicked the dropdown goes away
        const dropdown = await driver.findElement(By.css('#btn-dropdown-test-1 .dropdown-menu'));
        expect(await dropdown.getAttribute('class')).not.toContain('show');
    });
});
