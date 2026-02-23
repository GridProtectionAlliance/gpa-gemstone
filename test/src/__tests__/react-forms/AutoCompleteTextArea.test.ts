//******************************************************************************************************
//  AutoCompleteTextArea.test.tsx - Gbtc
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
//  02/17/2026 - Natalie Beatty
//       Generated original version of source code.
//
//******************************************************************************************************

import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { AutoCompleteTextAreaRoute } from "../../components/App";
import { AutoCompleteTextAreaID } from "../../components/react-forms/AutoCompleteTextArea";

const rootURL = `http://localhost:${global.PORT}/${AutoCompleteTextAreaRoute}`;
let driver: WebDriver;

// Before, create a selenium webdriver that goes to the rootURL
beforeEach(async () => {
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

    await driver.wait(until.titleIs(AutoCompleteTextAreaRoute), 10000); // Wait until the page title is loaded
});

// close the driver after
afterEach(async () => {
    if (driver) await driver.quit();
});

describe('AutoCompleteTextArea', () => {
    it('provides a dropdown of suggestions when the cursor lies after an open curly bracket', async () => {
        const autoCompleteDiv = await driver.wait(until.elementLocated(By.id(AutoCompleteTextAreaID)), 100)
        const autoCompleteTextArea = await autoCompleteDiv.findElement(By.css('textarea.form-control'));
        await driver.wait(until.elementIsVisible(autoCompleteTextArea), 300)
        await autoCompleteTextArea.sendKeys("{");
        const dropDown = await driver.wait(until.elementLocated(By.css('table.table.table-hover')), 100);
        expect(dropDown).toBeDefined();
        const dropDownRect = await dropDown.getRect();
        expect(dropDownRect.x).toBeGreaterThan(0); // neither x nor y should be 0.
        expect(dropDownRect.y).toBeGreaterThan(0);
    }),
    it('inserts selected suggestion into the text, preserving before and after text, including empty or broken variables', async () => {
        const autoCompleteDiv = await driver.wait(until.elementLocated(By.id(AutoCompleteTextAreaID)), 100)
        const autoCompleteTextArea = await autoCompleteDiv.findElement(By.css('textarea.form-control'));
        await driver.wait(until.elementIsVisible(autoCompleteTextArea), 300)

        // add an opening curly brackets that would break earlier versions of autocomplete
        await autoCompleteTextArea.sendKeys("i like to {read every weekend { night.");
        await driver.executeScript(`
            const textarea = document.getElementsByClassName("form-control")[0];
            textarea.focus();
            textarea.setSelectionRange(15, 15);
            `);
        await autoCompleteTextArea.sendKeys(" {");
        const dropDown = await driver.wait(until.elementLocated(By.css('table.table.table-hover')), 100);
        const poreteSuggestion = await dropDown.findElement(By.xpath("//tbody/tr[td='{Porete}']/td"));
        await driver.wait(until.elementIsVisible(poreteSuggestion));
        await poreteSuggestion.click();
        // makes the test more consistent
        await driver.sleep(100);
        expect(await autoCompleteTextArea.getText()).toBe("i like to {read {Porete} every weekend { night.");
    }),
    it('moves the dropdown to the variable under the caret.', async () => {
        const autoCompleteDiv = await driver.wait(until.elementLocated(By.id(AutoCompleteTextAreaID)), 100)
        const autoCompleteTextArea = await autoCompleteDiv.findElement(By.css('textarea.form-control'));
        await driver.wait(until.elementIsVisible(autoCompleteTextArea), 300)
        await autoCompleteTextArea.sendKeys("{");
        const firstDropDown = await driver.wait(until.elementLocated(By.css('table.table.table-hover')), 100);
        expect(firstDropDown).toBeDefined();
        const firstRect = await firstDropDown.getRect();
        await autoCompleteTextArea.sendKeys("} lorem \n ipsum lorem ipsum yes yes yes {");
        const secondDropDown = await driver.wait(until.elementLocated(By.css('table.table.table-hover')), 100);
        expect(secondDropDown).toBeDefined();
        const secondRect = await secondDropDown.getRect();
        expect(secondRect.x).toBeGreaterThan(firstRect.x);
        expect(secondRect.y).toBeGreaterThan(firstRect.y);
        await driver.executeScript(`
            const textarea = document.getElementsByClassName("form-control")[0];
            textarea.focus();
            textarea.setSelectionRange(1, 1);
            `);
        // setting the selection by script prevents autocomplete from updating. 
        // by sending keys, we can also make sure that the location of the dropdown doesn't change while typing.
        await autoCompleteTextArea.sendKeys("e"); 
        const thirdDropDown = await driver.wait(until.elementLocated(By.css('table.table.table-hover')), 100);
        await driver.sleep(200);
        expect(thirdDropDown).toBeDefined();
        const thirdRect = await thirdDropDown.getRect();
        expect(thirdRect.x).toBe(firstRect.x);
        expect(thirdRect.y).toBe(firstRect.y);
    })
})