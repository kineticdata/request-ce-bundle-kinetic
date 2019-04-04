import React, { Fragment } from 'react';
import { PageTitle } from 'common';
import { Link } from '@reach/router';
import { ServiceCard } from '../shared/ServiceCard';
import { I18n } from '../../../../app/src/I18nProvider';

export const Category = ({ category }) => (
  <Fragment>
    <PageTitle parts={[category.name, 'Categories']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--services-category">
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
      <div className="cards__wrapper cards__wrapper--services">
        {category.forms
          .map(form => ({
            form,
            path: form.slug,
            key: form.slug,
          }))
          .map(props => (
            <ServiceCard {...props} />
          ))}
      </div>
    </div>
  </Fragment>
);
