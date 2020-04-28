import React from 'react';
import { I18n } from '@kineticdata/react';

export const CatalogSearch = props => (
  <form
    role="search"
    onSubmit={props.submitHandler(props)}
    className="search-box__form"
  >
    <I18n
      render={translate => (
        <input
          type="search"
          placeholder={translate('Search services...')}
          value={props.searchTerm}
          autoFocus
          aria-label="Search Services..."
          onChange={event => props.catalogSearchInput(event.target.value)}
        />
      )}
    />
    <button type="submit" aria-label="Submit Search">
      <span className="fa fa-fw fa-search" focusable="false" />
    </button>
  </form>
);
