import moment from 'moment';

export default () => {
  moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s:  'seconds',
      ss: '%ss',
      m:  'a minute',
      mm: '%dm',
      h:  'an hour',
      hh: '%dh',
      d:  'a day',
      dd: '%dd',
      M:  'a month',
      MM: '%dM',
      y:  'a year',
      yy: '%dY'
    }
  }); 
}
