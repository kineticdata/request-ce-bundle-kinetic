import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { CatalogSearchContainer } from '../shared/CatalogSearchContainer';
import { CategoryCard } from '../shared/CategoryCard';
import { ServiceCard } from '../shared/ServiceCard';
import { RequestCard } from '../shared/RequestCard';
import { PageTitle } from '../shared/PageTitle';
import { StateListWrapper } from 'common';
import { getSubmissionPath } from '../../utils';
import { I18n } from '@kineticdata/react';

export const Catalog = ({
  kapp,
  forms,
  submissions,
  submissionsError,
  homePageMode,
  homePageItems,
  fetchSubmissions,
  appLocation,
}) => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel">
          <div className="page-panel__header">
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
          </div>
          <div className="page-panel__body">
            <div className="column-container">
              <div className="column-panel column-panel--thirds">
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
                  <StateListWrapper
                    data={submissions}
                    error={submissionsError}
                    emptyTitle="You have no requests yet"
                    emptyMessage="As you request new services, they’ll appear here"
                  >
                    {data =>
                      data
                        .take(5)
                        .map(submission => ({
                          submission,
                          forms,
                          key: submission.id,
                          path: getSubmissionPath(appLocation, submission),
                          deleteCallback: fetchSubmissions,
                        }))
                        .map(props => <RequestCard {...props} />)
                    }
                  </StateListWrapper>
                </div>
              </div>
              <div className="column-panel column-panel--thirds">
                <div className="page-title">
                  <div className="page-title__wrapper">
                    <h3 className="text-lowercase">
                      <I18n>{kapp.name}</I18n> /
                    </h3>
                    <h1>
                      <I18n>{homePageMode}</I18n>
                    </h1>
                  </div>
                  <Link
                    to={homePageMode === 'Categories' ? 'categories' : 'forms'}
                  >
                    <I18n>View All</I18n>
                  </Link>
                </div>
                <div className="cards__wrapper cards__wrapper--seconds">
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
          </div>
        </div>
      </div>
    </Fragment>
  );
};
