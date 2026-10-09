//******************************************************************************************************
//  Console.test.ts - Gbtc
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
//  10/08/2026 - Natalie Beatty
//       Generated original version of source code.
//
//******************************************************************************************************
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { ConsolePageRoute } from '../../components/App';
import { ConsoleTestComponent } from "../../components/react-interactive";
import { INCREMENT_BUTTON_ID, LOADING_BUTTON_ID, UPDATING_BUTTON_ID } from "../../components/react-interactive/Console";

const rootURL = `http://localhost:${global.PORT}/${ConsolePageRoute}`;
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

    await driver.wait(until.titleIs(ConsolePageRoute), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe("Console Component", () => {
    it("Does not show update status if it is status is not set", async () => {
        const updating_button = await driver.findElement(By.css(`#${UPDATING_BUTTON_ID}`));
        const updatingStatusLabels = await driver.findElements(By.css("em"));
        expect(updatingStatusLabels.length).toBeGreaterThan(0);
        await updating_button.click();
        const notUpdatingStatusLabel = await driver.findElements(By.css("em"));
        expect(notUpdatingStatusLabel.length).toBe(0);
    })
})