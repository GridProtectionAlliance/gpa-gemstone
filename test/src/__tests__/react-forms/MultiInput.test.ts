//******************************************************************************************************
//  MultiInput.test.ts - Gbtc
//
//  Copyright (c) 2026, Grid Protection Alliance.  All Rights Reserved.
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
//  03/11/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { MultiInputRoute } from "../../components/App";
import { MultiInputEmptyID, MultiInputPopulatedID } from "../../components/react-forms/MultiInput";

const rootURL = `http://localhost:${global.PORT}/${MultiInputRoute}`;
let driver: WebDriver;

beforeEach(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);
    const options = new chrome.Options();
    options.addArguments('--window-size=750,900', '--headless=new');

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    await driver.get(rootURL);
    await driver.wait(until.titleIs(MultiInputRoute), 10000);
});

afterEach(async () => {
    if (driver) await driver.quit();
});

describe('MultiInput', () => {
    it('shows the plus icon when the array is empty', async () => {
        const container = await driver.wait(until.elementLocated(By.id(MultiInputEmptyID)), 300);
        const plusIcons = await container.findElements(By.css('svg.feather.feather-plus-circle'));
        expect(plusIcons.length).toBe(1);
        const plusBtn = await plusIcons[0].findElement(By.xpath('ancestor::button'));
        const display = await plusBtn.getCssValue('display');
        expect(display).not.toBe('none'); // should only be none when disabled or disableAdd is true
    });

    it('shows the plus icon on the last row when the array has data', async () => {
        const container = await driver.wait(until.elementLocated(By.id(MultiInputPopulatedID)), 300);
        const plusIcons = await container.findElements(By.css('svg.feather.feather-plus-circle'));
        expect(plusIcons.length).toBe(1);
        const plusBtn = await plusIcons[0].findElement(By.xpath('ancestor::button'));
        const display = await plusBtn.getCssValue('display');
        expect(display).not.toBe('none'); // should only be none when disabled or disableAdd is true
    });
});