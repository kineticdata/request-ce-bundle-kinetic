import React from 'react';

export const PaginationControl = ({ nextPage, prevPage, loading }) => (
  <nav>
    <ul className="pagination">
      {prevPage && (
        <li className="page-item">
          <button className="page-link" onClick={prevPage} disabled={loading}>
            Previous
          </button>
        </li>
      )}
      {nextPage && (
        <li className="page-item">
          <button className="page-link" onClick={nextPage} disabled={loading}>
            Next
          </button>
        </li>
      )}
    </ul>
  </nav>
);
