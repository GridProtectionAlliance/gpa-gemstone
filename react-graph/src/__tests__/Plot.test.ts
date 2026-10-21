import { PointNode } from '../PointNode';

test('Node Min-Max', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1, 3);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});


test('Node Min-Max w Limits 1', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1, 2.5);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});


test('Node Data', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const dat = node.GetFullData();
  expect(dat.length).toBe(4);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[3][0]).toBe(3);
  expect(dat[3][1]).toBe(3);
});

test('Node Data w limits 1', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const dat = node.GetData(-1, 4);
  expect(dat.length).toBe(4);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[3][0]).toBe(3);
  expect(dat[3][1]).toBe(3);
});


test('Node Data w limits 2', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const dat = node.GetData(-1, 2.5);
  expect(dat.length).toBe(3);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[2][0]).toBe(2);
  expect(dat[2][1]).toBe(1);
});

test('Node Get Point', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(2);
  expect(dat[0]).toBe(2);
  expect(dat[1]).toBe(1);
});

test('Node Get Point 2', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(2.4);
  expect(dat[0]).toBe(2);
  expect(dat[1]).toBe(1);
});

test('Node Get Point 3', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(4);
  expect(dat[0]).toBe(3);
  expect(dat[1]).toBe(3);
});


test('Node Data for 45 Pts', () => {
  const d: [number, number][] = [... new Array(45)].map((_, i) => [i, 2 * i] as [number, number]);
  const node = new PointNode(d);
  const dat = node.GetFullData();
  expect(dat.length).toBe(45);
  expect(dat[1][1]).toBe(2 * 1);
  expect(dat[19][1]).toBe(2 * 19);
  expect(dat[20][1]).toBe(2 * 20);
  expect(dat[21][1]).toBe(2 * 21);
  expect(dat[44][1]).toBe(2 * 44);
});

test('Node Limits for 40 Pts', () => {
  const d: [number, number][] = [... new Array(45)].map((_, i) => [i, 1.5 * i] as [number, number]);
  const node = new PointNode(d);
  const dat = node.GetLimits(-1, 23);

  expect(dat[0]).toBe(0);
  expect(dat[1]).toBe(1.5 * 22);
});

test('Node Get Point for 40 Pts', () => {
  const d: [number, number][] = [... new Array(45)].map((_, i) => [i, 1.5 * i] as [number, number]);
  const node = new PointNode(d);
  const dat = node.GetPoint(32.8);
  expect(dat[0]).toBe(33);
  expect(dat[1]).toBe(33 * 1.5);
});

test('Fundamental Tree size', () => {
  const d: [number, number][] = [... new Array(20)].map((_, i) => [i, 1.5 * i] as [number, number]);
  const node = new PointNode(d);
  const n = node.GetTreeSize();
  expect(n).toBe(1);
});

test('Low number of points Tree size', () => {
  const d: [number, number][] = [... new Array(45)].map((_, i) => [i, 1.5 * i] as [number, number]);
  const node = new PointNode(d);
  const n = node.GetTreeSize();
  expect(n).toBe(2);
});

test('Large number of points Tree size', () => {
  const d: [number, number][] = [... new Array(9000)].map((_, i) => [i, 1.5 * i] as [number, number]);
  const node = new PointNode(d);
  const n = node.GetTreeSize();
  expect(n).toBe(4);
});

test('Limits for given Timeframe', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const lim = node.GetLimits(0.5, 2.5);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});

test('Limits for entire Timeframe', () => {
  const d: [number, number][] = [[0, 1], [1, 2], [2, 1], [3, 3]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1, 4);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(3);
});

test('Sum of all points', () => {
  const d: [number, number][] = [... new Array(9000)].map((_, i) => [i, 1.5 * i] as [number, number]);
  const node = new PointNode(d);
  const s = node.sum;
  expect(s[0]).toBe(d.reduce((a, b) => a + b[1], 0));
});

test('Count of all points', () => {
  const d = [... new Array(9000)].map((_, i) => [i, i]);
  const node = new PointNode(d);
  const c = node.count;
  expect(c).toBe(9000);
});

test('Initialize with desiredTreeSize = 5', () => {
  const data = [1,1];
  const node = PointNode.createNodeWithDesiredTreeSize(data, 5);

  expect(node.GetTreeSize()).toBe(5);
  expect(node.count).toBe(1);
});

test('Add Point', () => {
  const data = [... new Array(19)].map((_, i) => [i, i]);
  const node = new PointNode(data);
  node.AddPoint([19,19])

  expect(node.GetTreeSize()).toBe(1);
  expect(node.count).toBe(20);

  expect(node.minT).toBe(0);
  expect(node.maxT).toBe(19);
  expect(node.minV[0]).toBe(0);
  expect(node.maxV[0]).toBe(19);

  const expectedSum = data.reduce((acc, point) => acc + point[1], 0) + 19;
  expect(node.sum[0]).toBe(expectedSum);
})

