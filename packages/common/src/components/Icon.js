import React from 'react';
import { COLORS } from '../constants';

export const Icon = props => (
  <i
    style={
      props.background
        ? { background: COLORS[props.background] || COLORS.default }
        : undefined
    }
    className={`fa fa-${
      props.image
        ? props.image.indexOf('fa-') === 0
          ? props.image.slice('fa-'.length)
          : props.image
        : 'circle'
    } fa-fw card-icon`}
  />
);
