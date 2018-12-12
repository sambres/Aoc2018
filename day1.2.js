const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

// readFile(1).then(res => console.log(res));

const format = input =>
  input.split('\n').map(c => (c[0] === '+' ? 1 : -1) * parseInt(c.slice(1)));

const compute = input => {
  const freqs = {};
  let total = 0;
  while (true) {
    for (const item of input) {
      if (freqs[total]) {
        return total;
      }
      freqs[total] = true;
      total += item;
    }
  }
  return 'prout';
};

runner.run(1, format, compute);
