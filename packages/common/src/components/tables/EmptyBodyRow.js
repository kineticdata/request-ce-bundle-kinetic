import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const isFiltering = appliedFilters =>
  appliedFilters.some(f => f.get('value') !== '');

export const generateEmptyBodyRow = ({
  loadingMessage = 'Loading items...',
  noSearchResultsMessage = 'No items were found - please modify your search criteria',
  noItemsMessage = 'There are no items to display.',
  noItemsLinkTo = null,
  noItemsLinkToMessage = 'Add new item',
} = {}) => props => (
  <tr>
    <td colSpan={props.colSpan} className="no-data text-center">
      {props.loading ? (
        /* Visible if there are no items in the list and your table is loading or initializing data. */

        <em className="no-data__title">{loadingMessage}</em>
      ) : isFiltering(props.appliedFilters) ? (
        /* Visible if there are no items in the list and you have filter criteria */

        <em className="no-data__title">{noSearchResultsMessage}</em>
      ) : (
        /* Visible if there are no items in the list and you are not searching */
        <Fragment>
          <em className="no-data__title">{noItemsMessage}</em>
          {noItemsLinkTo ? (
            typeof noItemsLinkTo === 'function' ? (
              <button className="btn btn-link" onClick={noItemsLinkTo}>
                {noItemsLinkToMessage}
              </button>
            ) : (
              <Link to={noItemsLinkTo}>
                <span className="fa fa-plus fa-fw" />
                {noItemsLinkToMessage}
              </Link>
            )
          ) : null}
        </Fragment>
      )}
    </td>
  </tr>
);

export const EmptyBodyRow = generateEmptyBodyRow();
