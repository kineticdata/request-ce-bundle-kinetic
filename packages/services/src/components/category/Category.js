import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { ServiceCard } from '../shared/ServiceCard';

export const Category = ({ category }) => (
  <div>
    <PageTitle parts={[`Categories: ${category.name}`]} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>
    <div className="services-category-container container">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">services</Link> /{' '}
            <Link to="/categories">categories</Link> /
          </h3>
          <h1>{category.name} Services</h1>
        </div>
      </div>
      <div className="s-cards-wrapper">
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
