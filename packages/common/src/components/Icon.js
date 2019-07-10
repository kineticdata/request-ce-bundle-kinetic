import React from 'react';
import { COLORS } from '../constants';

export const Icon = props => (
  <i
    style={
      props.background
        ? { background: COLORS[props.background] || COLORS.default }
        : undefined
    }
    className={`fa fa-${props.image} fa-fw card-icon`}
  />
);
