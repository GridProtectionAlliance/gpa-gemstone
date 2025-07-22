//******************************************************************************************************
//  TimeFilter.test.ts - Gbtc
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
//  07/22/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { EndWindowTimeFilterID, StartEndTimeFilterID, StartWindowTimeFilterID } from "../../components/common-pages/TimeFilter";
import { TimeFilterPageLabel, TimeFilterRoute } from "../../components/App";

const rootURL = `http://localhost:${global.PORT}/${TimeFilterRoute}`;
let driver: WebDriver;

// Before each test, create a selenium webdriver that goes to the rootURL
beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();
    // Ensure headless mode for sizing tests. Mimics Jenkins
    options.addArguments(
        '--window-size=1600,760',
        '--headless=new',
        '--disable-gpu'
    );

    //Configure logging
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    options.setLoggingPrefs(prefs);

    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();

    await driver.executeScript('window.resizeTo(1600,760)')
    await driver.get(rootURL); // Navigate to the page

    await driver.wait(until.titleIs(TimeFilterPageLabel), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('TimeFilter Component', () => {
    it('renders StartEndFilter when dateTimeSetting="startEnd"', async () => {
        const el = await driver.findElement(By.css(`[id='${StartEndTimeFilterID}']`));
        const firstChild = await el.findElement(By.xpath("./*[1]")); //first child of our container should be a fieldset
        const tagName = await firstChild.getTagName();

        const w = await el.getCssValue('width')
        console.log('timeFilterWidth:', w)

        expect(tagName).toBe("fieldset");
    });

    it('renders startWindowFilter when dateTimeSetting="startEnd"', async () => {
        const el = await driver.findElement(By.css(`[id='${StartWindowTimeFilterID}']`));
        const firstChild = await el.findElement(By.xpath("./*[1]")); //first child of our container should be a fieldset
        const tagName = await firstChild.getTagName();

        expect(tagName).toBe("fieldset");
    });

    it('renders startWindowFilter when dateTimeSetting="startEnd"', async () => {
        const el = await driver.findElement(By.css(`[id='${EndWindowTimeFilterID}']`));
        const firstChild = await el.findElement(By.xpath("./*[1]")); //first child of our container should be a fieldset
        const tagName = await firstChild.getTagName();

        expect(tagName).toBe("fieldset");
    });
});