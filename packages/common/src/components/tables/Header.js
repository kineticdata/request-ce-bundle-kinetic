import React from 'react';

export const Header = ({ sortable, headerRow }) => (
  <thead className={sortable ? 'sortable' : ''}>{headerRow}</thead>
);
