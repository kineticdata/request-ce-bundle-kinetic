import React, { Fragment } from 'react';
import { Link } from '@reach/router';

import { CategoryCard } from '../shared/CategoryCard';
import { PageTitle } from '../shared/PageTitle';
import { I18n } from '@kineticdata/react';

export const CategoryList = ({ categories }) => (
  <Fragment>
    <PageTitle parts={['Categories']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../">
                <I18n>services</I18n>
              </Link>{' '}
              /
            </h3>
            <h1>
              <I18n>All Categories</I18n>
            </h1>
          </div>
        </div>
        <div className="cards__wrapper cards__wrapper--thirds">
          {categories
            .filter(category => category.slug !== 'home-page-services')
            .map(category => (
              <CategoryCard
                key={category.slug}
                category={category}
                path={category.slug}
                countOfMatchingForms={category.getTotalFormCount()}
              />
            ))}
        </div>
      </div>
    </div>
  </Fragment>
);
