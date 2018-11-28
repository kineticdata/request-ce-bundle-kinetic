import React, { Component } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import uuid from 'uuid';
import { MOMENT_FORMATS } from '../constants';
import { Moment } from './Moment';

export class TimeAgo extends Component {
  constructor(props) {
    super(props);
    this.uuid = `tooltip-${uuid()}`;
  }

  render() {
    return (
      <span className="time-ago">
        <span className="time-ago__text" id={this.uuid}>
          <Moment timestamp={this.props.timestamp} format="fromNow" />
        </span>
        <UncontrolledTooltip placement="top" target={this.uuid} delay={0}>
          <Moment
            timestamp={this.props.timestamp}
            format={MOMENT_FORMATS.dateTime}
          />
        </UncontrolledTooltip>
      </span>
    );
  }
}
