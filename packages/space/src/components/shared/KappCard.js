import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Utils } from 'common';

export const KappCard = ({
  kapp,
  description = Utils.getAttributeValue(
    kapp,
    'Kapp Description',
    Utils.getAttributeValue(kapp, 'Description', ''),
  ),
  icon = Utils.getAttributeValue(kapp, 'Icon', 'fa-circle'),
}) => (
  <Link className="kapp-card" to={`/kapps/${kapp.slug}`}>
    <h1>
      <Icon image={icon} />
      {kapp.name}
    </h1>
    {description !== '' ? <p>{description}</p> : ''}
  </Link>
);
