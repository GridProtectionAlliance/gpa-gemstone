//******************************************************************************************************
//  QuickSelects.tsx - Gbtc
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

import { ITimeFilter } from './TimeFilter';
import moment from 'moment';
import momentTZ from 'moment-timezone';

export type DateUnit = ('datetime-local' | 'date' | 'time');

interface IQuickSelect {
    label: string,
    hideQuickPick: (format?: DateUnit) => boolean,
    createFilter: (timeZone: string, format?: DateUnit) => ITimeFilter
}

export function getFormat(format?: DateUnit) {
    if (format == 'date')
        return 'YYYY-MM-DD'
    else if (format == "time")
        return 'HH:mm:ss.SSS'
    else
        return 'MM/DD/YYYY HH:mm:ss.SSS'
}

//update all quick selects to use new timefilters
export const AvailableQuickSelects: IQuickSelect[] = [
    {
        label: 'This Hour', createFilter: (tz, format) => {

            const offset = momentTZ.tz(moment.utc().startOf('hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            return {
                start: t.format(getFormat(format)),
                end: t.add(60, 'm').format(getFormat(format)),
            }
        },
        hideQuickPick: (f) => {
            return f == 'date'
        }
    },
    {
        label: 'Last Hour', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 60,
            }
        },
        hideQuickPick: (f) => {
            return f == 'date'
        }
    },
    {
        label: 'Last 60 Minutes', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute');

            return {
                end: t.format(getFormat(format)),
                unit: 'm',
                duration: 60,
            }
        },
        hideQuickPick: (f) => {
            return f == 'date'
        }
    },
    {
        label: 'Today', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                start: t.format(getFormat(format)),
                unit: 'h',
                duration: 24,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Yesterday', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'h',
                duration: 24,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last 24 Hours', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes');
            return {
                end: t.format(getFormat(format)),
                unit: 'h',
                duration: 24,
            }
        },
        hideQuickPick: (f) => {
            return f == 'date' || f == 'time'
        }
    },
    {
        label: 'This Week', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: 7
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last Week', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 7
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last 7 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 7
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'This Month', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month');
            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: t.daysInMonth()
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last Month', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month').subtract(1, 'month');
            return {
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: t.daysInMonth()
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last 30 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 30,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
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
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: h,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
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
                start: t.format(getFormat(format)),
                unit: 'd',
                duration: h,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last 90 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(45, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 90,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'This Year', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('year');
            return {
                start: t.format(getFormat(format)),
                unit: 'M',
                duration: 12
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last Year', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('year');
            return {
                end: t.format(getFormat(format)),
                unit: 'M',
                duration: 12
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    },
    {
        label: 'Last 365 Days', createFilter: (tz, format) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(182.5, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minute').startOf('day');
            return {
                end: t.format(getFormat(format)),
                unit: 'd',
                duration: 365,
            }
        },
        hideQuickPick: (f) => {
            return f == 'time'
        }
    }
]
