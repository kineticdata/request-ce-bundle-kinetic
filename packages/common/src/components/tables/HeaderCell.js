import React from 'react';
import { I18n } from '@kineticdata/react';
import classNames from 'classnames';

export const HeaderCell = ({ onSortColumn, sortable, sorting, title }) => (
  <th
    {...(title ? { scope: 'col' } : {})}
    onClick={sortable ? onSortColumn : undefined}
    className={classNames({
      'sort-disabled': !sortable,
      'sort-asc': sortable && sorting === 'asc',
      'sort-desc': sortable && sorting === 'desc',
    })}
  >
    <I18n>{title}</I18n>
  </th>
);
