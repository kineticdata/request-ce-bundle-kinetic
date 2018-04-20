import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { ServiceCard } from '../shared/ServiceCard';

export const Category = ({ category }) => (
  <div>
    <PageTitle parts={[`Categories: ${category.name}`]} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--services-category container">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">services</Link> /{' '}
            <Link to="/categories">categories</Link> /
          </h3>
          <h1>{category.name} Services</h1>
        </div>
      </div>
      <div className="cards__wrapper cards__wrapper--services">
        {category.forms
          .map(form => ({
            form,
            path: `/categories/${category.slug}/${form.slug}`,
            key: form.slug,
          }))
          .map(props => <ServiceCard {...props} />)}
      </div>
    </div>
  </div>
);
