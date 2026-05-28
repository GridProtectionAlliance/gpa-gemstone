import { ConvertTicksToMoment } from '../index';

test('638712864000000000', () => {
    const d = 638712864000000000;
    expect(ConvertTicksToMoment(d)).toMatch(1735689600000);
});
test('0 Ticks', () => {
    expect(ConvertTicksToMoment(0)).toMatch(-62167219200000);
});
test('Unix Timestamp in Ticks', () => {
    const d = 621355968000000000;
    expect(ConvertTicksToMoment(d)).toMatch(0);
});