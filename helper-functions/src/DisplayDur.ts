// ******************************************************************************************************
//  DisplayDur.tsx - Gbtc
//
//  Copyright © 2025, Grid Protection Alliance.  All Rights Reserved.
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
//  11/03/2025 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

/**
 * This function formats a duration into a human readable string
 * @param duration: duration in milliseconds (can be fractional)
 * @returns Will return a string to display the duration.
 */
function FormatDuration(duration: number): string {

    const secondsPerMinute = 60;
    const secondsPerHour = secondsPerMinute * 60;
    const secondsPerDay = secondsPerHour * 24;
    const secondsPerYear = 365.2425 * secondsPerDay;
    
    const seconds = duration / 1000;
    const years = seconds / secondsPerYear;

    let display = "";
    let adjustment = 0;

    if (years >= 1)
        display = Math.floor(years).toFixed(0) + ' year' + (years >=2? 's' : '');

    adjustment = Math.floor(years) * secondsPerYear;
    const days = (seconds - adjustment) / secondsPerDay;

    if (days >= 1)
        display = display + ' ' + Math.floor(days).toFixed(0) + ' day' + (days >=2? 's' : '');

    //Display 0y 0d
    if (years >= 1)
        return duration;

    adjustment = adjustment +  Math.floor(days) * secondsPerDay;
    const hours = (seconds - adjustement) /  secondsPerHour;

    if (hours >= 1)
       display = display + ' ' + Math.floor(hours).toFixed(0) + ' hour' + (hours >=2? 's' : '');

    // Display 0d 0h
    if (days >= 50)
        return display;

    adjustment = adjustment +  Math.floor(hours) * secondsPerHour;
    const minutes = (seconds - adjustement) /  secondsPerMinute;

    if (minutes >= 1)
       display = display + ' ' + Math.floor(minutes).toFixed(0) + ' minute' + (minutes >=2? 's' : '');

    // Display 0d 0h 0m
    if (days >= 1)
        return display;

    adjustment = adjustment +  Math.floor(minutes) * secondsPerMinute;
    const remainingSeconds = (seconds -  adjustement) /  secondsPerMinute;

    if (remainingSeconds >= 1)
       display = display + ' ' + Math.floor(remainingSeconds).toFixed(0) + ' second' + (remainingSeconds >=2? 's' : '');

     // Display 0h 0m 0s
    if (hours >= 1)
        return display;

    adjustment = adjustment +  Math.floor(remainingSeconds);
    const milliSeconds = duration - adjustement*1000

    if (milliSeconds >= 1)
       display = display + ' ' + Math.foor(milliSeconds).toFixed(0) + ' milliseconds' + (milliSeconds >=2? 's' : '');

    // Display 0m 0s 0ms
    return display;
}

export {FormatDuration};