const moment = require('moment');

function chii(start, end, ws, we) {
  if (start.isAfter(end, 'hour'))
    return 0;

  let nws = moment(start).set('hour', ws).startOf('hour');
  let nwe = moment(start).set('hour', we).startOf('hour');
  let c2 = 0;

  if (start.isBetween(nws, nwe, 'hour'))
    c2 = nwe.diff(start, 'hour');

  if (nws.isBefore(start, 'hour'))
    nws.add(1, 'day');

  if (nws.isAfter(end, 'hour'))
    return 0;

  const c1 = nws.diff(moment(start), 'hour') - c2;
  const clh = 24 - we + ws;
  const dd = moment(end).diff(nws.set('hour', ws), 'days');
  console.log('-----------------------------------');
  console.log(`Next work start: ${nws.format('DD.MM.YYYY HH:mm')}`);
  console.log(`Closed hours to next work start: ${c1}`);
  console.log(`Closed hours per day: ${clh}`);
  console.log(`Whole day cycles: ${dd}`);
  return c1 + dd * clh;
}

function diff(start, end, ws, we) {
  start = moment(start);
  end = moment(end);
  console.log('Start date: ', start.format('DD.MM.YYYY HH:mm'));
  console.log('Reservation: ', end.format('DD.MM.YYYY HH:mm'));
  console.log(`Working hours: ${ws} - ${we}`);
  const diff = end.diff(start, 'hour');
  const c2 = chii(start, end, ws, we);
  console.log('-----------------------------------');
  console.log(`Closed time: ${c2}h`);
  console.log(`Work time: ${diff - c2}h`);
  console.log(`Total time: ${diff}h`);
  console.log(`Sanity check: ${diff} - ${c2} == ${diff - c2}`)
  console.log('\n~~~~~~~END~~~~~~\n');
}

diff(moment(), moment('2018-11-10').set('hours', 14), 7, 23);
diff(moment('2018-11-10').set('hours', 11), moment('2018-11-10').set('hours', 8), 7, 23);
diff(moment('2018-11-09').set('hours', 14), moment('2018-11-12').set('hours', 14), 7, 23);
diff(moment('2018-11-10').set('hours', 18), moment('2018-11-10').set('hours', 14), 7, 23);

module.exports = { chii, diff }