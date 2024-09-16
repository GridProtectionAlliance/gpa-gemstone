﻿//******************************************************************************************************
//  TimeWindowUtils.tsx - Gbtc
//
//  Copyright © 2023, Grid Protection Alliance.  All Rights Reserved.
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
//  07/11/2023 - C. Lackner
//       Generated original version of source code.
//  06/20/2024 - Ali Karrar
//       Moved TimeWindowUtil from SEBrowser to gemstone
//******************************************************************************************************
import moment from 'moment';

/**
 * Interface represents picking a time based on Start Date and End Date
 */
export interface IStartEnd {
    start: string;
    end: string;
}
/**
 * Interface represents picking a time based on Start Date and Duration
 */
export interface IStartDuration {
    start: string;
    duration: number;
    unit: TimeUnit;
}
/**
 * Interface represents picking a time based on End Date and Duration
 */
export interface IEndDuration {
    end: string,
    duration: number;
    unit: TimeUnit;
}

export type TimeUnit = 'y' | 'M' | 'w' | 'd' | 'h' | 'm' | 's' | 'ms'
export const units = ['ms', 's', 'm', 'h', 'd', 'w', 'M', 'y'] as TimeUnit[]
export const dateTimeFormat = 'DD MM YYYY hh:mm:ss.SSS';

/**
* A Function to determine the most appropriate unit for a window of time specified by start and end time
*/
export function findAppropriateUnit(startTime: moment.Moment, endTime: moment.Moment): [TimeUnit, number] {
    let unitIndex = 7;

    let diff = endTime.diff(startTime, units[unitIndex], true);

    for (let i = unitIndex; i >= 1; i--) {
        if (Number.isInteger(diff)) {
            return [units[i], diff];
        }
        let nextI = i - 1;

        diff = endTime.diff(startTime, units[nextI], true);

        if (diff > 65000) {
            diff = endTime.diff(startTime, units[i], true);
            return [units[i], Math.round(diff)];
        }
    }

    return [units[0], Math.round(diff)];
}

/**
* Function to handle adding or subtracting duration
*/
export function addDuration(start: moment.Moment, duration: number, unit: TimeUnit): moment.Moment {
    let t1 = start.clone();

    const floor = duration > 0 ? Math.floor(duration) : Math.ceil(duration);    // if duration is negative, use Math.ceil() to get the floor
    const ceil = duration > 0 ? Math.ceil(duration) : Math.floor(duration);     // if duration is negative, use Math.floor() to get the ceil

    if (floor == ceil && units.findIndex(u => u == unit) >= 4)          // if duration is integer, add duration without modifying
        return t1.add(duration, unit);

    t1.add(floor, unit);

    const t2 = t1.clone().add(Math.sign(duration), unit);               // Adds a duration of 1 or -1 depending on the sign of input duration

    const hours = t2.diff(t1, 'h', true) * Math.abs(duration - floor)   // Calculates the difference in hours between t2 and t1 and adds to t1
    return t1.add(hours, 'h');

}

/**
* Returns a unit string based on unit char input
*/
export function readableUnit(unit: TimeUnit) {
    if (unit == 'y') {
        return 'Year(s)';
    } else if (unit == 'M') {
        return 'Month(s)';
    } else if (unit == 'w') {
        return 'Week(s)';
    } else if (unit == 'd') {
        return 'Day(s)';
    } else if (unit == 'h') {
        return 'Hour(s)';
    } else if (unit == 'm') {
        return 'Minute(s)';
    } else if (unit == 's') {
        return 'Second(s)';
    }
    return 'Millisecond(s)';
}
