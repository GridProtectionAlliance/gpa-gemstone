import { ComputeMin } from '../ComputeMin';

test('Compute Min with Empty Array', () => {
    expect(ComputeMin([])).toBeNaN();
});

test('Compute Min with NaN Values', () => {
    expect(ComputeMin([NaN, NaN, NaN])).toBeNaN();
});

test('Compute Min with mixed numerics and NaNs', () => {
    expect(ComputeMin([1, 2, NaN, 3, NaN])).toBe(1);
});

test('Compute Min with mixed numerics and Infinities', () => {
    expect(ComputeMin([1, 2, -Infinity, 3, NaN])).toBe(-Infinity);
});

test("Compute Min with string 'NaN' and numerics", () => {
    expect(ComputeMin([1, 2, ('NaN' as any), 3, NaN])).toBe(1);
});