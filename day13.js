const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

const format = input => input.split('\n').map(c => c.split(''));
// .map(c => ({
//   char: c,

// })));

const getDrivers = tracks => {
  const drivers = [];
  let i = 0;
  for (let x = 0; x < tracks.length; x++) {
    for (let y = 0; y < tracks[x].length; y++) {
      // console.log('x :', x, y);
      let c = tracks[x][y];
      if (c === '<' || c === '>' || c === 'v' || c === '^') {
        const driver = {
          id: i++,
          x: y,
          y: x,
          turn: 0
        };
        if (c === '<') {
          driver.dir = 'w';
          tracks[x][y] = '-';
        }
        if (c === '>') {
          driver.dir = 'e';
          tracks[x][y] = '-';
        }
        if (c === 'v') {
          driver.dir = 's';
          tracks[x][y] = '|';
        }
        if (c === '^') {
          driver.dir = 'n';
          tracks[x][y] = '|';
        }
        drivers.push(driver);
      }
    }
  }

  return drivers;
};

const printMatrix = (tracks, drivers) => {
  for (let x = 0; x < tracks.length; x++) {
    let str = '';
    for (let y = 0; y < tracks[x].length; y++) {
      let c = tracks[x][y];
      let driver = drivers.find(d => d.y === x && d.x === y);
      if (driver) {
        let caret = '';
        if (driver.dir === 'w') caret = '<';

        if (driver.dir === 'e') caret = '>';

        if (driver.dir === 's') caret = 'v';

        if (driver.dir === 'n') caret = '^';
        str += caret;
      } else {
        str += c;
      }
    }
    console.log(str);
  }
};

const hasCollide = (driver, drivers) => {
  for (let x = 0; x < drivers.length; x++) {
    if (driver.id === drivers[x].id) continue;
    if (driver.x === drivers[x].x && driver.y === drivers[x].y) return true;
  }
  return false;
};
let turns = ['l', 's', 'r', 's'];
let turnsValue = {
  l: -1,
  s: 0,
  r: 1
};

let directions = ['w', 'n', 'e', 's'];

const compute = tracks => {
  let crash = false;
  let i = 0;
  const drivers = getDrivers(tracks);
  // return drivers;
  // console.log(tracks);
  while (!crash) {
    for (let i = 0; i < 20; i++) {
      for (let x = 0; x < drivers.length; x++) {
        const driver = drivers[x];
        let dx = 0,
          dy = 0;

        switch (driver.dir) {
          case 'w':
            dx = -1;
            break;
          case 'e':
            dx = 1;
            break;
          case 's':
            dy = 1;
            break;
          case 'n':
            dy = -1;
            break;
        }
        // console.log('x, y :', driver.x, driver.y);
        // console.log('dx :', dx, dy);
        // console.log('driver.x + dx :', driver.x + dx, driver.y + dy);
        const newCase = tracks[driver.y + dy][driver.x + dx];
        // console.log('oldCase :', tracks[driver.y][driver.x]);
        // console.log('newCase :', newCase);

        switch (newCase) {
          case '+':
            let newTurn = turns[driver.turn];
            driver.turn = (driver.turn + 1) % 4;
            let turnDelta = turnsValue[newTurn];
            let dirIndex = directions.indexOf(driver.dir);
            console.log(
              'newTurn :',
              newTurn,
              'turnDelta :',
              turnDelta,
              'dirIndex :',
              dirIndex,
              'driver.dir :',
              driver.dir,
              'newDir :',
              directions[(4 + dirIndex + turnDelta) % 4]
            );
            driver.dir = directions[(4 + dirIndex + turnDelta) % 4];
            break;
          case '|':
          case '-':
            // console.log('new x, y :', driver.x, driver.y);
            break;
          case '\\':
            switch (driver.dir) {
              case 's':
                driver.dir = 'e';
                break;
              case 'n':
                driver.dir = 'w';
                break;
              case 'e':
                driver.dir = 's';
                break;
              case 'w':
                driver.dir = 'n';
                break;
            }
            break;
          case '/':
            switch (driver.dir) {
              case 's':
                driver.dir = 'w';
                break;
              case 'n':
                driver.dir = 'e';
                break;
              case 'e':
                driver.dir = 'n';
                break;
              case 'w':
                driver.dir = 's';
                break;
            }
            break;
          default:
            break;
        }
        driver.x += dx;
        driver.y += dy;
        drivers[x] = driver;

        if (hasCollide(driver, drivers)) {
          crash = true;
          return { x: driver.x, y: driver.y };
        }
      }
      // printMatrix(tracks, drivers);
      // console.log('drivers :', drivers);
    }
    console.log(i++);
  }

  return drivers;
};

runner.run('13test', format, compute);

//fail 32,18
