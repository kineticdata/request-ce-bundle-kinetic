import React from 'react';
import { I18n } from '@kineticdata/react';

// This is where we want to be once the styles are up to date.
// export const HeaderCell = ({ onSortColumn, sorting, title }) => (
//   <th
//     {...(title ? { scope: 'col' } : {})}
//     onClick={onSortColumn}
//     className={
//       sorting === 'asc' ? 'sort-asc' : sorting === 'desc' ? 'sort-desc' : ''
//     }
//   >
//     <I18n>{title}</I18n>
//   </th>
// );

export const HeaderCell = ({ onSortColumn, sortable, sorting, title }) => (
  <th {...(title ? { scope: 'col' } : {})}>
    {sortable === false ? (
      <I18n>{title}</I18n>
    ) : (
      <a onClick={onSortColumn}>
        <I18n>{title}</I18n>{' '}
        <span
          className={`fa ${
            sorting === 'asc'
              ? 'fa-sort-down'
              : sorting === 'desc'
                ? 'fa-sort-up'
                : 'fa-sort'
          }`}
        />
      </a>
    )}
  </th>
);
