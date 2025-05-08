//******************************************************************************************************
//  index.tsx - Gbtc
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

import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { test, beforeEach, afterEach, expect } from '@jest/globals';
import 'selenium-webdriver/chrome';
import 'chromedriver';

const rootURL = 'http://localhost:8080';
let driver: WebDriver;

/** Helper Function to find element by ID and wait until it's visible */
async function getElementById(id): Promise<WebElement> {
    const el = await driver.wait(until.elementLocated(By.id(id)), 10000);
    return driver.wait(until.elementIsVisible(el), 10000);
}

beforeEach(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get(rootURL); // Navigate to the page
    await driver.wait(until.titleIs('GPA Test'), 10000); // Wait until the page title is loaded
});

afterEach(async () => {
    if (driver) await driver.quit();
});

test('loads the correct title', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('GPA Test');
});

test('has a visible #window element', async () => {
    const el = await getElementById('window');
    expect(await el.isDisplayed()).toBe(true);
});