const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

const format = input =>
  input.split('\n').map(l => {
    let timematch = l.match(/\[((\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}))\]/);
    let sleeps = l.match(/falls asleep/);
    let wakes = l.match(/wakes up/);
    let guard = l.match(/Guard #(\d+)/);

    let date = new Date(
      timematch[1].replace('1518', '2018').replace(' ', 'T') + 'Z'
    );
    // let date = new Date(
    //   Date.UTC(2018, timematch[3], timematch[4], timematch[5], timematch[6])
    // );

    return {
      date,
      sleeps: sleeps ? true : false,
      wakes: wakes ? true : false,
      guard: guard ? parseInt(guard[1]) : undefined
    };
  });

const compute = input => {
  const timeline = input.sort((a, b) => a.date - b.date);
  const naps = {};
  let guard = undefined;
  let sleeptime = undefined;

  for (const event of timeline) {
    if (event.guard) {
      guard = event.guard;
    }
    if (event.wakes) {
      let nap = event.date.getMinutes() - sleeptime.getMinutes();
      const range = [sleeptime.getMinutes(), event.date.getMinutes()];
      let prev = naps[guard] || {
        sleeptime: 0,
        ranges: []
      };
      naps[guard] = {
        id: guard,
        sleeptime: (prev.sleeptime || 0) + nap,
        ranges: [...prev.ranges, range]
      };
    }
    if (event.sleeps) {
      sleeptime = event.date;
    }
  }
  return naps;
};

const getSleepiestMinute = guard => {
  let minutes = {};
  for (const range of guard.ranges) {
    for (let i = range[0]; i < range[1]; i++) {
      minutes[i] = (minutes[i] || 0) + 1;
    }
  }

  const most = Object.entries(minutes).reduce(
    (aggr, [minute, total]) =>
      minutes[minute] > (minutes[aggr] || 0) ? minute : aggr,
    0
  );

  return {
    ...guard,
    sleepiestMinute: parseInt(most),
    timesSlept: minutes[most]
  };
};

const getMinutes = guards => Object.values(guards).map(getSleepiestMinute);

const getSleeper = guards =>
  guards.reduce(
    (sleeper, guard) =>
      guard.timesSlept > (sleeper.timesSlept || 0) ? guard : sleeper,
    {}
  );

const getResult = guard => guard.id * guard.sleepiestMinute;

runner.run(
  '4',
  format,
  compute,
  getMinutes,

  getSleeper,
  getResult
);

// 994445 too high
// 723239 too high
// 85296
