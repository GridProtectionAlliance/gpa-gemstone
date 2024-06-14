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
//******************************************************************************************************
import moment from 'moment';

/**
 * Description
 */
export interface ITimeFilter {
    centerTime: string,
    startTime: string,
    endTime: string,
    timeWindowUnits: number,
    windowSize: number,
    halfWindowSize: number,
}

export type TimeUnit = 'y'|'M'|'w'|'d'|'h'|'m'|'s'|'ms'
export const units = ['ms','s','m','h','d','w','M','y'] as TimeUnit[]

export function findAppropriateUnit(startTime: moment.Moment, endTime: moment.Moment, unit?: TimeUnit, useHalfWindow?: boolean) {

    let unitIndex = units.findIndex(u => u == unit);
    if (unit === undefined) 
        unitIndex = 7;

    let diff = endTime.diff(startTime, units[unitIndex], true);
    if (useHalfWindow !== undefined && useHalfWindow)
        diff = diff / 2;

    for (let i = unitIndex; i >= 1; i--) {
        if (i == 6) // Remove month as appropriate due to innacuracy in definition (31/30/28/29 days)
            continue;
        if (Number.isInteger(diff)) {
            return [i, diff];
        }
        let nextI = i - 1;
        if (nextI == 6)
            nextI = 5;
          
        diff = endTime.diff(startTime, units[nextI], true);
        if (useHalfWindow !== undefined && useHalfWindow)
            diff = diff / 2;

        if (diff > 65000) {
            diff = endTime.diff(startTime, units[i], true);
            if (useHalfWindow !== undefined && useHalfWindow)
                diff = diff / 2;
            return [i, Math.round(diff)];
        }
            
    }

    return [0, Math.round(diff)];
}

export function getStartEndTime(center: moment.Moment, duration: number, unit: TimeUnit): [moment.Moment, moment.Moment] {
    const d = moment.duration(duration, unit);
    const start = center.clone().subtract(d.asHours(), 'h');
    const end = center.clone().add(d.asHours(), 'h');
    return [start, end]
}

export function getMoment(date: string, time?: string) {
    if (time === undefined)
        return moment(date, 'MM/DD/YYYY HH:mm:ss.SSS');
    return moment(date + ' ' + time, 'MM/DD/YYYY HH:mm:ss.SSS');
}


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