import React from 'react';

export const CatalogSearch = props => (
  <form onSubmit={props.submitHandler(props)} className="search-box__form">
    <input
      type="text"
      placeholder="Search services..."
      value={props.searchTerm}
      autoFocus
      onChange={event => props.catalogSearchInput(event.target.value)}
    />
    <button type="submit">
      <span className="fa fa-search" />
    </button>
  </form>
);
