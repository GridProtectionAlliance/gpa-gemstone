//******************************************************************************************************
//  Application.test.ts - Gbtc
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
//  05/22/2025 - Collins Self
//       Generated original version of source code.
//
//******************************************************************************************************

import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { AlertID1, AlertID2 } from '../../components/react-interactive/Alert';
import { BTN_DROPDOWN_ID } from "../../components/react-interactive/DropdownButton";
import { BREADCRUMB_TEST_ID } from "../../components/react-interactive/Breadcrumb";
import { CHECKBOX_TEST_ID } from '../../components/react-forms/Checkbox';


const rootURL = `http://localhost:${global.PORT}/`;
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

    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`div.navbar`))), 10000); // Wait until the navbar
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

// TODO: - Clicking goes to the right place, test for two routes
//       - Clicking bolds the selection and no others
//       - Clicking header folds, clicking header that is not foldable does not fold

describe('Application Component', () => {
    it('Renders the navbar component with some list elements', async () => {
        const navbar = await driver.findElement(By.css(`div.navbar`));
        expect(parseFloat(await navbar.getCssValue('width'))).toBeGreaterThan(0);

        const elements = await navbar.findElements(By.css(`ul`));
        expect(elements.length).toBeGreaterThan(2);
    });

    it.each([
        { tooltip: 'interactive', expectedPath: '/interactive', expectedElements: [AlertID1, AlertID2, BTN_DROPDOWN_ID, BREADCRUMB_TEST_ID] },
        { tooltip: 'forms', expectedPath: '/forms', expectedElements: [CHECKBOX_TEST_ID] }
    ])('Goes to correct path, sets path active and loads page when $tooltip link is clicked',
        async ({ tooltip, expectedPath, expectedElements }) => {
            const navbar = await driver.findElement(By.css('div.navbar'));
            const links = await navbar.findElements(By.css('a.nav-link'));

            let targetLink;
            for (const link of links) {
                const dataTooltip = await link.getAttribute('data-tooltip');
                if (dataTooltip === tooltip) {
                    targetLink = link;
                    break;
                }
            }

            expect(targetLink).toBeDefined();

            await targetLink.click();
            await driver.wait(until.urlContains(expectedPath));

            const classAttr = await targetLink.getAttribute('class');
            expect(classAttr).toContain('active');

            for (const id of expectedElements) {
                const element = await driver.findElement(By.id(id));
                expect(element).toBeDefined();
            }
        });

    it('Folds header on click and does not allow folding when in section', async () => {
        const navbarHeaders = await driver.findElements(By.css('h6.sidebar-heading'));
        expect(navbarHeaders.length).toBeGreaterThanOrEqual(2);

        let navSections = await driver.findElements(By.css('ul.navbar-nav.px-3'));
        const initNumOfSections = navSections.length;

        // Locate the icon inside the span
        const header = await navbarHeaders[1].findElement(By.css('span'));
        const iconUp = await header.findElement(By.css('svg.feather'));
        expect(iconUp).toBeDefined();

        // Second header should not have a chevron (non-collapsible)
        const secondHeaderIcons = await navbarHeaders[0].findElements(By.css('svg'));
        expect(secondHeaderIcons.length).toBe(0);

        // Click first header to fold
        await navbarHeaders[1].click();

        // Wait for icon flip
        await driver.wait(until.elementLocated(By.css('h6.sidebar-heading span svg')), 3000);
        const chevronDown = await navbarHeaders[1].findElement(By.css('svg'));
        expect(chevronDown).toBeDefined();

        // Check nav section count changed
        navSections = await driver.findElements(By.css('ul.navbar-nav.px-3'));
        expect(navSections.length).toBeLessThan(initNumOfSections);

        // Click second header (should remain unchanged)
        await navbarHeaders[0].click();
        const secondHeaderIconsAfter = await navbarHeaders[0].findElements(By.css('svg'));
        expect(secondHeaderIconsAfter.length).toBe(0);
    });
})