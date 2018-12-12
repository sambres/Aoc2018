const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

const format = input =>
  input.split('\n').map((c, i) => {
    return {
      id: i + 1,
      y: parseInt(c.match(/(\d+)/g)[0], 10),
      x: parseInt(c.match(/(\d+)/g)[1], 10)
    };
  });

const findMax = coors =>
  coors.reduce(
    (aggr, curr) => ({
      x: aggr.x > curr.x ? aggr.x : curr.x,
      y: aggr.y > curr.y ? aggr.y : curr.y
    }),
    { x: 0, y: 0 }
  );

const computeDist = (p1, p2) => Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);

const printArray = arr => {
  console.log('  0 1 2 3 4 5 6 7 8 ');
  for (let i = 0; i < arr.length; i++) {
    let str = i + ' ';

    for (let j = 0; j < arr[i].length; j++) {
      if (!arr[i][j].id) str += '.';
      else if (arr[i][j].dist === 0) str += 'a';
      else str += arr[i][j].id;
      str += ' ';
    }
    console.log(str);
  }
  return arr;
};

const min = arr => arr.reduce((m, curr) => (m < curr ? m : curr));
const max = arr => arr.reduce((m, curr) => (m > curr ? m : curr));

const minBy = (arr, key) =>
  arr.reduce((min, curr) => (min[key] < curr[key] ? min : curr));

const findOwner = (point, coors) => {
  const dists = coors.map(p => ({ ...p, dist: computeDist(point, p) }));
  // console.log('dists', dists, point.x, point.y, coors.x, coors.y);
  const min = minBy(dists, 'dist');
  const secondMin = dists.find(d => d.dist === min.dist && d.id !== min.id);
  return secondMin ? { id: 0 } : min;
};

const isSafe = (point, coors) => {
  let totalDist = 0;
  for (const coor of coors) {
    totalDist += computeDist(point, coor);
    if (totalDist >= 10000) return false;
  }
  return true;
};

const compute = input => {
  const max = findMax(input);
  const grid = [];
  const locations = [];
  for (let i = 0; i < max.x + 1; i++) {
    grid.push([]);
    for (let j = 0; j < max.y + 1; j++) {
      if (isSafe({ x: i, y: j }, input)) {
        locations.push({ x: i, y: j });
      }
    }
  }

  return locations;
};

runner.run('6', format, compute, locations => locations.length);