test('Add Point to large node', () => {
  const data = [... new Array(398)].map((_, i) => [i, i]);  const node = new PointNode(data);
  node.AddPoint([398,398])

  expect(node.GetTreeSize()).toBe(2);
  expect(node.count).toBe(399);

  expect(node.minT).toBe(0);
  expect(node.maxT).toBe(398);
  expect(node.minV[0]).toBe(0);
  expect(node.maxV[0]).toBe(398);

  const expectedSum = data.reduce((acc, point) => acc + point[1], 0) + 398;
  expect(node.sum[0]).toBe(expectedSum);
})

test('Add Point to full node', () => {
  const data = [... new Array(20)].map((_, i) => [i, i]);
  const node = new PointNode(data);
  node.AddPoint([20,20])

  expect(node.GetTreeSize()).toBe(2);
  expect(node.count).toBe(21);

  expect(node.minT).toBe(0);
  expect(node.maxT).toBe(20);
  expect(node.minV[0]).toBe(0);
  expect(node.maxV[0]).toBe(20);

  const expectedSum = data.reduce((acc, point) => acc + point[1], 0) + 20;
  expect(node.sum[0]).toBe(expectedSum);
})

test('Add point with incorrect dimensionality throws TypeError', () => {
  const data = [... new Array(10)].map((_, i) => [i, i]);
  const node = new PointNode(data);

  // Attempt to add a point with different dimensions
  const invalidPoint = [10];
  expect(() => node.AddPoint(invalidPoint as any)).toThrow(TypeError);
});

test('Add empty point array throws Error', () => {
  const data = [... new Array(10)].map((_, i) => [i, i]);
  const node = new PointNode(data);

  expect(() => node.AddPoint([])).toThrow(Error);
});

test('Fundamental GetCount', () => {
  const data = [... new Array(10)].map((_, i) => [i, i]);
  const node = new PointNode(data);
  const expectedCount = 3;
  const count = node.GetCount(1, 3);
  expect(count).toBe(expectedCount);
})

test('Large number of points GetCount', () => {
  const data = [... new Array(10000)].map((_, i) => [i, i]);
  const node = new PointNode(data);
  const expectedCount = 5001;
  const count = node.GetCount(2500, 7500);
  expect(count).toBe(expectedCount);
})

test('Count with empty data', () => {
  const node = new PointNode([]);
  const count = node.GetCount(0,1);
  expect(count).toBe(0)
})

test('GetLimits with empty data', () => {
  const node = new PointNode([]);
  const limits = node.GetLimits(0, 1000000);
  expect(limits[0]).toBeNaN();
  expect(limits[1]).toBeNaN();
})

test('GetPoint with empty data', () => {
  const node = new PointNode([]);
  const [x] = node.GetPoint(0);
  expect(x).toBeNaN();
})

test('GetPoints with empty data', () => {
  const node = new PointNode([]);
  const [x] = node.GetPoints(0, 2);
  expect(x.toString()).toBe([NaN].toString());
})

test('GetFullData with empty data', () => {
  const node = new PointNode([]);
  const points = node.GetFullData();
  expect(points.toString()).toBe([].toString());
})

test('GetData with empty data', () => {
  const node = new PointNode([]);
  const points = node.GetData(0 ,10);
  expect(points.toString()).toBe([].toString());
})

test('RemoveLeftMostPoint when data length is less than default', () => {
  // Using 1500 points, which is less than DefaultMaxTotalPoints (2000)
  const data: [number, number][] = Array.from({ length: 1500 }, (_, i) => [i, i]);
  const node = new PointNode(data);
  expect(node.maxCount).toBe(2000);
});

test('RemoveLeftMostPoint when data length is greater than default', () => {
  // Using 2500 points, which is greater than DefaultMaxTotalPoints (2000)
  const data: [number, number][] = Array.from({ length: 2500 }, (_, i) => [i, i]);
  const node = new PointNode(data);
  expect(node.maxCount).toBe(2500);
});

