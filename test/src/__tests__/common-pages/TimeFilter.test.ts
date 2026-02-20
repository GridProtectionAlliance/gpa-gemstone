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
import { Builder, By, until, WebDriver, logging, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from "chromedriver";
import { TimeFilterRoute } from "../../components/App";
import moment from 'moment';
import 'moment-timezone';
import { NonUTCStartEndTimeFilterID, NonUTCTimeZone, StartEndTimeFilterID, StartWindowTimeFilterID } from "../../components/common-pages/TimeFilter";

const rootURL = `http://localhost:${global.PORT}/${TimeFilterRoute}`;
let driver: WebDriver;

const allAvailableQuickSelectLabels = [
    'This Hour', 'Last Hour', 'Last 60 Minutes',
    'Today', 'Yesterday', 'Last 24 Hours',
    'This Week', 'Last Week', 'Last 7 Days',
    'This Month', 'Last Month', 'Last 30 Days',
    'This Quarter', 'Last Quarter', 'Last 90 Days',
    'This Year', 'Last Year', 'Last 365 Days'
];

// Before each test, create a selenium webdriver that goes to the rootURL
beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();
    // Ensure headless mode for sizing tests. Mimics Jenkins
    options.addArguments(
        `--window-size=1600,800`,
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

    await driver.executeScript(`window.resizeTo(1600,800)`)
    await driver.get(rootURL); // Navigate to the page

    await driver.wait(until.titleIs(TimeFilterRoute), 10000); // Wait until the page title is loaded
});

// close the driver after each test
afterAll(async () => {
    if (driver) await driver.quit();
});

