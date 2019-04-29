import moment from 'moment';
import 'moment/min/locales';

const mapJavaLocalesToISO639 = locale => {
  switch (locale) {
    case 'in':
    case 'in-ID':
      return 'id';
    case 'iw':
    case 'iw-IL':
      return 'he';
    case 'no':
    case 'no-NO':
      return 'nb';
    case 'no-NO-NY':
      return 'nn';
    case 'zh':
    case 'zh-SG':
      return 'zh-cn';
    default:
      return locale;
  }
};

export const importLocale = (locale, success) => {
  const code = mapJavaLocalesToISO639(locale);
  if (!code || code === 'en') {
    moment.locale(code);
    if (typeof success === 'function') {
      success();
    }
  } else {
    import(`moment/locale/${code}`)
      .catch(error => {
        const localeAncestor = code.match(/(.+)-..$/);
        if (localeAncestor && localeAncestor[1]) {
          importLocale(localeAncestor[1], success);
        } else {
          console.warn('Locale could not be found.', error);
        }
      })
      .then(() => {
        moment.locale(code);
        if (typeof success === 'function') {
          success();
        }
      });
  }
};
