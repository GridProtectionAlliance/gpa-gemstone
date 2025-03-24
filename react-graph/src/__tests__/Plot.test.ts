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
  expect(limits[0]).toBe(Infinity);
  expect(limits[1]).toBe(-Infinity);
})

test('GetPoint with empty data', () => {
  const node = new PointNode([]);
  const [x] = node.GetPoint(0);
  expect(x).toBe(NaN);
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

test('RemoveLeftMostPoint fundamental test', () => {
  const data: [number, number][] = Array.from({length: 2000}, (_, i) => [i, i]);
  const node = new PointNode(data);
  expect(node.count).toBe(2000);
  
  node.AddPoint([2000, 2000]);
  
  expect(node.count).toEqual(2000);

});

test('TrimToMaxCount fundamental test', () => {
  const data: [number, number][] = Array.from({length: 5000}, (_, i) => [i, i]);
  const node = new PointNode(data);
  expect(node.count).toBe(5000);
  
  node.AddPoint([5000, 5000]);
  
  expect(node.count).toEqual(2000);

});