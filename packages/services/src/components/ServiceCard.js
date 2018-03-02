import React from 'react';
import { KappLink as Link } from 'common';
import { Icon } from './Icon';

export const ServiceCard = ({ path, form }) => (
  <Link to={path} className="s-card">
    <h1>
      <Icon image={form.icon} background="blueSlate" />
      {form.name}
    </h1>
    <p>{form.description}</p>
  </Link>
);
