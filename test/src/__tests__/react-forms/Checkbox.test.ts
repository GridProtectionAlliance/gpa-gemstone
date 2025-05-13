//******************************************************************************************************
//  Checkbox.test.ts - Gbtc
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

import { afterEach, beforeEach, expect, test } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import 'selenium-webdriver/chrome';
import 'chromedriver';

const rootURL = 'http://localhost:8080';
let driver: WebDriver;
const checkboxSelector = By.xpath(`//*[@id="window"]//span[text()="Form Boolean"]/ancestor::label/preceding-sibling::input[@type="checkbox"]`);
const disabledCheckboxSelector = By.xpath(`//*[@id="window"]//span[text()="Disabled Form Boolean"]/ancestor::label/preceding-sibling::input[@type="checkbox"]`);

// Before, create a selenium webdriver that goes to the rootURL
beforeEach(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get(rootURL); // Navigate to the page
    await driver.wait(until.titleIs('GPA Test'), 10000); // Wait until the page title is loaded
});

// close the driver after
afterEach(async () => {
    if (driver) await driver.quit();
});

test('Checkbox.tsx: Validating checkbox label prop', async () => {
    const component = await driver.findElements(checkboxSelector);
    expect(component.length).toBe(1);
});

test(('Checkbox.tsx: Validating disabled and label checkbox props are applied'), async () => {
    const component = await driver.findElements(disabledCheckboxSelector);
    expect(component.length).toBe(1);
});

test(('Checkbox.tsx: Validating checkbox form setting'), async () => {
    const component = await driver.findElements(checkboxSelector);
    // that it changes state
    await component[0].click();
    const value = await component[0].getAttribute('value');
    expect(value).toBe('on');
    // that it changes data
    const text = await driver.findElement(By.id('checkbox-test-text')).getText();
    expect(text).toContain('true');
});

test(('Checkbox.tsx: Validating disabled checkbox form setting'), async () => {
    const component = await driver.findElements(disabledCheckboxSelector);
    // that it changes state
    await component[0].click();
    const value = await component[0].getAttribute('value');
    expect(value).toBe('off');
    // that it changes data
    const text = await driver.findElement(By.id('checkbox-test-text')).getText();
    expect(text).toContain('false');
});