//******************************************************************************************************
//  Breadcrumb.test.ts - Gbtc
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
//  05/13/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { BREADCRUMB_TEST_ID } from "../../components/react-interactive/Breadcrumb";
import { InteractivePageLabel } from '../../components/App';


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

describe('Breadcrumb Component', () => {
    const breadcrumbSelector = By.css(`#${BREADCRUMB_TEST_ID} .breadcrumb`);
    const stepItemsSelector = By.css(`#${BREADCRUMB_TEST_ID} .breadcrumb .breadcrumb-item`);

    it('Renders Breadcrumb as visible and props applied', async () => {
        // verify is rendered
        const breadcrumb = await driver.findElement(breadcrumbSelector);
        expect(await breadcrumb.isDisplayed()).toBe(true);

        // verify order
        const steps = await driver.findElements(stepItemsSelector);
        expect(steps.length).toBe(4); // Step One to Step Four

        const stepTexts = await Promise.all(steps.map(step => step.getText()));
        expect(stepTexts).toEqual(['Step One', 'Step Two', 'Step Three', 'Step Four']);

        // verify the selected one is active
        const activeStep = await driver.findElement(By.css(`#${BREADCRUMB_TEST_ID} .active`));
        const activeText = await activeStep.getText();
        expect(activeText).toBe('Step One');
    });

    it('Validly changes steps', async () => {
        // Click a non-navigable item (Step Two, no link)
        const stepItems = await driver.findElements(stepItemsSelector);
        const stepTwo = stepItems[1];
        await stepTwo.click();
        let activeStep = await driver.findElement(By.css(`#${BREADCRUMB_TEST_ID} .active`)).getText();
        // Should remain unchanged
        expect(activeStep).toBe('Step One');

        // Click a navigable item (Step Four)
        const stepFourLink = stepItems[3];
        await stepFourLink.click();

        // Wait for breadcrumb to update
        await driver.sleep(500);

        activeStep = await driver.findElement(By.css(`#${BREADCRUMB_TEST_ID} .active`)).getText();
        expect(activeStep).toBe('Step Four');
    });
});
