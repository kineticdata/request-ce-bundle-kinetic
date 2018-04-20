import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { ServiceCard } from '../shared/ServiceCard';

export const FormList = ({ forms }) => (
  <div>
    <PageTitle parts={['Forms']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--services-category container">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">services</Link> /
          </h3>
          <h1>All Forms</h1>
        </div>
      </div>
      <div className="cards__wrapper cards__wrapper--categories">
        {forms
          .map(form => ({
            form,
            path: `/forms/${form.slug}`,
            key: form.slug,
          }))
          .map(props => <ServiceCard {...props} />)}
      </div>
    </div>
  </div>
);
