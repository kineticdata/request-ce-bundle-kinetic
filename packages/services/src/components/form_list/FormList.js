import React, { Fragment } from 'react';
import { ServiceCard } from '../shared/ServiceCard';
import { Link } from '@reach/router';
import { PageTitle } from '../shared/PageTitle';

import { I18n } from '@kineticdata/react';

export const FormList = ({ forms }) => (
  <Fragment>
    <PageTitle parts={['Forms']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--services-category">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="../">
              <I18n>services</I18n>
            </Link>{' '}
            /
          </h3>
          <h1>
            <I18n>All Forms</I18n>
          </h1>
        </div>
      </div>
      <div className="cards__wrapper cards__wrapper--categories">
        {forms
          .map(form => ({
            form,
            path: form.slug,
            key: form.slug,
          }))
          .map(props => <ServiceCard {...props} />)}
      </div>
    </div>
  </Fragment>
);
