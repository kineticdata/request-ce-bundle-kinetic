import React, { Component } from 'react';
import moment from 'moment';
import { UncontrolledTooltip } from 'reactstrap';
import uuid from 'uuid';
import * as constants from '../constants';

export class TimeAgo extends Component {
  constructor(props) {
    super(props);
    this.state = this.getState(props);
    this.tick = this.tick.bind(this);
    this.uuid = uuid();
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, constants.TIME_AGO_INTERVAL);
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
      formatted: moment(props.timestamp).format(constants.TIME_FORMAT),
      timeAgo: moment(props.timestamp).fromNow(),
    };
  }

  render() {
    return (
      <span className="time-ago-wrapper">
        <span className="time-ago-text" id={this.uuid}>
          {this.state.timeAgo}
        </span>
        <UncontrolledTooltip placement="top" target={this.uuid} delay={0}>
          {this.state.formatted}
        </UncontrolledTooltip>
      </span>
    );
  }
}
