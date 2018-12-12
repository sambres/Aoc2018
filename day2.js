const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

// readFile(1).then(res => console.log(res));

const format = input => input.split('\n');

const countLetter = (word, letter) =>
  word.split('').filter(c => c === letter).length;

const letterCount = word =>
  Object.values(
    word.split('').reduce((aggr, current) => {
      const count = countLetter(word, current);
      if (!aggr[count]) aggr[count] = count;
      return aggr;
    }, {})
  );

const compute = input => {
  const letterCounts = input.map(letterCount);
  const twos = letterCounts.filter(c => c.indexOf(2) !== -1);
  const threes = letterCounts.filter(c => c.indexOf(3) !== -1);

  return twos.length * threes.length;
};

runner.run(2, format, compute);
