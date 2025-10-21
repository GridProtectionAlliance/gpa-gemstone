//******************************************************************************************************
//  LegendEntry.test.ts - Gbtc
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
//  10/17/2025 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { afterAll, beforeAll, describe, expect, it, test } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { LegendEntryPageRoute } from "../../components/App";
import { LegendEntry_ID, LegendEntry_Label, LegendEntry_P_ID, LegendEntry_Starting_Click_Count } from "../../components/react-graph/LegendEntry";

const rootURL = `http://localhost:${global.PORT}/${LegendEntryPageRoute}`;
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

    await driver.wait(until.titleIs(LegendEntryPageRoute), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('Legend Entry Component', () => {

    it('Legend Entry Renders', async () => {
        //Find the container by its id
        const container = await driver.findElement(By.id(LegendEntry_ID));

        // find legendentry by its label text as we dont have a better identifier
        const legendLabel = await container.findElement(
            By.xpath(`.//label[normalize-space(text())="${LegendEntry_Label}"]`)
        );

        expect(await legendLabel.isDisplayed()).toBe(true);
    });

    it('Legend Entry doesn\'t render a line', async () => {
        const container = await driver.findElement(By.id(LegendEntry_ID));
        const numberOfPathElementForTicks = 32;

        // wait for the SVG to appear
        await driver.wait(
            until.elementLocated(By.css(`#${LegendEntry_ID} svg`)),
            5000
        );

        // find any path inside the svg
        const paths = await container.findElements(By.css("svg g path"));

        //expect to be num of ticks
        expect(paths.length).toBe(numberOfPathElementForTicks);
    });

    it('increments click count by 1 when Legend Entry is clicked', async () => {
        const container = await driver.findElement(By.id(LegendEntry_ID));

        // Find the legend entry
        const legendLabel = await container.findElement(
            By.xpath(`.//label[normalize-space(text())="${LegendEntry_Label}"]`)
        );

        const readCounterVal = async (): Promise<number> => {
            const p = await driver.findElement(By.id(LegendEntry_P_ID));
            const text = await p.getText();
            return parseInt(text);
        };

        const beforeCountVal = await readCounterVal();

        await legendLabel.click();

        const expected = beforeCountVal + 1;

        await driver.wait(async () => {
            const current = await readCounterVal();
            return current === expected;
        }, 2000);

        const afterCountVal = await readCounterVal();
        expect(afterCountVal).toBe(expected);
    });

});