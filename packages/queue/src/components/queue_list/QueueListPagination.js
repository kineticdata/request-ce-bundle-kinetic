import React from 'react';
import { I18n } from '@kineticdata/react';

export const QueueListPagination = ({ filter, paginationProps }) => {
  return (
    paginationProps.count > 0 && (
      <div className="queue-controls">
        <div className="queue-controls__pagination">
          <button
            type="button"
            className="btn btn-link icon-wrapper"
            disabled={!paginationProps.hasPrevPage}
            onClick={paginationProps.gotoPrevPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-left" />
            </span>
          </button>
          <small className="text-center">
            <strong>
              {paginationProps.offset + 1}-{paginationProps.offset +
                paginationProps.pageCount}
            </strong>{' '}
            <I18n>of</I18n> <strong>{paginationProps.count}</strong>
          </small>
          <button
            type="button"
            className="btn btn-link icon-wrapper"
            disabled={!paginationProps.hasNextPage}
            onClick={paginationProps.gotoNextPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-right" />
            </span>
          </button>
        </div>
      </div>
    )
  );
};
