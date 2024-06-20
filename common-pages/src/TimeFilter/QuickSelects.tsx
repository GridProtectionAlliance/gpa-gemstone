import { getStartEndTime, ITimeFilter } from '../TimeWindowUtils';
import moment from 'moment';
import momentTZ from 'moment-timezone';


interface IQuickSelect { label: string, createFilter: (timeZone: string) => ITimeFilter }


//update all quick selects to use new timefilters
export const AvailableQuickSelects: IQuickSelect[] = [
    {
        label: 'This Hour', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour');
            t.add(30, 'minutes');
            const [start, end] =  getStartEndTime(t, 30, 'm');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 2,
                windowSize: 60,
                halfWindowSize: 30,
            }
        }
    },
    {
        label: 'Last Hour', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('hour').subtract(1, 'hour');
            t.add(30, 'minutes')
            const [start, end] =  getStartEndTime(t, 30, 'm');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 2,
                windowSize: 60,
                halfWindowSize: 30,
            }
        }
    },
    {
        label: 'Last 60 Minutes', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('minute').subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('minute').subtract(1, 'hour');
            t.add(30, 'minutes');
            const [start, end] =  getStartEndTime(t, 30, 'm');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 2,
                windowSize: 60,
                halfWindowSize: 30,
            }
        }
    },
    {
        label: 'Today', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            t.add(12, 'hours');
            const [start, end] =  getStartEndTime(t, 12, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: 24,
                halfWindowSize: 12,
            }
        }
    },
    {
        label: 'Yesterday', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day').subtract(1, 'days');
            t.add(12, 'hours');
            const [start, end] =  getStartEndTime(t, 12, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: 24,
                halfWindowSize: 12,
            }
        }
    },
    {
        label: 'Last 24 Hours', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('hour').subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').subtract(24, 'hours');
            t.add(12, 'hours');
            const [start, end] =  getStartEndTime(t, 12, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: 24,
                halfWindowSize: 12,
            }
        }
    },
    {
        label: 'This Week', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            t.add(3.5 * 24, 'hours');
            const [start, end] =  getStartEndTime(t, 3.5 * 24, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: 7 * 24,
                halfWindowSize: 3.5 * 24,
            }
        }
    },
    {
        label: 'Last Week', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('week').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('week');
            t.subtract(3.5 * 24, 'hours');
            const [start, end] =  getStartEndTime(t, 3.5 * 24, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: 7 * 24,
                halfWindowSize: 3.5 * 24,
            }
        }
    },
    {
        label: 'Last 7 Days', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            t.subtract(3.5 * 24, 'hours');
            const [start, end] =  getStartEndTime(t, 3.5 * 24, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: 7 * 24,
                halfWindowSize: 3.5 * 24,
            }
        }
    },
    {
        label: 'This Month', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month');
            t.add(12 * t.daysInMonth(), 'hours');
            const window = (t.daysInMonth() * 24);

            const [start, end] =  getStartEndTime(t, window / 2.0, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: window,
                halfWindowSize: window / 2.0,
            }
        }
    },
    {
        label: 'Last Month', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('month').subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('month').subtract(1, 'month');
            t.add(12 * t.daysInMonth(), 'hours');
            const window = (t.daysInMonth() * 24);

            const [start, end] =  getStartEndTime(t, window / 2.0, 'h');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 3,
                windowSize: window,
                halfWindowSize: window / 2.0,
            }
        }
    },
    {
        label: 'Last 30 Days', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            t.subtract(15, 'days');
            const [start, end] =  getStartEndTime(t, 15, 'd');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 4,
                windowSize: 30,
                halfWindowSize: 15,
            }
        }
    },
    {
        label: 'This Quarter', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('quarter').add(1, 'quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const offset_tend = momentTZ.tz(moment.utc().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('quarter');
            const tend = moment.utc().add(offset_tend, 'minutes').startOf('quarter');
            tend.add(1, 'quarter')
            const h = moment.duration(tend.diff(t)).asDays();
            t.add(h * 0.5, 'day');
            const [start, end] =  getStartEndTime(t, h * 0.5, 'd');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 4,
                windowSize: h,
                halfWindowSize: h * 0.5,
            }
        }
    },
    {
        label: 'Last Quarter', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('quarter').subtract(1, 'quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const offset_tend = momentTZ.tz(moment.utc().startOf('quarter').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('quarter');
            const tend = moment.utc().add(offset_tend, 'minutes').startOf('quarter');
            t.subtract(1, 'quarter');
            const h = moment.duration(tend.diff(t)).asDays();
            t.add(h * 0.5, 'day');
            const [start, end] =  getStartEndTime(t, h * 0.5, 'd');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 4,
                windowSize: h,
                halfWindowSize: h * 0.5,
            }
        }
    },
    {
        label: 'Last 90 Days', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(45, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('day');
            t.subtract(45, 'days');
            const [start, end] =  getStartEndTime(t, 45, 'd');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 4,
                windowSize: 90,
                halfWindowSize: 45,
            }
        }
    },
    {
        label: 'This Year', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').add(6, 'month').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minutes').startOf('year');
            t.add(0.5, 'year');
            const [start, end] =  getStartEndTime(t, 6, 'M');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 6,
                windowSize: 12,
                halfWindowSize: 6,
            }
        }
    },
    {
        label: 'Last Year', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('year').subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minute').startOf('year').subtract(0.5, 'year');
            
            const [start, end] =  getStartEndTime(t, 6, 'M');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.add(1, 'day').format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 6,
                windowSize: 12,
                halfWindowSize: 6,
            }
        }
    },
    {
        label: 'Last 365 Days', createFilter: (tz) => {
            const offset = momentTZ.tz(moment.utc().startOf('day').subtract(182.5, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSSS'), tz).utcOffset();
            const t = moment.utc().add(offset, 'minute').startOf('day');
            t.subtract(182.5, 'days');
            const [start, end] =  getStartEndTime(t, 182.5, 'd');
            return {         
                centerTime: t.format('MM/DD/YYYY HH:mm:ss.SSS'),
                startTime: start.format('MM/DD/YYYY HH:mm:ss.SSS'),
                endTime: end.format('MM/DD/YYYY HH:mm:ss.SSS'),
                timeWindowUnits: 4,
                windowSize: 365,
                halfWindowSize: 182.5,
            }
        }
    }
]