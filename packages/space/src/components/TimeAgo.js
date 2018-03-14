import React, { Component } from 'react';
import moment from 'moment';
import { UncontrolledTooltip } from 'reactstrap';

const TIME_FORMAT = 'MMMM D, YYYY h:mm A';
const TIME_AGO_INTERVAL = 10000;

export class TimeAgo extends Component {
  constructor(props) {
    super(props);
    this.state = this.getState(props);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, TIME_AGO_INTERVAL);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      this.setState(this.getState(nextProps));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState({ timeAgo: moment(this.props.timestamp).fromNow() });
  }

  getState(props) {
    return {
      formatted: moment(props.timestamp).format(TIME_FORMAT),
      timeAgo: moment(props.timestamp).fromNow(),
    };
  }

  render() {
    return (
      <span className="time-ago-wrapper">
        <span className="time-ago-text" id={this.props.id}>
          {this.state.timeAgo}
        </span>
        <UncontrolledTooltip placement="top" target={this.props.id} delay={0}>
          {this.state.formatted}
        </UncontrolledTooltip>
      </span>
    );
  }
}
