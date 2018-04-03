import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Utils } from 'common';

export const ServiceCard = ({ path, form }) => (
  <Link to={path} className="s-card">
    <h1>
      <Icon
        image={Utils.getAttributeValue(form, 'Icon', 'fa-sticky-note-o')}
        background="blueSlate"
      />
      {form.name}
    </h1>
    <p>{form.description}</p>
  </Link>
);
