import { formatTick } from '../TimeAxis';

const timestamp = Date.UTC(2024, 0, 15, 18, 30);

test('formats ticks as UTC when no time zone is provided', () => {
  expect(formatTick(timestamp, 'YYYY-MM-DD HH:mm')).toBe('2024-01-15 18:30');
});

test('formats ticks in the provided time zone', () => {
  expect(formatTick(timestamp, 'YYYY-MM-DD HH:mm', 'America/Chicago')).toBe('2024-01-15 12:30');
});
