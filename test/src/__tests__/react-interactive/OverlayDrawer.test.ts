//******************************************************************************************************
//  OverlayDrawer.test.ts - Gbtc
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
//  06/01/2026 - Preston Crawford
//       Generated original version of source code.
//
//******************************************************************************************************

import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { OverlayDrawerPageRoute } from "../../components/App";
import {
    DOM_TARGET_ID, SCROLL_TARGET_ID, RESIZE_TARGET_ID,
    DOM_WRAPPER_ID, SCROLL_WRAPPER_ID, RESIZE_WRAPPER_ID,
    INSERT_BTN_ID, SCROLL_CONTAINER_ID
} from "../../components/react-interactive/OverlayDrawer";

const rootURL = `http://localhost:${global.PORT}/${OverlayDrawerPageRoute}`;
let driver: WebDriver;

// This is needed as the tests rely on getBoundingClientRect 
// which can be off by a pixel or two due to sub-pixel rendering and rounding, 
// so we allow a small tolerance when comparing expected vs actual positions. 
const TOLERANCEPX = 1;

interface IRect { top: number, left: number, width: number, height: number }

// Read an element's viewport rect (getBoundingClientRect) by css selector.
const getRect = (selector: string): Promise<IRect> =>
    driver.executeScript(`
        const el = document.querySelector(arguments[0]);
        if (el == null) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top, left: r.left, width: r.width, height: r.height };
    `, selector) as Promise<IRect>;

// The drawer handle is the first child div of its wrapper.
const getTargetRect = (targetId: string) => getRect(`#${targetId}`);
const getHandleRect = (wrapperId: string) => getRect(`#${wrapperId} > div`);

// Poll until the predicate holds, or time out. The timeout is swallowed so the
// following expect(...) reports the actual measured values on failure.
const waitUntil = (predicate: () => Promise<boolean>) =>
    driver.wait(predicate, 5000).catch(() => { /* asserted via expect below */ });

// For a 'left' located drawer the fixed handle aligns its top/left edge to the target. 
const expectAligned = async (wrapperId: string, targetId: string) => {
    await waitUntil(async () => {
        const handle = await getHandleRect(wrapperId);
        const target = await getTargetRect(targetId);
        return Math.abs(handle.top - target.top) <= TOLERANCEPX && Math.abs(handle.left - target.left) <= TOLERANCEPX;
    });

    const handle = await getHandleRect(wrapperId);
    const target = await getTargetRect(targetId);
    expect(Math.abs(handle.top - target.top)).toBeLessThanOrEqual(TOLERANCEPX);
    expect(Math.abs(handle.left - target.left)).toBeLessThanOrEqual(TOLERANCEPX);
};

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

    await driver.wait(until.titleIs(OverlayDrawerPageRoute), 10000); // Wait until the page title is loaded
});

afterAll(async () => {
    if (driver) await driver.quit();
});

describe('OverlayDrawer Component', () => {

    it('realigns when an element is inserted into the DOM that shifts the target', async () => {
        // Baseline: handle should already be aligned with the target.
        await expectAligned(DOM_WRAPPER_ID, DOM_TARGET_ID);
        const before = await getTargetRect(DOM_TARGET_ID);

        // Insert a tall element above the target, pushing the target down.
        await driver.findElement(By.css(`#${INSERT_BTN_ID}`)).click();

        // The target must have actually moved for this to be a meaningful test.
        await waitUntil(async () => (await getTargetRect(DOM_TARGET_ID)).top - before.top > 50);
        const after = await getTargetRect(DOM_TARGET_ID);
        expect(after.top - before.top).toBeGreaterThan(50);

        // The drawer must follow the target to its new position.
        await expectAligned(DOM_WRAPPER_ID, DOM_TARGET_ID);
    });

    it('realigns when the container holding the target is scrolled', async () => {
        await expectAligned(SCROLL_WRAPPER_ID, SCROLL_TARGET_ID);
        const before = await getTargetRect(SCROLL_TARGET_ID);

        // Scroll the container; the target moves up within the viewport.
        await driver.executeScript(
            `document.querySelector(arguments[0]).scrollTop = 150;`,
            `#${SCROLL_CONTAINER_ID}`
        );

        // Confirm the scroll actually moved the target.
        await waitUntil(async () => before.top - (await getTargetRect(SCROLL_TARGET_ID)).top > 50);
        const after = await getTargetRect(SCROLL_TARGET_ID);
        expect(before.top - after.top).toBeGreaterThan(50);

        // The drawer must realign with the shifted target.
        await expectAligned(SCROLL_WRAPPER_ID, SCROLL_TARGET_ID);
    });

    it('realigns when the window is resized', async () => {
        await expectAligned(RESIZE_WRAPPER_ID, RESIZE_TARGET_ID);
        const before = await getTargetRect(RESIZE_TARGET_ID);

        // Shrink the window width; the right-aligned target moves left.
        await driver.manage().window().setRect({ width: 500, height: 900 });

        // Confirm the resize actually moved the target.
        await waitUntil(async () => before.left - (await getTargetRect(RESIZE_TARGET_ID)).left > 50);
        const after = await getTargetRect(RESIZE_TARGET_ID);
        expect(before.left - after.left).toBeGreaterThan(50);

        // The drawer must realign with the shifted target.
        await expectAligned(RESIZE_WRAPPER_ID, RESIZE_TARGET_ID);
    });
});