describe('TimeFilter Component', () => {

    it('renders startEndFilter with expected child elements', async () => {
        const root = await driver.wait(until.elementLocated(By.id(StartEndTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));

        const inputs = await driver.wait<WebElement[]>(until.elementsLocated(By.css(`#${StartEndTimeFilterID} fieldset input[type="datetime-local"]`)), 5000);
        const [startInput, endInput] = inputs;

        const quickSelectItems = await fieldset.findElements(By.css('li.item'));
        const quickSelectTexts = await Promise.all(quickSelectItems.map(el => el.getText()));

        //field set container
        expect(await fieldset.isDisplayed()).toBe(true);

        //start input
        expect(await startInput.isDisplayed()).toBe(true);

        //end input
        expect(await endInput.isDisplayed()).toBe(true);

        //Quickselects
        expect(quickSelectTexts).toEqual(expect.arrayContaining(allAvailableQuickSelectLabels)); //individual quick selects
    });

    it('renders startWindowFilter with expected child elements', async () => {
        const root = await driver.wait(until.elementLocated(By.id(StartWindowTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));

        const startInputEl = await fieldset.findElement(By.css('input[type="datetime-local"]'));
        const spanInputEl = await fieldset.findElement(By.css('input[type="number"]')); // duration value
        const unitSelectEl = await fieldset.findElement(By.css('select'));               // duration units

        const quickSelectItems = await fieldset.findElements(By.css('li.item'));
        const quickSelectTexts = await Promise.all(quickSelectItems.map(el => el.getText()));

        const unitSelectOptionEls = await unitSelectEl.findElements(By.css('option'));
        const optionValues = await Promise.all(unitSelectOptionEls.map(async (el) => await el.getAttribute('value')));

        //fieldset container
        expect(await fieldset.isDisplayed()).toBe(true);

        //start input 
        expect(await startInputEl.isDisplayed()).toBe(true);

        //Span input
        expect(await spanInputEl.isDisplayed()).toBe(true);

        //Select El and Options
        expect(await unitSelectEl.isDisplayed()).toBe(true);
        expect(optionValues).toEqual(expect.arrayContaining(['ms', 's', 'm', 'h', 'd', 'w', 'M', 'y']));

        //Quickselects
        expect(quickSelectTexts).toEqual(expect.arrayContaining(allAvailableQuickSelectLabels)); //individual quick selects
    });

    it('renders endWindowFilter with expected child elements', async () => {
        const root = await driver.wait(until.elementLocated(By.id(StartWindowTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));

        const endInputEl = await fieldset.findElement(By.css('input[type="datetime-local"]'));
        const spanInputEl = await fieldset.findElement(By.css('input[type="number"]')); // duration value
        const unitSelectEl = await fieldset.findElement(By.css('select'));               // duration units

        const quickSelectItems = await fieldset.findElements(By.css('li.item'));
        const quickSelectTexts = await Promise.all(quickSelectItems.map(el => el.getText()));

        const unitSelectOptionEls = await unitSelectEl.findElements(By.css('option'));
        const optionValues = await Promise.all(unitSelectOptionEls.map(async (el) => await el.getAttribute('value')));

        //fieldset container
        expect(await fieldset.isDisplayed()).toBe(true);

        //start input 
        expect(await endInputEl.isDisplayed()).toBe(true);

        //Span input
        expect(await spanInputEl.isDisplayed()).toBe(true);

        //Select El and Options
        expect(await unitSelectEl.isDisplayed()).toBe(true);
        expect(optionValues).toEqual(expect.arrayContaining(['ms', 's', 'm', 'h', 'd', 'w', 'M', 'y']));

        //Quickselects
        expect(quickSelectTexts).toEqual(expect.arrayContaining(allAvailableQuickSelectLabels)); //individual quick selectss
    });

    it('correctly sets dateTime values in startEndFilter to quick select option', async () => {
        const root = await driver.wait(until.elementLocated(By.id(StartWindowTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));
        const quickSelectItems = await fieldset.findElements(By.css('li.item'));

        for (const el of quickSelectItems) {
            const label = (await el.getText()).trim();

            const now = moment.utc(); // Use UTC to match test filter logic
            const computeRange = quickSelectMappings[label];

            await el.click();
            await driver.sleep(100); // allow UI update

            const inputs = await driver.wait<WebElement[]>(until.elementsLocated(By.css(`#${StartEndTimeFilterID} fieldset input[type="datetime-local"]`)), 5000);
            const [startInputEl, endInputEl] = inputs;

            const startVal = await startInputEl.getAttribute('value');
            const endVal = await endInputEl.getAttribute('value');

            const [expectedStart, expectedEnd] = computeRange(now);

            const startUnixVal = moment.parseZone(startVal).valueOf();
            const endUnixVal = moment.parseZone(endVal).valueOf();

            const expectStartUnix = moment(expectedStart).valueOf();
            const expectEndUnix = moment(expectedEnd).valueOf();

            //allow 250ms tolerance
            const startDiff = Math.abs(startUnixVal - expectStartUnix);
            const endDiff = Math.abs(endUnixVal - expectEndUnix);

            expect(startDiff).toBeLessThanOrEqual(250);
            expect(endDiff).toBeLessThanOrEqual(250);
        }

    });


    it('correctly sets date to selected option in input popups', async () => {
        const root = await driver.wait(until.elementLocated(By.id(StartEndTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));

        const inputs = await driver.wait<WebElement[]>(until.elementsLocated(By.css(`#${StartEndTimeFilterID} fieldset input[type="datetime-local"]`)), 5000);
        const [startInput] = inputs;

        await startInput.click();
        await driver.sleep(1000); // allow UI update

        const startCalendarTable = await driver.wait(until.elementLocated(By.css('div.gpa-gemstone-datetime-popup table')), 5000);

        const monthSelector = await driver.wait(until.elementLocated(By.css(`div.gpa-gemstone-datetime-popup table thead tr th:nth-child(2)`)), 5000);
        await monthSelector.click();
        const januaryMonthBtn = await driver.wait(until.elementLocated(By.css('div.gpa-gemstone-datetime-popup table tbody tr:nth-child(1) td:nth-child(1)')), 5000);
        await januaryMonthBtn.click();

        const cell01 = await startCalendarTable.findElement(By.xpath(".//td[normalize-space(.)='01']"));
        await cell01.click();

        const startInputValue = await startInput.getAttribute('value');
        const expectedStart = moment.utc().startOf('year');

        await fieldset.click(); // Click outside to close the popup

        expect(moment(startInputValue).date()).toBe(expectedStart.date());
    });

    it('correctly sets time to adjusted values in input popups', async () => {
        const inputs = await driver.wait<WebElement[]>(until.elementsLocated(By.css(`#${StartEndTimeFilterID} fieldset input[type="datetime-local"]`)), 5000);
        const [_, endInputEl] = inputs;

        await endInputEl.click();
        await driver.sleep(500); // allow UI update

        let endElValue = moment(await endInputEl.getAttribute('value'));
        let prevEndElValue = endElValue.clone();

        // Locate popup containing time adjustment arrows
        const popup = await driver.wait(
            until.elementLocated(By.css('.gpa-gemstone-datetime-popup')),
            5000
        );

        const timeTable = await popup.findElement(By.xpath(".//div[2]/table/tbody"));

        const hourUpArrow = await timeTable.findElement(By.xpath(".//tr[1]/td[1]"));
        const hourDownArrow = await timeTable.findElement(By.xpath(".//tr[3]/td[1]"));
        const minuteUpArrow = await timeTable.findElement(By.xpath(".//tr[1]/td[3]"));
        const minuteDownArrow = await timeTable.findElement(By.xpath(".//tr[3]/td[3]"));
        const secondUpArrow = await timeTable.findElement(By.xpath(".//tr[1]/td[5]"));
        const secondDownArrow = await timeTable.findElement(By.xpath(".//tr[3]/td[5]"));
        const msUpArrow = await timeTable.findElement(By.xpath(".//tr[1]/td[7]"));
        const msDownArrow = await timeTable.findElement(By.xpath(".//tr[3]/td[7]"));

        // HOUR +
        prevEndElValue = endElValue.clone();
        await hourUpArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.hour()).toBe(prevEndElValue.hour() + 1);

        // HOUR -
        prevEndElValue = endElValue.clone();
        await hourDownArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.hour()).toBe(prevEndElValue.hour() - 1);

        // MINUTE +
        prevEndElValue = endElValue.clone();
        await minuteUpArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.minute()).toBe(prevEndElValue.minute() + 1);

        // MINUTE -
        prevEndElValue = endElValue.clone();
        await minuteDownArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.minute()).toBe(prevEndElValue.minute() - 1);

        // SECOND +
        prevEndElValue = endElValue.clone();
        await secondUpArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.second()).toBe(prevEndElValue.second() + 1);

        // SECOND -
        prevEndElValue = endElValue.clone();
        await secondDownArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.second()).toBe(prevEndElValue.second() - 1);

        // MS +
        prevEndElValue = endElValue.clone();
        await msUpArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.millisecond()).toBe(prevEndElValue.millisecond() + 1);

        // MS -
        prevEndElValue = endElValue.clone();
        await msDownArrow.click();
        await driver.sleep(500);
        endElValue = moment(await endInputEl.getAttribute('value'));
        expect(endElValue.millisecond()).toBe(prevEndElValue.millisecond() - 1);

        const root = await driver.wait(until.elementLocated(By.id(StartEndTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));
        fieldset.click(); // Click outside to close the popup
    });

    it('disallows start and end popups from being open at the same time', async () => {
        const inputs = await driver.wait<WebElement[]>(until.elementsLocated(By.css(`#${StartEndTimeFilterID} fieldset input[type="datetime-local"]`)), 5000);
        const [startInput, endInput] = inputs;

        // Attempt to open both popups
        await startInput.click();
        await endInput.click();
        await driver.sleep(1000); // allow UI update

        const tables = await driver.findElements(By.css('.gpa-gemstone-datetime-popup'));

        expect(tables.length).toBe(1);
    });

    it('correctly sets dateTime values in startWindowFilter to quick select option when timeZone is not UTC', async () => {
        // Locate the non-UTC start/end filter
        const root = await driver.wait(until.elementLocated(By.id(NonUTCStartEndTimeFilterID)), 5000);
        const fieldset = await root.findElement(By.css('fieldset'));
        const quickSelectItems = await fieldset.findElements(By.css('li.item'));

        for (const el of quickSelectItems) {
            const label = (await el.getText()).trim();
            if (label === '') continue; // Skip empty labels

            // Compute expected UTC-range
            const utcNow = moment.utc();
            const computeRange = quickSelectMappings[label];
            const [expectedStartUtc, expectedEndUtc] = computeRange(utcNow);

            // Click the quick-select and let the UI update
            await el.click();
            await driver.sleep(100);

            // Read back the displayed local-times
            const inputs = await driver.wait<WebElement[]>(
                until.elementsLocated(By.css(`#${NonUTCStartEndTimeFilterID} fieldset input[type="datetime-local"]`)),
                5000
            );
            const [startInputEl, endInputEl] = inputs;
            const startVal = await startInputEl.getAttribute('value');
            const endVal = await endInputEl.getAttribute('value');

            // Parse them *as* America/Chicago local times
            const startUnixVal = moment.tz(startVal, NonUTCTimeZone).valueOf();
            const endUnixVal = moment.tz(endVal, NonUTCTimeZone).valueOf();

            // And compare against the UTC-based expectation
            const expectStartUnix = moment(expectedStartUtc).valueOf();
            const expectEndUnix = moment(expectedEndUtc).valueOf();

            // Allow a small tolerance for rendering delays
            expect(Math.abs(startUnixVal - expectStartUnix)).toBeLessThanOrEqual(250);
            expect(Math.abs(endUnixVal - expectEndUnix)).toBeLessThanOrEqual(250);
        }
    });
});

