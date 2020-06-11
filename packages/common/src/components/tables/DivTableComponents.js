import React, { Fragment } from 'react';

export const TableLayout = ({
  header,
  body,
  footer,
  initializing,
  error,
  empty,
}) =>
  initializing || error ? (
    <Fragment>
      <div className="d-table table-hover empty">{header}</div>
      {body}
    </Fragment>
  ) : (
    <div className="d-table table-hover">
      {header}
      {!empty && body}
      {footer}
    </div>
  );

export const Header = ({ headerRow }) => (
  <div className="d-thead">{headerRow}</div>
);

export const HeaderRow = ({ columnHeaders }) => (
  <div className="d-tr">{columnHeaders}</div>
);

export const HeaderCell = ({ title }) => <div className="d-th">{title}</div>;

export const Body = ({ tableRows, empty }) =>
  empty ? tableRows : <div className="d-body">{tableRows}</div>;

export const BodyRow = ({ cells, className }) => (
  <div className={`d-tr ${className}`}>{cells}</div>
);

export const BodyCell = ({ value }) => <div className="d-td">{value}</div>;

export const Footer = ({ footerRow }) => (
  <div className="d-tfoot">{footerRow}</div>
);

export const FooterRow = ({ cells }) => <div className="d-tr">{cells}</div>;
