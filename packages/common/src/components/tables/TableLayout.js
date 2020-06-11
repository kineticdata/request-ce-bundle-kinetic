import React from 'react';

export const TableLayout = ({ header, body, footer, ...other }) => (
  <table className="table table-sm table-hover">
    {header}
    {body}
    {footer}
  </table>
);

export const SettingsTableLayout = ({ header, body, footer, ...other }) => (
  <table className="table table-sm table-hover table--settings">
    {header}
    {body}
    {footer}
  </table>
);
