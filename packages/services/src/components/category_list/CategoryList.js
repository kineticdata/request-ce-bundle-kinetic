import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { CategoryCard } from '../shared/CategoryCard';

export const CategoryList = ({ categories }) => (
  <div>
    <PageTitle parts={['Categories']} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>
    <div className="services-category-container container">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">services</Link> /
          </h3>
          <h1>All Categories</h1>
        </div>
      </div>
      <div className="c-cards-wrapper">
        {categories
          .filter(category => category.slug !== 'home-page-services')
          .map(category => (
            <CategoryCard
              key={category.slug}
              category={category}
              path={`/categories/${category.slug}`}
              countOfMatchingForms={category.forms.length}
            />
          ))}
      </div>
    </div>
  </div>
);