const quickSelectMappings: { [label: string]: (now: moment.Moment) => [string, string] } = {
    'This Hour': (now) => {
        const t = now.clone().startOf('hour');
        return [t.toISOString(), t.clone().add(60, 'minutes').toISOString()];
    },
    'Last Hour': (now) => {
        const t = now.clone().startOf('hour').subtract(1, 'hour');
        return [t.toISOString(), t.clone().add(60, 'minutes').toISOString()];
    },
    'Last 60 Minutes': (now) => {
        const t = now.clone().startOf('minute').subtract(60, 'minutes');
        return [t.toISOString(), t.clone().add(60, 'minutes').toISOString()];
    },
    'Today': (now) => {
        const t = now.clone().startOf('day');
        return [t.toISOString(), t.clone().add(24, 'hours').toISOString()];
    },
    'Yesterday': (now) => {
        const t = now.clone().startOf('day').subtract(1, 'day');
        return [t.toISOString(), t.clone().add(24, 'hours').toISOString()];
    },
    'Last 24 Hours': (now) => {
        const start = now.clone().subtract(24, 'hours');
        const end = now.clone();
        return [start.toISOString(), end.toISOString()];
    },
    'This Week': (now) => {
        const t = now.clone().startOf('week');
        return [t.toISOString(), t.clone().add(7, 'days').toISOString()];
    },
    'Last Week': (now) => {
        const t = now.clone().startOf('week').subtract(1, 'week');
        return [t.toISOString(), t.clone().add(7, 'days').toISOString()];
    },
    'Last 7 Days': (now) => {
        const t = now.clone().startOf('day').subtract(7, 'days');
        return [t.toISOString(), t.clone().add(7, 'days').toISOString()];
    },
    'This Month': (now) => {
        const t = now.clone().startOf('month');
        return [t.toISOString(), t.clone().add(t.daysInMonth(), 'days').toISOString()];
    },
    'Last Month': (now) => {
        const t = now.clone().startOf('month').subtract(1, 'month');
        return [t.toISOString(), t.clone().add(t.daysInMonth(), 'days').toISOString()];
    },
    'Last 30 Days': (now) => {
        const t = now.clone().startOf('day').subtract(30, 'days');
        return [t.toISOString(), t.clone().add(30, 'days').toISOString()];
    },
    'This Quarter': (now) => {
        const t = now.clone().startOf('quarter');
        const tend = t.clone().add(1, 'quarter');
        return [t.toISOString(), tend.toISOString()];
    },
    'Last Quarter': (now) => {
        const t = now.clone().startOf('quarter').subtract(1, 'quarter');
        const tend = t.clone().add(1, 'quarter');
        return [t.toISOString(), tend.toISOString()];
    },
    'Last 90 Days': (now) => {
        const t = now.clone().startOf('day').subtract(90, 'days');
        return [t.toISOString(), t.clone().add(90, 'days').toISOString()];
    },
    'This Year': (now) => {
        const t = now.clone().startOf('year');
        return [t.toISOString(), t.clone().add(12, 'months').toISOString()];
    },
    'Last Year': (now) => {
        const t = now.clone().startOf('year').subtract(1, 'year');
        return [t.toISOString(), t.clone().add(12, 'months').toISOString()];
    },
    'Last 365 Days': (now) => {
        const t = now.clone().startOf('day').subtract(365, 'days');
        return [t.toISOString(), t.clone().add(365, 'days').toISOString()];
    },
};