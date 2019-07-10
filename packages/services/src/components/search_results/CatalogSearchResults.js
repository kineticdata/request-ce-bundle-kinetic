import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { StateListWrapper } from 'common';
import { ServiceCard } from '../shared/ServiceCard';
import { PageTitle } from '../shared/PageTitle';
import { CatalogSearchContainer } from '../shared/CatalogSearchContainer';
import { I18n } from '@kineticdata/react';

export const CatalogSearchResults = ({
  query,
  error,
  forms,
  appLocation,
  paging,
  hasNextPage,
  hasPreviousPage,
  pageIndexStart,
  pageIndexEnd,
  loadPreviousHandler,
  loadNextHandler,
}) => (
  <div>
    <PageTitle parts={[query, 'Search']} />
    <span className="services-color-bar services-color-bar__blue-slate" />
    <div className="page-container page-container--search-results">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to={`../${query ? '../' : ''}`}>
              <I18n>services</I18n>
            </Link>{' '}
            / <I18n>search results</I18n>
          </h3>
          <h1>{query}</h1>
        </div>
      </div>
      <div className="search-results">
        <div className="search-box">
          <CatalogSearchContainer />
        </div>
        <StateListWrapper
          data={forms}
          error={error}
          loadingTitle="Searching"
          emptyTitle="No results found"
          emptyMessage="Make sure words are spelled correctly, use less specific or different keywords"
        >
          {data => (
            <Fragment>
              <div className="search-results__list">
                <ul>
                  {forms.map(form => (
                    <li key={form.slug}>
                      <ServiceCard
                        path={`${appLocation}/forms/${form.slug}`}
                        form={form}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pagination-bar">
                <I18n
                  render={translate => (
                    <button
                      className="btn btn-link icon-wrapper"
                      onClick={loadPreviousHandler}
                      disabled={paging || !hasPreviousPage}
                      title={translate('Previous Page')}
                    >
                      <span className="icon">
                        <span className="fa fa-fw fa-caret-left" />
                      </span>
                    </button>
                  )}
                />
                <small>
                  {paging ? (
                    <span className="fa fa-spinner fa-spin" />
                  ) : (
                    <strong>{`${pageIndexStart}-${pageIndexEnd}`}</strong>
                  )}
                </small>
                <I18n
                  render={translate => (
                    <button
                      className="btn btn-link icon-wrapper"
                      onClick={loadNextHandler}
                      disabled={paging || !hasNextPage}
                      title={translate('Next Page')}
                    >
                      <span className="icon">
                        <span className="fa fa-fw fa-caret-right" />
                      </span>
                    </button>
                  )}
                />
              </div>
            </Fragment>
          )}
        </StateListWrapper>
      </div>
    </div>
  </div>
);
