import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { StateListWrapper } from 'common';
import { ServiceCard } from '../shared/ServiceCard';
import { PageTitle } from '../shared/PageTitle';
import { CatalogSearchContainer } from '../shared/CatalogSearchContainer';
import { I18n } from '@kineticdata/react';

export const CatalogSearchResults = ({
  navigate,
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
  clientSideSearch,
}) => (
  <div>
    <PageTitle parts={[query, 'Search']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            <span className="breadcrumb-item">
              <Link to={`../${query ? '../' : ''}`}>
                <I18n>services</I18n>
              </Link>{' '}
              / <I18n>search results</I18n>
            </span>
            <h1>{query}</h1>
          </div>
        </div>
        <div className="search-results">
          <div className="search-box">
            <CatalogSearchContainer onSearch={q => navigate(`../${q}`)} />
          </div>
          {!clientSideSearch && (
            <div className="mb-4 text-info">
              <em>
                <I18n>Searching by name and keywords only.</I18n>
              </em>
            </div>
          )}
          <StateListWrapper
            data={clientSideSearch ? clientSideSearch.data : forms}
            error={error}
            loadingTitle="Searching"
            emptyTitle="No results found"
            emptyMessage="Make sure words are spelled correctly, use less specific or different keywords"
          >
            {data => (
              <Fragment>
                <div>
                  <ul className="cards__wrapper">
                    {data.map(form => (
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
  </div>
);
