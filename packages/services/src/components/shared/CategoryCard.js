import React from 'react';
import { KappLink as Link, Icon } from 'common';

export const CategoryCard = props => (
  <Link to={props.path} className="card c-card">
    <h1>
      <Icon image={props.category.icon} background="blueSlate" />
      {props.category.name}
    </h1>
    <p>{props.category.description}</p>
    {props.countOfMatchingForms && <p>{props.countOfMatchingForms} Services</p>}
  </Link>
);
