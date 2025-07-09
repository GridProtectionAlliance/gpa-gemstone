import { ComputeMax } from '../ComputeMax';

test('Compute Max with Empty Array', () => {
    expect(ComputeMax([])).toBeNaN();
});

test('Compute Max with NaN Values', () => {
    expect(ComputeMax([NaN, NaN, NaN])).toBeNaN();
});

test('Compute Max with mixed numerics and NaNs', () => {
    expect(ComputeMax([1, 2, NaN, 3, NaN])).toBe(3);
});

test('Compute Max with mixed numerics and Infinities', () => {
    expect(ComputeMax([1, 2, Infinity, 3, NaN])).toBe(Infinity);
})

test("Compute Max with string 'NaN' and numerics", () => {
    expect(ComputeMax([1, 2, ('NaN' as any), 3, NaN])).toBe(3);
})