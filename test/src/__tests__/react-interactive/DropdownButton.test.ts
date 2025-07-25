import { afterAll, beforeAll, expect, describe, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { BTN_DROPDOWN_ID } from "../../components/react-interactive/DropdownButton";
import { InteractivePageLabel } from "../../components/App";

const rootURL = `http://localhost:${global.PORT}/interactive`;
let driver: WebDriver;

// Before each test, create a selenium webdriver that goes to the rootURL
beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();
    // Ensure headless mode for sizing tests. Mimics Jenkins
    options.addArguments('--window-size=750,900', '--headless=new');

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    await driver.get(rootURL); // Navigate to the page

    await driver.wait(until.titleIs(InteractivePageLabel), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('BtnDropdown Component', () => {
    it('renders dropdown button, size, class, and label', async () => {
        const buttonContainer = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-2 .btn-group.btn-group-lg`));
        const buttons = await buttonContainer.findElements(By.css('button'));

        const size = 'btn-group-lg';
        const label = `${BTN_DROPDOWN_ID}Button-2`;
        const btntype = `btn-secondary`;

        expect(await buttonContainer.getAttribute('class')).toContain(size);
        expect(await buttons[0].getAttribute('class')).toContain(btntype);
        expect(await buttons[0].getText()).toContain(label);
    });

    it('executes callback on main button click', async () => {
        const button = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-1 .btn-group:not(.dropdown-toggle)`));
        await button.click();

        const message = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-message`)).getText();
        expect(message).toBe(`${BTN_DROPDOWN_ID}Button-1`); // first button was clicked
    })

    it('shows dropdown menu on toggle click', async () => {
        const toggleButtons = await driver.findElements(By.css(`#${BTN_DROPDOWN_ID} .dropdown-toggle`));
        await toggleButtons[0].click();

        const menu = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID} .dropdown-menu.show`));
        expect(await menu.isDisplayed()).toBe(true);
    });

    it('renders dropdown items and dividers correctly', async () => {
        const toggleButtons = await driver.findElements(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-toggle`));
        await toggleButtons[0].click();

        const options = await driver.findElements(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-item`));
        expect(options.length).toBe(5);

        const dividers = await driver.findElements(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-divider`));
        expect(dividers.length).toBe(1);
    });

    it('executes callback on enabled dropdown item click', async () => {
        const toggleButtons = await driver.findElements(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-toggle`));
        await toggleButtons[0].click();

        const option = await driver.findElement(By.xpath(`//div[@id='${BTN_DROPDOWN_ID}-1']//a[text()='Option 1']`));
        expect(await option.getAttribute('class')).not.toContain('disabled');
        await option.click();

        // when clicked the dropdown goes away
        const dropdown = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-menu`));
        expect(await dropdown.getAttribute('class')).not.toContain('show');
        // when clicked the message changes
        const message = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-message`));
        expect(await message.getText()).toBe(`${BTN_DROPDOWN_ID} option 1`)
    });

    it('does not execute callback on disabled dropdown item click', async () => {
        const toggleButtons = await driver.findElements(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-toggle`));
        await toggleButtons[0].click();

        let clickable = true;

        const option = await driver.findElement(By.xpath(`//div[@id='${BTN_DROPDOWN_ID}-1']//a[text()='Option 4']`));
        expect(await option.getAttribute('class')).toContain('disabled');
        await option.click().catch(() => clickable = false); // this WILL catch due to being disabled
        expect(clickable).toBe(false);

        // when clicked the dropdown goes away
        const dropdown = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-1 .dropdown-menu`));
        expect(await dropdown.getAttribute('class')).toContain('show');
        // when clicked the message changes
        const message = await driver.findElement(By.css(`#${BTN_DROPDOWN_ID}-message`));
        expect(await message.getText()).not.toBe(`${BTN_DROPDOWN_ID} option 4`)
    });
});
