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
              <div className="card empty-state-card">
                <h1>You have no requests yet.</h1>
                <p>As you request new services, they’ll appear here.</p>
              </div>
            )}
          </div>
        </div>
        <div className="services-wrapper">
          <div className="page-title-wrapper">
            <div className="page-title">
              <h3>services /</h3>
              <h1>{homePageMode}</h1>
            </div>
          </div>
          <div className="c-cards-wrapper">
            {homePageItems
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
