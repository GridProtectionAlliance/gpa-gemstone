//******************************************************************************************************
//  Alert.test.ts - Gbtc
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
import { afterAll, beforeAll, describe, expect, it, test } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { InteractiveLabel } from "../../components/App";
import { AlertID1, AlertID2 } from "../../components/react-interactive/Alert";

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

    await driver.wait(until.titleIs(InteractiveLabel), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('Alert Component', () => {
    it('Applies Alert with X props', async () => {
        const component = await driver.findElement(By.css(`#${AlertID1} .alert`));

        const className = await component.getAttribute('class');
        const xButton = await component.findElements(By.css('button'));

        expect(className).toContain('alert-primary');
        expect(xButton.length).toBe(1);
    });

    it(('Applies Alert without X props'), async () => {
        const component = await driver.findElement(By.css(`#${AlertID2} .alert`))

        const className = await component.getAttribute('class');
        const xButton = await component.findElements(By.css('.button'));

        expect(className).toContain('alert-primary');
        expect(xButton.length).toBe(0);
    });

    it(('Uses the callback'), async () => {
        // gets x button
        const button = await driver.wait(
            until.elementLocated(By.css(`#${AlertID1} .alert`)))
            .findElements(By.css('button'));
        expect(button.length).toBe(1);

        // clicks it and validates alert popped up
        await button[0].click();
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        expect(alertText).toBe('Closing Alert');
        await alert.accept();

        // verifies the alert is not displayed
        const component = await driver.findElements(By.css(`#${AlertID1} .alert`));
        expect(await component[0].isDisplayed()).toBe(false);

        // clicks "Bring Back Closed Alert" button
        const bringBackButton = await driver.findElement(By.css(`#${AlertID1}-button`));
        await bringBackButton.click();

        // re-locate and verify the alert is visible again
        const reappeared = await driver.wait(until.elementLocated(By.css(`#${AlertID1} .alert`)));
        await driver.wait(until.elementIsVisible(reappeared));
        expect(await reappeared.isDisplayed()).toBe(true);
    });
});