import React from 'react';

import { bundle } from 'react-kinetic-core';
import { Utils } from 'react-kinops-common';

import { Icon } from './Icon';

export const KappCard = ({
  kapp,
  description = Utils.getAttributeValue(
    kapp,
    'Kapp Description',
    Utils.getAttributeValue(kapp, 'Description', ''),
  ),
  icon = Utils.getAttributeValue(kapp, 'Icon', 'fa-circle'),
}) => (
  <a className="kapp-card" href={bundle.kappLocation(kapp.slug)}>
    <h1>
      <Icon image={icon} />
      {kapp.name}
    </h1>
    {description !== '' ? <p>{description}</p> : ''}
  </a>
);
