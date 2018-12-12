const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

// readFile(1).then(res => console.log(res));

const format = input => input.split('\n');

const is1diff = (str1, str2) => {
  const arr1 = str1.split('');
  const arr2 = str2.split('');
  let count = 0;
  let diff;
  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] !== arr2[index]) {
      count++;
      diff = index;
    }
    if (count > 1) return false;
  }
  if (count === 1) return diff;
};

const compute = input => {
  for (let i = 0; i < input.length; i++) {
    const word1 = input[i];

    for (let j = 0; j < input.length && j !== i; j++) {
      const word2 = input[j];
      const oneDiff = is1diff(word1, word2);
      if (oneDiff) {
        // return [word2, word1];
        return word2.slice(0, oneDiff) + word2.slice(oneDiff + 1);
      }
    }
  }

  return input;
};

runner.run(2, format, compute);
