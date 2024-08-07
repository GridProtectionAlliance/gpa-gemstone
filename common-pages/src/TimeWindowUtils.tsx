//******************************************************************************************************
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

export interface IStartEnd {
    start: string;
    end: string;
}
export interface IStartDuration {
    start: string;
    duration: number;
    unit: TimeUnit;
}
export interface IEndDuration {
    end: string,
    duration: number;
    unit: TimeUnit;
}
export interface ICenterDuration {
    center: string;
    halfDuration: number;
    unit: TimeUnit;
}

export type TimeUnit = 'y'|'M'|'w'|'d'|'h'|'m'|'s'|'ms'
export const units = ['ms','s','m','h','d','w','M','y'] as TimeUnit[]

/*
* A Function to determine the most appropriate unit for a window of time specified by start and end time
*/
export function findAppropriateUnit(startTime: moment.Moment, endTime: moment.Moment, unit?: TimeUnit, useHalfWindow?: boolean): [TimeUnit, number] {

    let unitIndex = units.findIndex(u => u == unit);
    if (unit === undefined) 
        unitIndex = 7;

    let diff = endTime.diff(startTime, units[unitIndex], true);
    if (useHalfWindow !== undefined && useHalfWindow)
        diff = diff / 2;

    for (let i = unitIndex; i >= 1; i--) {
        if (Number.isInteger(diff)) {
            return [units[i], diff];
        }
        let nextI = i - 1;

        diff = endTime.diff(startTime, units[nextI], true);
        if (useHalfWindow !== undefined && useHalfWindow)
            diff = diff / 2;

        if (diff > 65000) {
            diff = endTime.diff(startTime, units[i], true);
            if (useHalfWindow !== undefined && useHalfWindow)
                diff = diff / 2;
            return [units[i], Math.round(diff)];
        }
            
    }

    return [units[0], Math.round(diff)];
}

/*
* Determines a start time and end time for a window given by center time and duration
*/
export function getStartEndTime(center: moment.Moment, duration: number, unit: TimeUnit): [moment.Moment, moment.Moment] {
    const start = addDuration(center, -duration, unit);
    const end = addDuration(center, duration, unit);
    return [start, end]
}


/*
* Adds duration as hours if duration is not an integer and adds offset from Daylight Savings Time
*/
export function addDuration(start: moment.Moment, duration: number, unit: TimeUnit): moment.Moment {
    let end = start.clone();

    if ((unit == 'M' || unit == 'd' || unit == 'w' || unit == 'y') && Number.isInteger(duration)) {
        return end.add(duration, unit);        // Don't do any math, duration is already an integer
    }
    else if (unit == 'M') {
        end.add(start.daysInMonth() * duration * 24, 'h');
    }
    else if (unit == 'w') {
        end.add(7 * duration * 24, 'h');
    }
    else if (unit == 'd') {
        end.add(duration * 24, 'h');
    }
    else{
        end.add(duration, unit);
    }

    return end.add(getDSTAdjustedHours(start, end), 'h');   // Add offset from Daylight savings time
}

function getDSTAdjustedHours(start: moment.Moment, end: moment.Moment): number {
    if (!start.isDST() && end.isDST())  return -1;  //subtract an hour
    else if (start.isDST() && !end.isDST())  return 1;  //Add an hour
    else return 0;
}


/*
* Returns a formatted version of date and time provided
*/
export function getMoment(date: string, format?: string, time?: string) {
    if (time === undefined)
        return moment(date, format ?? 'MM/DD/YYYY HH:mm:ss.SSS');
    return moment(date + ' ' + time, 'MM/DD/YYYY HH:mm:ss.SSS');
}


/*
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
