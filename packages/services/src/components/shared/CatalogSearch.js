import React from 'react';
import { I18n } from '@kineticdata/react';

export const CatalogSearch = props => (
  <form onSubmit={props.submitHandler(props)} className="search-box__form">
    <I18n
      render={translate => (
        <input
          type="text"
          placeholder={translate('Search services...')}
          value={props.searchTerm}
          autoFocus
          onChange={event => props.catalogSearchInput(event.target.value)}
        />
      )}
    />
    <button type="submit">
      <span className="fa fa-fw fa-search" />
    </button>
  </form>
);
