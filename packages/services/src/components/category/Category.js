import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { ServiceCard } from '../shared/ServiceCard';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

export const Category = ({ category }) => (
  <Fragment>
    <PageTitle parts={[category.name, 'Categories']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../..">
                <I18n>services</I18n>
              </Link>{' '}
              /{' '}
              <Link to="..">
                <I18n>categories</I18n>
              </Link>{' '}
              /
            </h3>
            <h1>
              <I18n>{category.name}</I18n> <I18n>Services</I18n>
            </h1>
          </div>
        </div>
        <div className="cards__wrapper cards__wrapper--seconds">
          {category.forms
            .map(form => ({
              form,
              path: form.slug,
              key: form.slug,
            }))
            .map(props => <ServiceCard {...props} />)}
        </div>
      </div>
    </div>
  </Fragment>
);
