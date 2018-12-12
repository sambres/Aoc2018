const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

const format = input => input.split('');

const compute = input => {
  let result = input;
  let action = false;
  let current = input;
  let x = 0;
  do {
    current = result;
    result = [];

    action = false;
    for (let i = 0; i < current.length - 1; i++) {
      const elem = current[i];
      const next = current[i + 1];

      // if (action) {
      //   result.push(...current.slice(i, current.length - 1));
      //   break;
      // }
      if (!(elem === next.toUpperCase() || elem.toUpperCase() === next)) {
        result.push(elem);
      } else {
        action = true;
        i += 1;
      }
    }
    result.push(current[current.length - 1]);
    // console.log(result.join(''), x++);
  } while (action);
  console.log(result.join(''));
  return result.join('').length;
};

const abc = 'abcdefghijklmnopqrstuvwxyz';
const buildRegex = str =>
  str
    .split('')
    .map(c => c + c.toUpperCase() + '|' + c.toUpperCase() + c)
    .join('|');

const compute2 = input => {
  const reg = new RegExp(buildRegex(abc), '');

  let result = input;

  while (result.match(reg)) {
    result = result.replace(reg, '');
    // console.log('result :', result);
  }
  console.log(result);
  return result.length;
};

// runner.run('5', format, compute);
runner.run('5', compute2);

// 11960 too high
// 11892 too high
// 14358

/*


dabAcCaCBAcCcaDA  
dabAaCBAcCcaDA 0
dabAaCBAcCcaDA    

dabCBAcCcaDA    
dabCBAcCcaDA 1

dabCBAcaDA          
dabCBAcaDA 2

dabCBAcaDA 3

*/
