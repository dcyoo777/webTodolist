import moment from 'moment';

export const calculateTime = (date: string) => {

  let targetTime = moment(date);
  let now = moment(moment.now());

  let differ = now.diff(targetTime, 'seconds');
  if (differ < 60) {
    if (differ < 0) {
      differ = 0;
    }
    return differ + ' sec';
  } else if (differ < 60 * 60) {
    return Math.floor(differ / (60)) + ' min';
  } else if (differ < 60 * 60 * 24) {
    return Math.floor(differ / (60 * 60)) + ' hour';
  } else if (differ > 60 * 60 * 24 * 365) {
    return targetTime.format('MMM. DD. YYYY')
  } else {
    return targetTime.format('MMM. DD.')
  }
};

// export const calculateLeftTime = date => {
//   let time = new moment(date);
//   let now = new moment();
//   if (time.diff(now, 'months') > 0) {
//     return `${time.diff(now, 'months')}M Left`;
//   }
//   if (time.diff(now, 'days') > 0) {
//     return `${time.diff(now, 'days')}d Left`;
//   }
//   if (time.diff(now, 'hours') > 0) {
//     return `${time.diff(now, 'hours')}h Left`;
//   }
//   if (time.diff(now, 'minutes') > 0) {
//     return `${time.diff(now, 'minutes')}m Left`;
//   }
//   if (time.diff(now, 'seconds') > 0) {
//     return `${time.diff(now, 'seconds')}s Left`;
//   }
//   return 'End';
// };
