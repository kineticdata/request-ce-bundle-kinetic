import React, { Fragment } from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { CatalogSearchContainer } from './Services/CatalogSearchContainer';
import { CategoryCard } from './CategoryCard';
import { ServiceCard } from './ServiceCard';
import { RequestCard } from './RequestCard';
import { getSubmissionPath } from '../helpers';

export const Catalog = ({
  profile,
  forms,
  submissions,
  homePageMode,
  homePageItems,
  fetchSubmissions,
}) => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="services-search-container">
        <div className="services-search-wrapper">
          <h1 className="text-truncate">Services from the team</h1>
          <div className="select">
            <CatalogSearchContainer />
          </div>
        </div>
      </div>
      <div className="services-home-container container">
        <div className="my-requests-wrapper">
          <div className="page-title-wrapper">
            <div className="page-title">
              <h3>services /</h3>
              <h1>Recent Requests</h1>
            </div>
            <Link to="/requests">View All</Link>
          </div>
          <div className="r-cards-wrapper">
            {submissions
              .take(5)
              .map(submission => ({
                submission,
                forms,
                key: submission.id,
                path: getSubmissionPath(submission),
                deleteCallback: fetchSubmissions,
              }))
              .map(props => <RequestCard {...props} />)}
          </div>
        </div>
        <div className="services-wrapper">
          <div className="page-title-wrapper">
            <div className="page-title">
              <h3>services /</h3>
              <h1>Top {homePageMode}</h1>
            </div>
            <Link to={homePageMode === 'Categories' ? '/categories' : '/forms'}>
              View All
            </Link>
          </div>
          <div className="c-cards-wrapper">
            {homePageItems
              .take(6)
              .map(
                item =>
                  homePageMode === 'Categories' ? (
                    <CategoryCard
                      key={item.slug}
                      category={item}
                      path={`/categories/${item.slug}`}
                    />
                  ) : (
                    <ServiceCard
                      key={item.slug}
                      form={item}
                      path={`/forms/${item.slug}`}
                    />
                  ),
              )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
