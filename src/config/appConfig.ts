import moment from 'moment';

export default () => {
  moment.updateLocale('en', {
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
};

export const INTEGRATION_URLS = {
  SLACK: 'https://slack.com/oauth/v2/authorize',
  GOOGLE: 'https://accounts.google.com/o/oauth2/v2/auth',
};
