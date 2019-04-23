import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MOMENT_FORMATS, TIME_AGO_INTERVAL } from '../constants';
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

class MomentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    importLocale(this.props.locale, () =>
      this.setState({ locale: this.props.locale }),
    );
    if (this.props.fromNow) {
      this.interval = setInterval(this.tick, TIME_AGO_INTERVAL);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale && this.props.locale !== prevProps.locale) {
      importLocale(this.props.locale, () =>
        this.setState({ locale: this.props.locale }),
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState(this.state);
  }

  render() {
    if (this.props.locale) {
      if (this.state.locale) {
        if (typeof this.props.render === 'function') {
          return this.props.render(
            format(this.state.locale),
            this.state.locale,
          );
        } else {
          return format(this.state.locale)(
            this.props.timestamp,
            this.props.format,
          );
        }
      } else {
        // If locale language is not yet loaded, don't render anything
        return null;
      }
    } else {
      // If locale is not set at app level, return without localizing
      return format()(this.props.timestamp, this.props.format);
    }
  }
}

const format = locale => (timestamp, format) => {
  const formatFn =
    format === 'fromNow'
      ? m => m.fromNow()
      : m =>
          m.format(
            format ? MOMENT_FORMATS[format] || format : MOMENT_FORMATS.dateTime,
          );
  if (locale) {
    return formatFn(moment(timestamp).locale(locale));
  } else {
    return formatFn(moment(timestamp));
  }
};

export const mapStateToProps = state => ({
  locale: state.app.locale,
});

export const Moment = connect(mapStateToProps)(MomentComponent);

Moment.propTypes = {
  timestamp: PropTypes.oneOfType([
    PropTypes.string, // Timestamp string
    PropTypes.object, // Timestamp moment object
  ]),
  format: PropTypes.string,
  render: PropTypes.func,
};
