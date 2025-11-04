import { FormatDuration } from '../index';


const secondsPerMinute = 60;
const secondsPerHour = secondsPerMinute * 60;
const secondsPerDay = secondsPerHour * 24;
const secondsPerYear = 365.2425 * secondsPerDay;

test('10y 5d', () => {
    const d = 10*secondsPerYear + 5* secondsPerDay;
    expect(FormatDuration(d*1000)).toMatch('10 years 5 days');
});
test('1y', () => {
    const d = 1*secondsPerYear;
    expect(FormatDuration(d*1000)).toMatch('1 year');
})
test('1y 5d 1h 1m 1s', () => {
    const d = 1*secondsPerYear + 5 * secondsPerDay + 1 * secondsPerHour + 1* secondsPerMinute + 1;
    expect(FormatDuration(d*1000)).toMatch('1 year 5 days');
})
test('5d 1h 1m 1s', () => {
    const d = 5 * secondsPerDay + 1 * secondsPerHour + 1* secondsPerMinute + 1;
    expect(FormatDuration(d*1000)).toMatch('5 days 1 hour 1 minute');
})
test('51d 1h 1m 1s', () => {
    const d = 51 * secondsPerDay + 1 * secondsPerHour + 1* secondsPerMinute + 1;
    expect(FormatDuration(d*1000)).toMatch('51 days 1 hour');
})
test('1h 1m 1s 1ms', () => {
    const d = 1 * secondsPerHour + 1* secondsPerMinute + 1;
    expect(FormatDuration(d*1000 + 1)).toMatch('1 hour 1 minute 1 second');
})
test('1m 1s 1ms', () => {
    const d = 1* secondsPerMinute + 1;
    expect(FormatDuration(d*1000 + 1)).toMatch('1 minute 1 second 1 millisecond');
})