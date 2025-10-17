//******************************************************************************************************
//  RadioButtons.test.ts - Gbtc
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
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { FormsPageLabel } from "../../components/App";

const rootURL = `http://localhost:${global.PORT}/forms`;
let driver: WebDriver;
const testId = 'radiobuttons-test-id';

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
    await driver.wait(until.titleIs(FormsPageLabel), 10000);
});

afterEach(async () => {
    if (driver) await driver.quit();
});

describe('RadioButtons Component', () => {
    const displaySelector = `#${testId}-text`;
    const radioInputSelector = `#${testId}-buttons input.form-check-input`;
    const labelSelector = `#${testId}-buttons label.form-check-label`;

    const expectedOptions = [
        { value: '1', label: 'first option label' },
        { value: 'second option', label: 'second option label' },
        { value: 'third option', label: 'third option label' },
        { value: 'fourth option', label: 'fourth option label' },
        { value: 'fifth option', label: 'fifth option label' },
        { value: 'sixth option', label: 'sixth option label' },
        { value: 'seventh option', label: 'seventh option label', disabled: true }
    ];

    it('renders all radio buttons with correct labels and states', async () => {
        const inputs = await driver.findElements(By.css(radioInputSelector));
        const labels = await driver.findElements(By.css(labelSelector));
        expect(inputs.length).toBe(expectedOptions.length);
        expect(labels.length).toBe(expectedOptions.length + 1); // all the button labels + the radio label

        for (let i = 0; i < expectedOptions.length; i++) {
            const input = inputs[i];
            const label = labels[i + 1];

            const labelText = await label.getText();
            expect(labelText).toBe(expectedOptions[i].label);

            const isDisabled = await input.getAttribute('disabled');
            if (expectedOptions[i].disabled)
                expect(isDisabled).toBe('true');
            else
                expect(isDisabled).toBeNull();
        }
    });

    it('updates the record display when a radio button is clicked', async () => {
        const inputs = await driver.findElements(By.css(radioInputSelector));

        for (let i = 0; i < expectedOptions.length - 1; i++) { // Skip the disabled one
            await inputs[i].click();
            await driver.sleep(50);

            const displayText = await driver.findElement(By.css(displaySelector)).getText();
            expect(displayText).toContain(expectedOptions[i].value);
        }
    });

    it('does not update display when clicking the disabled button', async () => {
        const display = await driver.findElement(By.css(displaySelector));
        const initial = await display.getText();

        const inputs = await driver.findElements(By.css(radioInputSelector));
        const disabledInput = inputs[inputs.length - 1];

        await disabledInput.click(); // Should have no effect
        await driver.sleep(50);

        const updated = await display.getText();
        expect(updated).toBe(initial);
    });
});
