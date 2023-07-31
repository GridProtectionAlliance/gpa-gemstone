import {PointNode} from '../PointNode';


test('Node Min-Max', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1,3);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});

test('Node Min-Max w Limits 1', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1,2.5);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});

test('Node Data', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat =node.GetFullData();
  expect(dat.length).toBe(4);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[3][0]).toBe(3);
  expect(dat[3][1]).toBe(3);
});

test('Node Data w limits 1', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat =node.GetData(-1,4);
  expect(dat.length).toBe(4);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[3][0]).toBe(3);
  expect(dat[3][1]).toBe(3);
});

test('Node Data w limits 2', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat =node.GetData(-1,2.5);
  expect(dat.length).toBe(3);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[2][0]).toBe(2);
  expect(dat[2][1]).toBe(1);
});

test('Node Get Point', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(2);
  expect(dat[0]).toBe(2);
  expect(dat[1]).toBe(1);
});

test('Node Get Point 2', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(2.4);
  expect(dat[0]).toBe(2);
  expect(dat[1]).toBe(1);
});


test('Node Get Point 3', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(4);
  expect(dat[0]).toBe(3);
  expect(dat[1]).toBe(3);
});



test('Node Data for 40 Pts', () => {
  const d: [number,number][] = [... new Array(45)].map((_,i) => [i,2*i] as [number,number]);
  const node = new PointNode(d);
  const dat = node.GetFullData();
  expect(dat.length).toBe(45);
  expect(dat[1][1]).toBe(2*1);
  expect(dat[19][1]).toBe(2*19);
  expect(dat[20][1]).toBe(2*20);
  expect(dat[21][1]).toBe(2*21);
  expect(dat[44][1]).toBe(2*44);
});

test('Node Limits for 40 Pts', () => {
  const d: [number,number][] = [... new Array(45)].map((_,i) => [i,1.5*i] as [number,number]);
  const node = new PointNode(d);
  const dat = node.GetLimits(-1,23);

  expect(dat[0]).toBe(0);
  expect(dat[1]).toBe(1.5*22);
});

test('Node Get Point for 40 Pts', () => {
  const d: [number,number][] = [... new Array(45)].map((_,i) => [i,1.5*i] as [number,number]);
  const node = new PointNode(d);
  const dat = node.GetPoint(32.8);
  expect(dat[0]).toBe(33);
  expect(dat[1]).toBe(33*1.5);
});
