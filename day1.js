const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

// readFile(1).then(res => console.log(res));

const format = input =>
  input.split('\n').map(c => (c[0] === '+' ? 1 : -1) * parseInt(c.slice(1)));

const compute = input => {
  return input.reduce((t, c) => t + c, 0);
};

runner.run(1, format, compute);
