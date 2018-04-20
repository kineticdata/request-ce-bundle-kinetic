import React, { Fragment } from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { CatalogSearchContainer } from '../shared/CatalogSearchContainer';
import { CategoryCard } from '../shared/CategoryCard';
import { ServiceCard } from '../shared/ServiceCard';
import { RequestCard } from '../shared/RequestCard';
import { getSubmissionPath } from '../../utils';

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
      <div className="page-container page-container--search-services">
        <div className="page-container--search-services__wrapper">
          <h1 className="text-truncate">Services from the team</h1>
          <div className="select">
            <CatalogSearchContainer />
          </div>
        </div>
      </div>
      <div className="page-container page-container--services-home container">
        <div className="page-panel page-panel--transparent page-panel--one-thirds page-panel--my-requests">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>services /</h3>
              <h1>Recent Requests</h1>
            </div>
            <Link to="/requests">View All</Link>
          </div>

          <div className="cards__wrapper cards__wrapper--requests">
            {submissions.size > 0 ? (
              submissions
                .take(5)
                .map(submission => ({
                  submission,
                  forms,
                  key: submission.id,
                  path: getSubmissionPath(submission),
                  deleteCallback: fetchSubmissions,
                }))
                .map(props => <RequestCard {...props} />)
            ) : (
              <div className="card card--empty-state">
                <h1>You have no requests yet.</h1>
                <p>As you request new services, they’ll appear here.</p>
              </div>
            )}
          </div>
        </div>
        <div className="page-panel page-panel--transparent page-panel--two-thirds page-panel--services">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>services /</h3>
              <h1>Top {homePageMode}</h1>
            </div>
            <Link to={homePageMode === 'Categories' ? '/categories' : '/forms'}>
              View All
            </Link>
          </div>
          <div className="cards__wrapper cards__wrapper--categories">
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
