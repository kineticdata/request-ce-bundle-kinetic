import React from 'react';
import { Link } from '@reach/router';
import { Icon } from 'common';
import { I18n } from '@kineticdata/react';

export const CategoryCard = props => (
  <Link to={props.path} className="card card--category">
    <h1>
      <Icon image={props.category.icon} background="blueSlate" />
      <I18n>{props.category.name}</I18n>
    </h1>
    <p>
      <I18n>{props.category.description}</I18n>
    </p>
    {props.countOfMatchingForms && (
      <p>
        {props.countOfMatchingForms} <I18n>Services</I18n>
      </p>
    )}
  </Link>
);
