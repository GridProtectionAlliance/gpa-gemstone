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

test('Alert.tsx: Validating Alert with X props are applied', async () => {
    const component = await driver.findElements(By.xpath("//*[contains(text(), 'Alert component with X')]"));

    const className = await component[0].getAttribute('class');
    const xButton = await component[0].findElements(By.css('button'));

    expect(className).toContain('alert-primary');
    expect(xButton.length).toBe(1);
});

test(('Alert.tsx: Validating Alert without X props are applied'), async () => {
    const component = await driver.findElements(By.xpath("//*[contains(text(), 'Alert component without X')]"))

    const className = await component[0].getAttribute('class');
    const xButton = await component[0].findElements(By.css('button'));

    expect(className).toContain('alert-primary');
    expect(xButton.length).toBe(0);
});

test(('Alert.tsx: Validating callback functionality'), async () => {
    // gets x button
    const button = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Alert component with X')]")))
        .findElements(By.css('button'));
    expect(button.length).toBe(1);

    // clicks it and validates alert popped up
    await button[0].click();
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    expect(alertText).toBe('Closing Alert');
    await alert.accept();

    // verifies the alert is not displayed
    const component = await driver.findElements(By.xpath("//*[contains(text(), 'Alert component with X')]"));
    expect(await component[0].isDisplayed()).toBe(false);

    // clicks "Bring Back Closed Alert" button
    const bringBackButton = await driver.findElement(By.xpath("//button[contains(text(), 'Bring Back Closed Alert')]"));
    await bringBackButton.click();

    // re-locate and verify the alert is visible again
    const reappeared = await driver.findElements(By.xpath("//*[contains(text(), 'Alert component with X')]"));
    expect(await reappeared[0].isDisplayed()).toBe(true);
})