import React from 'react';
import { I18n } from '@kineticdata/react';

export const PaginationControl = ({
  nextPage,
  prevPage,
  loading,
  startIndex,
  endIndex,
}) => (
  <div className="pagination-bar">
    <I18n
      render={translate => (
        <button
          className="btn btn-link icon-wrapper"
          onClick={prevPage}
          disabled={loading || !prevPage}
          title={translate('Previous Page')}
        >
          <span className="icon">
            <span className="fa fa-fw fa-caret-left" />
          </span>
        </button>
      )}
    />
    <small>
      {loading ? (
        <span className="fa fa-spinner fa-spin fa-fw" />
      ) : (
        <strong>{`${startIndex}-${endIndex}`}</strong>
      )}
    </small>
    <I18n
      render={translate => (
        <button
          className="btn btn-link icon-wrapper"
          onClick={nextPage}
          disabled={loading || !nextPage}
          title={translate('Next Page')}
        >
          <span className="icon">
            <span className="fa fa-fw fa-caret-right" />
          </span>
        </button>
      )}
    />
  </div>
);
