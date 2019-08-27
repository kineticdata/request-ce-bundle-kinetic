import React from 'react';

export const TableLayout = ({ header, body, footer }) => (
  <table className="table table-hover">
    {header}
    {body}
    {footer}
  </table>
);
