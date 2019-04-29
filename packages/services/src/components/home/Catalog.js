import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { CatalogSearchContainer } from '../shared/CatalogSearchContainer';
import { CategoryCard } from '../shared/CategoryCard';
import { ServiceCard } from '../shared/ServiceCard';
import { RequestCard } from '../shared/RequestCard';
import { PageTitle } from '../shared/PageTitle';

import { getSubmissionPath } from '../../utils';
import { I18n } from '@kineticdata/react';

export const Catalog = ({
  kapp,
  forms,
  submissions,
  homePageMode,
  homePageItems,
  fetchSubmissions,
  appLocation,
}) => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="search-services-home">
        <div className="search-services-home__wrapper">
          <h1 className="text-truncate">
            <I18n>Welcome, how can we help?</I18n>
          </h1>
          <div className="search-box">
            <CatalogSearchContainer />
          </div>
        </div>
      </div>
      <div className="page-container page-container--services-home">
        <div className="page-panel page-panel--transparent page-panel--one-thirds page-panel--auto-height page-panel--my-requests">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3 className="text-lowercase">
                <I18n>{kapp.name}</I18n> /
              </h3>
              <h1>
                <I18n>Recent Requests</I18n>
              </h1>
            </div>
            <Link to="requests">
              <I18n>View All</I18n>
            </Link>
          </div>

          <div className="cards__wrapper cards__wrapper--requests">
            {submissions.size > 0 ? (
              submissions
                .take(5)
                .map(submission => ({
                  submission,
                  forms,
                  key: submission.id,
                  path: getSubmissionPath(appLocation, submission),
                  deleteCallback: fetchSubmissions,
                }))
                .map(props => <RequestCard {...props} />)
            ) : (
              <div className="card card--empty-state">
                <h1>
                  <I18n>You have no requests yet.</I18n>
                </h1>
                <p>
                  <I18n>As you request new services, they’ll appear here.</I18n>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="page-panel page-panel--transparent page-panel--two-thirds page-panel--services">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3 className="text-lowercase">
                <I18n>{kapp.name}</I18n> /
              </h3>
              <h1>
                <I18n>{homePageMode}</I18n>
              </h1>
            </div>
          </div>
          <div className="cards__wrapper cards__wrapper--categories">
            {homePageItems.map(
              item =>
                homePageMode === 'Categories' ? (
                  <CategoryCard
                    key={item.slug}
                    category={item}
                    path={`categories/${item.slug}`}
                  />
                ) : (
                  <ServiceCard
                    key={item.slug}
                    form={item}
                    path={`forms/${item.slug}`}
                  />
                ),
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
