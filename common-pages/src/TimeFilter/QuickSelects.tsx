//******************************************************************************************************
//  TimeFilter.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  09/16/2021 - Christoph Lackner
//       Generated original version of source code.
//  06/20/2024 - Ali Karrar
//       Moved QuickSelects from TimeFilter to new file
//******************************************************************************************************

import { ITimeFilter } from '../TimeFilter';
import moment from 'moment';
import momentTZ from 'moment-timezone';


interface IQuickSelect { label: string, createFilter: (timeZone: string, format: string) => ITimeFilter }


//update all quick selects to use new timefilters
export const AvailableQuickSelects: IQuickSelect[] = [
    {
        label: 'This Hour', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            return {         
                start: t.format(format),
                unit: 'm',
                duration: 60,
            }
        }
    },
    {
        label: 'Last Hour', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            return {         
                end: t.format(format),
                unit: 'm',
                duration: 60,
            }
        }
    },
    {
        label: 'Last 60 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {         
                end: t.format(format),
                unit: 'm',
                duration: 60,
            }
        }
    },
    {
        label: 'Today', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {         
                start: t.format(format),
                unit: 'h',
                duration: 24,
            }
        }
    },
    {
        label: 'Yesterday', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {         
                end: t.format(format),
                unit: 'h',
                duration: 24,
            }
        }
    },
    {
        label: 'Last 24 Hours', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes');
            return {         
                end: t.format(format),
                unit: 'h',
                duration: 24,
            }
        }
    },
    {
        label: 'This Week', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            return {         
                start: t.format(format),
                unit: 'h',
                duration: 7 * 24,
            }
        }
    },
    {
        label: 'Last Week', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            return {         
                end: t.format(format),
                unit: 'h',
                duration: 7 * 24,
            }
        }
    },
    {
        label: 'Last 7 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {         
                end: t.format(format),
                unit: 'h',
                duration: 7 * 24,
            }
        }
    },
    {
        label: 'This Month', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month');
            const window = (t.daysInMonth() * 24);
            return {         
                start: t.format(format),
                unit: 'h',
                duration: window,
            }
        }
    },
    {
        label: 'Last Month', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month').subtract(1, 'month');
            const window = (t.daysInMonth() * 24);
            return {         
                start: t.format(format),
                unit: 'h',
                duration: window,
            }
        }
    },
    {
        label: 'Last 30 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {         
                end: t.format(format),
                unit: 'd',
                duration: 30,
            }
        }
    },
    {
        label: 'This Quarter', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('quarter').add(1, 'quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const offset_tend = momentTZ.tz(moment.utc().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('quarter');
            const tend = moment.utc().add(offset_tend, 'minutes').startOf('quarter');
            tend.add(1, 'quarter')
            const h = moment.duration(tend.diff(t)).asDays();

            return {         
                start: t.format(format),
                unit: 'd',
                duration: h,
            }
        }
    },
    {
        label: 'Last Quarter', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('quarter').subtract(1, 'quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const offset_tend = momentTZ.tz(moment.utc().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('quarter');
            const tend = moment.utc().add(offset_tend, 'minutes').startOf('quarter');
            t.subtract(1, 'quarter');
            const h = moment.duration(tend.diff(t)).asDays();

            return {         
                start: t.format(format),
                unit: 'd',
                duration: h,
            }
        }
    },
    {
        label: 'Last 90 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(45, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {         
                end: t.format(format),
                unit: 'd',
                duration: 90,
            }
        }
    },
    {
        label: 'This Year', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('year');
            return {         
                start: t.format(format),
                end: t.endOf('year').format(format)
            }
        }
    },
    {
        label: 'Last Year', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minute').startOf('year').subtract(1, 'year');
            return {         
                start: t.format(format),
                end: t.endOf('year').format(format),
            }
        }
    },
    {
        label: 'Last 365 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(182.5, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minute').startOf('day');
            return {         
                end: t.format(format),
                unit: 'd',
                duration: 365,
            }
        }
    }
]
