import React from 'react';
import moment from 'moment';

export const DateBanner = props => (
  <div className="date">
    <hr />
    <span>{moment(props.date).format('MMMM Do, YYYY')}</span>
    <hr />
  </div>
);
