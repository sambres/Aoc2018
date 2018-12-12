const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

// readFile(1).then(res => console.log(res));

const format = input =>
  input.split('\n').map(l => {
    let match = l.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
    return {
      id: parseInt(match[1]),
      left: parseInt(match[2]),
      top: parseInt(match[3]),
      width: parseInt(match[4]),
      height: parseInt(match[5]),

      right: parseInt(match[2]) + parseInt(match[4]),
      bottom: parseInt(match[3]) + parseInt(match[5])
    };
  });

const computeOverlap = (claim1, claim2) => {
  if (
    claim1.left < claim2.left + claim2.width &&
    claim2.left < claim1.left + claim1.width &&
    claim1.top < claim2.top + claim2.height &&
    claim2.top < claim1.height + claim1.top
  ) {
    // if (
    //   claim1.left < claim2.left + claim2.width &&
    //   claim1.left + claim1.width > claim2.left &&
    //   claim1.top < claim2.top + claim2.height &&
    //   claim1.height + claim1.top > claim2.top
    // ) {
    let leftbound = claim1.left < claim2.left ? claim2.left : claim1.left;
    let rightbound =
      claim1.left + claim1.width < claim2.left + claim2.width
        ? claim1.left + claim1.width
        : claim2.left + claim2.width;

    let topbound = claim1.top < claim2.top ? claim2.top : claim1.top;
    let bottombound =
      claim1.top + claim1.height < claim2.top + claim2.height
        ? claim1.top + claim1.height
        : claim2.top + claim2.height;
    console.log(leftbound, rightbound);
    console.log(topbound, bottombound);
    let coors = {};
    for (let x = leftbound; x < rightbound; x++) {
      for (let y = topbound; y < bottombound; y++) {
        coors[x + ':' + y] = 1;
      }
    }
    return coors;
  }
  return {};
};

const compute = input => {
  const overlaps = {};
  for (let i = 0; i < input.length; i++) {
    const claim1 = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const claim2 = input[j];
      const overlap = computeOverlap(claim1, claim2);
      for (const key in overlap) {
        overlaps[key] = overlaps[key] || 0 + 1;
      }
    }
  }
  // return overlaps;
  return Object.keys(overlaps).length;
};

runner.run('3', format, compute);

// 104126
// 139944
// 279554

/*
 01234567
0........
1...2222.
2...2222.
3.11XX22.
4.11XX22.
5.111133.
6.111133.
7........

*/
