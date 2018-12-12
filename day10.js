const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

const format = input =>
  input.split('\n').map((c, i) => {
    let match = c.match(
      /position=<(-?\d+),  (-?\d+)> velocity=< (-?\d+),  (-?\d+)>/
    );
    return {
      id: i + 1,
      y: parseInt(c.match(/(\d+)/g)[0], 10),
      x: parseInt(c.match(/(\d+)/g)[1], 10)
    };
  });

const compute = input => {
  return input;
};

runner.run('6', format, compute, printArray, calculateAreas, areas =>
  max(Object.values(areas))
);
