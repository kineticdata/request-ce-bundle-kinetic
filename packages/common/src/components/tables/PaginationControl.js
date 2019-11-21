import React from 'react';
import { I18n } from '@kineticdata/react';

export const PaginationControl = ({ nextPage, prevPage, loading }) =>
  (nextPage || prevPage) && (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button
            className="page-link"
            onClick={prevPage}
            disabled={!prevPage || loading}
          >
            <I18n>Previous</I18n>
          </button>
        </li>

        <li className="page-item">
          <button
            className="page-link"
            onClick={nextPage}
            disabled={!nextPage || loading}
          >
            <I18n>Next</I18n>
          </button>
        </li>
      </ul>
    </nav>
  );