// Deterministic pseudo-random generator (mulberry32) so failures are reproducible
const createRandom = (seed: number) => () => {
  seed |= 0;
  seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const inRange = (point: number[], start: number, end: number) => point[0] >= start && point[0] <= end;

const valueLimits = (points: number[][], dimension = 0): [number, number] => {
  const values = points.map(point => point[dimension + 1]).filter(value => !Number.isNaN(value));
  return values.length === 0 ? [NaN, NaN] : [Math.min(...values), Math.max(...values)];
};

const createPoints = (count: number, random: () => number, startTime = 0) =>
  Array.from({ length: count }, (_, i) => [startTime + i, Math.round(random() * 2000 - 1000)]);

// Compares every query against a plain array holding the same points
const expectMatchesReference = (node: PointNode, reference: number[][], random: () => number) => {
  expect(node.count).toBe(reference.length);
  expect(node.minT).toBe(reference[0][0]);
  expect(node.maxT).toBe(reference[reference.length - 1][0]);
  expect(node.GetFullData()).toEqual(reference);

  const minT = reference[0][0];
  const span = reference[reference.length - 1][0] - minT;

  for (let i = 0; i < 25; i++) {
    // Range ends fall half way between points, so inclusive and exclusive boundaries agree
    const a = Math.floor(minT - 5 + random() * (span + 10)) + 0.5;
    const b = Math.floor(minT - 5 + random() * (span + 10)) + 0.5;
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    const expected = reference.filter(point => inRange(point, start, end));

    expect(node.GetData(start, end)).toEqual(expected);
    expect(node.GetCount(start, end)).toBe(expected.length);

    if (expected.length > 0)
      expect(node.GetLimits(start, end)).toEqual(valueLimits(expected));
  }
};

describe('PointNode streaming', () => {
  test.each([50, 2000, 10000])('keeps last %i points and matches a reference array', maxTotalPoints => {
    const random = createRandom(maxTotalPoints);
    const node = new PointNode([], maxTotalPoints);
    let reference: number[][] = [];
    const total = maxTotalPoints * 3 + 37;

    for (let i = 0; i < total; i++) {
      const point = [i, Math.round(random() * 2000 - 1000)];
      node.AddPoint(point);
      reference.push(point);

      if (reference.length > maxTotalPoints)
        reference = reference.slice(-maxTotalPoints);

      if (i % Math.ceil(total / 12) === 0 || i === total - 1)
        expectMatchesReference(node, reference, random);
    }
  });

  test('limits only reflect points that remain after trimming', () => {
    const maxTotalPoints = 500;
    const node = new PointNode([], maxTotalPoints);

    // Large values first, which must be trimmed away, then small values
    for (let i = 0; i < maxTotalPoints; i++)
      node.AddPoint([i, 1000 + i]);

    for (let i = maxTotalPoints; i < maxTotalPoints * 3; i++)
      node.AddPoint([i, i % 10]);

    expect(node.GetLimits(node.minT - 1, node.maxT + 1)).toEqual([0, 9]);
    expect(node.GetAllLimits(node.minT - 1, node.maxT + 1)).toEqual([[0, 9]]);
  });
});

describe('PointNode construction', () => {
  test.each([1, 20, 21, 400, 401, 1999])('building from %i points matches adding them one at a time', size => {
    const random = createRandom(size);
    const points = createPoints(size, random);
    const built = new PointNode(points, 100000);
    const added = new PointNode([], 100000);

    points.forEach(point => added.AddPoint(point));

    for (const node of [built, added]) {
      expect(node.count).toBe(size);
      expect(node.GetFullData()).toEqual(points);
      expect(node.GetLimits(-0.5, size)).toEqual(valueLimits(points));
    }
  });

  test('rejects jagged data', () => {
    expect(() => new PointNode([[0, 1], [1]])).toThrow(TypeError);

    const node = new PointNode([[0, 1]]);
    expect(() => node.AddPoint([1, 2, 3])).toThrow(TypeError);
    expect(() => node.AddPoint([])).toThrow(Error);
  });
});

describe('PointNode point lookup', () => {
  // Multiple leaves (20 points each) so lookups cross node boundaries
  const points = createPoints(500, createRandom(7));
  const node = new PointNode(points, 1000);

  test('GetPoint returns the nearest point', () => {
    for (let i = 0; i < points.length - 1; i++) {
      expect(node.GetPoint(i)).toEqual(points[i]);
      expect(node.GetPoint(i + 0.25)).toEqual(points[i]);
      expect(node.GetPoint(i + 0.75)).toEqual(points[i + 1]);
    }
  });

  test('GetPoint clamps to the first and last points', () => {
    expect(node.GetPoint(-100)).toEqual(points[0]);
    expect(node.GetPoint(10000)).toEqual(points[points.length - 1]);
  });

  test('GetPoints rejects a non-positive count', () => {
    expect(() => node.GetPoints(10, 0)).toThrow(RangeError);
  });
});

describe('PointNode values', () => {
  test('ignores NaN values in limits and sums', () => {
    const points = Array.from({ length: 100 }, (_, i) => [i, i % 7 === 0 ? NaN : i]);
    const built = new PointNode(points, 1000);
    const added = new PointNode([], 1000);
    const expectedSum = points.reduce((sum, point) => Number.isNaN(point[1]) ? sum : sum + point[1], 0);

    points.forEach(point => added.AddPoint(point));

    for (const node of [built, added]) {
      expect(node.GetLimits(-1, 100)).toEqual([1, 99]);
      expect(node.sum[0]).toBe(expectedSum);
    }
  });

  test('tracks limits per dimension for multi-dimensional points', () => {
    const points = Array.from({ length: 300 }, (_, i) => [i, i, -2 * i]);
    const node = new PointNode(points, 1000);

    expect(node.GetLimits(9.5, 50.5, 0)).toEqual([10, 50]);
    expect(node.GetLimits(9.5, 50.5, 1)).toEqual([-100, -20]);
    expect(node.GetAllLimits(9.5, 50.5)).toEqual([[10, 50], [-100, -20]]);
  });
});