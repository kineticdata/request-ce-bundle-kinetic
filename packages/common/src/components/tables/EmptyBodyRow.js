import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { I18n } from '@kineticdata/react';

const isFiltering = appliedFilters =>
  appliedFilters.some(f => f.get('value') !== '');

export const generateEmptyBodyRow = ({
  loadingMessage = 'Loading items...',
  noSearchResultsMessage = 'No items were found - please modify your search criteria',
  noItemsMessage = 'There are no items to display.',
  noItemsLinkTo = null,
  noItemsLinkToMessage = 'Add new item',
  errorMessage = 'There was a problem loading information from the server!',
  divMode = false,
} = {}) => props => {
  const content = props.loading ? (
    /* Visible if there are no items in the list and your table is loading or initializing data. */

    <em className="no-data__title">
      <I18n>{loadingMessage}</I18n>
    </em>
  ) : props.error ? (
    <em>
      <I18n>{errorMessage}</I18n>
    </em>
  ) : isFiltering(props.appliedFilters) ? (
    /* Visible if there are no items in the list and you have filter criteria */

    <em className="no-data__title">
      <I18n>{noSearchResultsMessage}</I18n>
    </em>
  ) : (
    /* Visible if there are no items in the list and you are not searching */
    <Fragment>
      <em className="no-data__title">
        <I18n>{noItemsMessage}</I18n>
      </em>
      {noItemsLinkTo ? (
        typeof noItemsLinkTo === 'function' ? (
          <button className="btn btn-link" onClick={noItemsLinkTo}>
            <I18n>{noItemsLinkToMessage}</I18n>
          </button>
        ) : (
          <Link to={noItemsLinkTo}>
            <span className="fa fa-plus fa-fw" />
            <I18n>{noItemsLinkToMessage}</I18n>
          </Link>
        )
      ) : null}
    </Fragment>
  );
  return divMode ? (
    <div className="no-data text-center">{content}</div>
  ) : (
    <tr>
      <td colSpan={props.colSpan} className="no-data text-center">
        {content}
      </td>
    </tr>
  );
};

export const EmptyBodyRow = generateEmptyBodyRow();
