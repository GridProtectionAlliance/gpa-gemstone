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
import { afterAll, beforeAll, expect, test } from "@jest/globals";
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

const breadcrumbSelector = By.xpath(`//*[@id='breadcrumb-test-id']/nav/ol`);
const stepItemsSelector = By.xpath(`//*[@id='breadcrumb-test-id']//li[contains(@class, 'breadcrumb-item')]`);
const getStepByText = (text: string) =>
    By.xpath(`//*[@id='breadcrumb-test-id']//li[normalize-space()='${text}' or a[normalize-space(text())='${text}']]`);

test('Breadcrumb.tsx: Validating Breadcrumb is visible and props applied', async () => {
    // verify is rendered
    const breadcrumb = await driver.findElement(breadcrumbSelector);
    expect(await breadcrumb.isDisplayed()).toBe(true);

    // verify order
    const steps = await driver.findElements(stepItemsSelector);
    expect(steps.length).toBe(4); // Step One to Step Four

    const stepTexts = await Promise.all(steps.map(step => step.getText()));
    expect(stepTexts).toEqual(['Step One', 'Step Two', 'Step Three', 'Step Four']);

    // verify the selected one is active
    const activeStep = await driver.findElement(
        By.xpath(`//*[@id='breadcrumb-test-id']//li[contains(@class, 'active')]`)
    );
    const activeText = await activeStep.getText();
    expect(activeText).toBe('Step One');
});

test('Breadcrumb.tsx: Validating step change', async () => {
    // Click a non-navigable item (Step Two, no link)
    const stepTwo = await driver.findElement(getStepByText('Step Two'));
    await stepTwo.click();
    let activeStep = await driver.findElement(  // The one with the active class
        By.xpath(`//*[@id='breadcrumb-test-id']//li[contains(@class, 'active')]`)
    ).getText();
    expect(activeStep).toBe('Step One');        // Should remain unchanged

    // Click a navigable item (Step Four)
    const stepFourLink = await driver.findElement(getStepByText('Step Four')).then(el => el.findElement(By.tagName('a')));
    await stepFourLink.click();

    // Wait for breadcrumb to update
    await driver.sleep(500);

    activeStep = await driver.findElement(
        By.xpath(`//*[@id='breadcrumb-test-id']//li[contains(@class, 'active')]`)
    ).getText();
    expect(activeStep).toBe('Step Four');
});