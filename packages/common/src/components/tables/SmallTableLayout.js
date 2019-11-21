import React from 'react';

export const SmallTableLayout = ({ header, body, footer }) => (
  <table className="table table-sm table-hover">
    {header}
    {body}
    {footer}
  </table>
);
