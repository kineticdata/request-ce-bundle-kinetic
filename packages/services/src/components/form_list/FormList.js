import React, { Fragment } from 'react';
import { ServiceCard } from '../shared/ServiceCard';
import { Link } from '@reach/router';
import { PageTitle } from '../shared/PageTitle';
import { StateListWrapper } from 'common';
import { I18n } from '@kineticdata/react';

export const FormList = ({
  forms,
  error,
  paging,
  hasNextPage,
  hasPreviousPage,
  pageIndexStart,
  pageIndexEnd,
  loadPreviousHandler,
  loadNextHandler,
}) => (
  <Fragment>
    <PageTitle parts={['Forms']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            <span className="breadcrumb-item">
              <Link to="../">
                <I18n>services</I18n>
              </Link>{' '}
            </span>
            <span aria-hidden="true">/ </span>
            <h1>
              <I18n>All Forms</I18n>
            </h1>
          </div>
        </div>
        <StateListWrapper
          data={forms}
          error={error}
          loadingTitle="Loading Forms"
          emptyTitle="No forms to display"
        >
          {data => (
            <Fragment>
              <div className="cards__wrapper cards__wrapper--seconds">
                {forms
                  .map(form => ({
                    form,
                    path: form.slug,
                    key: form.slug,
                  }))
                  .map(props => <ServiceCard {...props} />)}
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
  </Fragment>
);
