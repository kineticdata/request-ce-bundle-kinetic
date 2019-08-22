import React, { Component } from 'react';
import t from 'prop-types';
import { I18n } from '@kineticdata/react';
import moment from 'moment';

const pad = value => (`${value}`.length === 1 ? `0${value}` : value);

export class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target: null,
      invalid: false,
      hours: null,
      minutes: null,
      seconds: null,
      isCompleted: false,
      display: Countdown.MINUTES,
    };
    this.intervalId = null;
  }

  tick = () => {
    const duration = moment.duration(this.state.target.diff(moment()));
    if (duration.asMilliseconds() > 0) {
      this.setState({
        hours:
          this.state.display === Countdown.HOURS
            ? Math.floor(duration.asHours())
            : 0,
        minutes:
          this.state.display === Countdown.MINUTES
            ? Math.floor(duration.asMinutes())
            : this.state.display === Countdown.HOURS
              ? duration.minutes()
              : 0,
        seconds:
          this.state.display === Countdown.SECONDS
            ? Math.floor(duration.asSeconds())
            : duration.seconds(),
      });
    } else {
      this.setState({ hours: 0, minutes: 0, seconds: 0 });
    }
  };

  calcInitState() {
    const target = moment(this.props.date);
    if (this.props.date && target.isValid()) {
      return {
        target,
        display:
          this.props.display === Countdown.HOURS ||
          this.props.display === Countdown.SECONDS
            ? this.props.display
            : Countdown.MINUTES,
      };
    } else {
      return { invalid: true, target: null };
    }
  }

  componentDidMount() {
    this.setState(this.calcInitState());
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.date !== prevProps.date ||
      this.props.display !== prevProps.display
    ) {
      this.setState(this.calcInitState());
    }

    if (this.state.target && !prevState.target) {
      this.tick();
      this.intervalId = window.setInterval(this.tick, 1000);
    }

    if (
      this.state.target &&
      this.state.hours === 0 &&
      this.state.minutes === 0 &&
      this.state.seconds === 0 &&
      (prevState.hours !== 0 ||
        prevState.minutes !== 0 ||
        prevState.seconds !== 0)
    ) {
      this.intervalId = window.clearInterval(this.intervalId);
      this.setState({ isCompleted: true });
      if (typeof this.props.onComplete === 'function') {
        this.props.onComplete();
      }
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  render() {
    const { children: Wrapper } = this.props;
    const hours =
      this.state.display === Countdown.HOURS ? this.state.hours : undefined;
    const minutes =
      this.state.display !== Countdown.SECONDS ? this.state.minutes : undefined;
    const seconds = this.state.seconds;
    const content = this.state.invalid ? (
      <I18n>Invalid Date</I18n>
    ) : this.state.target && this.state.seconds !== null ? (
      `${hours !== undefined ? `${pad(hours)}:` : ''}${
        minutes !== undefined ? `${pad(minutes)}:` : ''
      }${this.state.display === Countdown.SECONDS ? seconds : pad(seconds)}`
    ) : null;
    return Wrapper ? (
      <Wrapper
        content={content}
        isCompleted={this.state.isCompleted}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    ) : (
      content
    );
  }

  static HOURS = 'h';
  static MINUTES = 'm';
  static SECONDS = 's';
}

Countdown.propTypes = {
  /** Date object or date string showing time to which we are counting down. */
  date: t.oneOfType([t.object, t.string]),
  /** Callback function to be called when the countdown reaches 0. */
  onComplete: t.func,
  /** Format in which countdown should be displayed. Valid options: [h, m, s] */
  display: t.string,
  /** Render function to wrap the content returned. Receives props: content, isCompleted, hours, minutes, seconds */
  children: t.string,
};
