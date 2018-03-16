import React from 'react';

const colors = {
  default: 'rgb(126, 128, 131)',
  black: 'rgb(52, 52, 52)',
  blue: 'rgb(16, 148, 196)',
  blueGray: 'rgb(168, 183, 199)',
  blueLake: 'rgb(9, 84, 130)',
  blueSlate: 'rgb(12, 56, 79)',
  blueSky: 'rgb(11, 168, 224)',
  greenGrass: 'rgb(0, 212, 106)',
  greenTeal: 'rgb(2, 212, 177)',
  orange: 'rgb(255, 153, 28)',
  purple: 'rgb(166, 48, 150)',
  red: 'rgb(250, 58, 55)',
  sunflower: 'rgb(255, 207, 74)',
  white: 'rgb(255, 255, 255)',
};

export const Icon = props => (
  <i
    style={
      props.background
        ? { background: colors[props.background] || colors.default }
        : undefined
    }
    className={`fa ${props.image} fa-fw card-icon`}
  />
);
