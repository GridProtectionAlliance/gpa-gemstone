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
import { ITimeFilter } from './TimeFilter'

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

export const momentDateFormat = "MM/DD/YYYY";
export const momentTimeFormat = "HH:mm:ss.SSS"; // Also is the gemstone format


// Takes ITimeFilter as input and returns type
export const isStartEnd = (filter: ITimeFilter): filter is IStartEnd => 'start' in filter && 'end' in filter;
export const isStartDuration = (filter: ITimeFilter): filter is IStartDuration => 'start' in filter && 'duration' in filter;
export const isEndDuration = (filter: ITimeFilter): filter is IEndDuration => 'end' in filter && 'duration' in filter;
export const isCenterDuration = (filter: ITimeFilter): filter is ICenterDuration => 'center' in filter && 'halfDuration' in filter;


// Converts ITimeFilter to an ITimeWindow filter
export function getTimeWindow (flt: ITimeFilter){
    let center, start, end, unit, window, halfWindow;

    if (isCenterDuration(flt)){
        center = getMoment(flt.center);
        [start, end] = getStartEndTime(center, flt.halfDuration, flt.unit);        
        unit = flt.unit;
        halfWindow = flt.halfDuration
        window = halfWindow * 2;
    }
    else if (isStartDuration(flt)){
        start = getMoment(flt.start)
        const d = moment.duration(flt.duration / 2.0, flt.unit);
        center = start.clone().add(d);
        end= center.clone().add(d);
        unit = flt.unit;
        window = flt.duration,
        halfWindow = window / 2.0;
    }
    else if (isEndDuration(flt)){
        end = getMoment(flt.end)
        const d = moment.duration(flt.duration / 2.0, flt.unit);
        center = end.clone().subtract(d);
        start = center.clone().subtract(d);
        unit = flt.unit;
        window = flt.duration,
        halfWindow = window / 2.0;
    }
    else if (isStartEnd(flt)){
        start = getMoment(flt.start)
        end = getMoment(flt.end)
        const e = end.format(momentDateFormat + ' ' + momentTimeFormat);
        [unit, halfWindow] = findAppropriateUnit(start, getMoment(e), undefined, true);
        const d = moment.duration(halfWindow, unit);
        center = start.clone().add(d);
        window = halfWindow * 2;
    }

    return {center: center?.format(momentDateFormat + ' ' + momentTimeFormat) ?? '',
            start: start?.format(momentDateFormat + ' ' + momentTimeFormat) ?? '',
            end: end?.format(momentDateFormat + ' ' + momentTimeFormat) ?? '', 
            unit: unit ?? 'ms', 
            window: window ?? 0, 
            halfWindow: halfWindow ?? 0}
}

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
        if (i == 6) // Remove month as appropriate due to innacuracy in definition (31/30/28/29 days)
            continue;
        if (Number.isInteger(diff)) {
            return [units[i], diff];
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
            return [units[i], Math.round(diff)];
        }
            
    }

    return [units[0], Math.round(diff)];
}

/*
* Determines a start time and end time for a window given by center time and duration
*/
export function getStartEndTime(center: moment.Moment, duration: number, unit: TimeUnit): [moment.Moment, moment.Moment] {
    const d = moment.duration(duration, unit);
    const start = center.clone().subtract(d.asHours(), 'h');
    const end = center.clone().add(d.asHours(), 'h');
    return [start, end]
}

/*
* Returns a formatted version of date and time provided
*/
export function getMoment(date: string, time?: string) {
    if (time === undefined)
        return moment(date, 'MM/DD/YYYY HH:mm:ss.SSS');
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
