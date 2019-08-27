import React, { Fragment } from 'react';
export const generateFilterLayout = filterSet => ({
  filters,
  onSearch,
  columnSet,
  loading,
  initializing,
}) => (
  <form onSubmit={onSearch}>
    {filterSet.map(fs => <Fragment key={fs}>{filters.get(fs)}</Fragment>)}
    <button type="submit" className="btn btn-sm btn-primary">
      Search
    </button>
  </form>
);
