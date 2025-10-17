//******************************************************************************************************
//  Map.test.ts - Gbtc
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
import { MapPageRoute } from "../../components/App";
import { MAP_ID } from "../../components/react-interactive/Map";

const rootURL = `http://localhost:${global.PORT}/${MapPageRoute}`;
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

    await driver.wait(until.titleIs(MapPageRoute), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('Map Component', () => {

    it('Map Renders', async () => {
        //Ensure map container is present
        const component = await driver.findElement(By.css(`#${MAP_ID} .leaflet-container`));
        const className = await component.getAttribute('class');

        expect(className).toContain('leaflet-container');

        //Ensure at least one tile is loaded and width is greater than 0
        const tile = await driver.findElement(By.css(`#${MAP_ID} .leaflet-tile`));
        const tileWidth = parseFloat(await tile.getCssValue('width'));
        expect(tileWidth).toBeGreaterThan(0);

        //Ensure map has zoom controls
        const zoomIn = await driver.findElement(By.css(`#${MAP_ID} .leaflet-control-zoom-in`));
        const zoomOut = await driver.findElement(By.css(`#${MAP_ID} .leaflet-control-zoom-out`));

        expect(await zoomIn.isDisplayed()).toBe(true);
        expect(await zoomOut.isDisplayed()).toBe(true);
    });

});