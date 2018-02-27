import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../CategoryCard';
import { PageTitle } from '../Shared/PageTitle';

export const CategoryList = ({ categories }) => (
  <div>
    <PageTitle parts={['Categories']} />
    <div className="services-bar">
      <span className="bordercolor" />
    </div>
    <div className="services-category-container container">
      <div className="page-title-wrapper">
        <div className="page-title">
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
