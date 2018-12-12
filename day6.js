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

const markAdjacent = (grid, point, x, y, prevMove, cpt) => {
  console.log(
    'point.id:',
    point.id,
    point.x,
    point.y,
    'curr',
    x,
    y,
    'cpt:',
    cpt++
  );
  if (x < 0 || x >= grid.length || (y < 0 || y >= grid[0].length)) return;
  const curr = grid[x][y];
  const dist = computeDist({ x, y }, point);

  if (curr.id !== 0 && curr.id !== point.id && curr.dist === 0) return;
  // if (curr.id === point.id && dist !== 0) return;
  console.log('dist :', dist, 'curr.dist :', curr.dist, 'curr.id :', curr.id);

  if (curr.id === point.id) {
    if (dist >= curr.dist && dist !== 0) return;
    else {
      grid[x][y] = {
        ...point,
        dist
      };
    }
  } else if (
    (curr.dist === 0 && (!curr.previousDist || dist < curr.previousDist)) ||
    dist < curr.dist
  ) {
    grid[x][y] = {
      ...point,
      dist
    };
  } else if (dist === curr.dist) {
    grid[x][y] = { id: 0, dist: 0, previousDist: dist };
  } else return;
  if (prevMove !== 'U') markAdjacent(grid, point, x + 1, y, 'D', cpt); // if (prevMove !== 'D')
  if (prevMove !== 'D') markAdjacent(grid, point, x - 1, y, 'U', cpt); // if (prevMove !== 'U')
  if (prevMove !== 'L') markAdjacent(grid, point, x, y + 1, 'R', cpt); // if (prevMove !== 'R')
  if (prevMove !== 'R') markAdjacent(grid, point, x, y - 1, 'L', cpt); // if (prevMove !== 'L')
};

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

const compute = input => {
  const max = findMax(input);
  const grid = [];

  for (let i = 0; i < max.x + 1; i++) {
    grid.push([]);
    for (let j = 0; j < max.y + 1; j++) {
      grid[i].push(findOwner({ x: i, y: j }, input));
    }
  }
  return grid;
};

const calculateAreas = grid => {
  const areas = {};
  const forbiddenAreas = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let curr = grid[i][j];
      if (!curr.id) continue;
      if (
        i === 0 ||
        j === 0 ||
        i === grid.length - 1 ||
        j === grid[i].length - 1
      ) {
        forbiddenAreas[curr.id] = true;
        continue;
      }
      areas[curr.id] = (areas[curr.id] || 0) + 1;
    }
  }

  for (const key in forbiddenAreas) {
    delete areas[key];
  }

  return areas;
};

runner.run('6', format, compute, printArray, calculateAreas, areas =>
  max(Object.values(areas))
);
