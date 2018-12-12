const fs = require('fs');
const fn = require('./functional');

const writeToFile = (data, filename = 'test') =>
  new Promise((resolve, reject) => {
    fs.writeFile(filename + '.json', JSON.stringify(data), err => {
      if (err) reject(err);
      resolve(data);
    });
  });

const readFile = day =>
  new Promise((resolve, reject) => {
    fs.readFile('input/' + day, 'UTF8', (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data);
    });
  });

const printResult = timeStart => result => {
  console.log(result);
  let timeEnd = process.hrtime(timeStart);
  console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
};

const run = (day, ...fns) => {
  let timeStart = process.hrtime();
  fn.pipeP(
    readFile,
    ...fns,
    printResult(timeStart)
  )(day);
};

exports.run = run;

exports.writeToFile = writeToFile;
