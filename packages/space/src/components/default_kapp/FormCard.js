import React from 'react';
import { KappLink as Link, Icon } from 'common';

export const FormCard = ({ path, form }) => (
  <Link to={path} className="card card--form">
    <h1>
      <Icon image={form.icon} background="blueSlate" />
      {form.name}
    </h1>
    <p>{form.description}</p>
  </Link>
);
