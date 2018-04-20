import React from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { CategoryCard } from '../shared/CategoryCard';

export const CategoryList = ({ categories }) => (
  <div>
    <PageTitle parts={['Categories']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--services-category container">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">services</Link> /
          </h3>
          <h1>All Categories</h1>
        </div>
      </div>
      <div className="cards__wrapper cards__wrapper--categories">
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
