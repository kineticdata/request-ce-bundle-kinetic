import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { compose, withHandlers, withState } from 'recompose';

import moment from 'moment';

import { Constants } from 'common';
import { I18n } from '@kineticdata/react';

const MobileSubmissionCard = ({ submission, columns, to }) => (
  <tr>
    <td className="d-md-none d-table-cell" key={`tcol-0-${submission.id}`}>
      <div className="card">
        <div className="card-body">
          <strong className="card-title">
            {getSubmissionData(submission, columns.first())}
          </strong>
          <p className="card-text">
            {columns.map((innerColumn, innerIndex) => {
              const innerRowData = getSubmissionData(submission, innerColumn);
              return (
                innerIndex !== 0 && (
                  <Fragment key={`tcol-mobile-${innerIndex}`}>
                    <span>
                      <strong>
                        <I18n>{innerColumn.label}</I18n>:
                      </strong>{' '}
                      {innerRowData}
                    </span>
                    <br />
                  </Fragment>
                )
              );
            })}
          </p>
          <div className="btn-group" role="group" aria-label="Actions">
            <Link to={to} className="btn btn-primary">
              <I18n>View</I18n>
            </Link>
          </div>
        </div>
      </div>
    </td>
  </tr>
);

const TableSubmissionColumn = ({ shouldLink, to, label }) => (
  <td className="d-none d-md-table-cell">
    {shouldLink ? <Link to={to}>{label}</Link> : <span>{label}</span>}
  </td>
);

const TableSubmissionRow = ({
  columns,
  submission,
  to,
  openDropdown,
  toggleDropdown,
}) => (
  <tr>
    {columns.map((column, index) => (
      <TableSubmissionColumn
        key={`tcol-${index}-${submission.id}`}
        shouldLink={index === 0}
        to={to}
        label={getSubmissionData(submission, column)}
      />
    ))}
    <td>
      <Link to={to} title="View submission">
        <I18n>View</I18n>
      </Link>
    </td>
  </tr>
);

const SubmissionListItemComponent = ({
  submission,
  columns,
  form,
  handleClone,
  handleDelete,
  openDropdown,
  toggleDropdown,
  isMobile,
  to,
}) =>
  isMobile ? (
    <MobileSubmissionCard
      submission={submission}
      columns={columns}
      to={`submissions/${submission.id}`}
    />
  ) : (
    <TableSubmissionRow
      columns={columns}
      submission={submission}
      to={`submissions/${submission.id}`}
      openDropdown={openDropdown}
      toggleDropdown={toggleDropdown}
    />
  );

const getSubmissionData = (submission, column) =>
  column.type === 'value'
    ? submission.values[column.name]
    : column.name.includes('At')
      ? moment(submission[column.name]).format(Constants.TIME_FORMAT)
      : submission[column.name];

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const SubmissionListItem = compose(
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
)(SubmissionListItemComponent);
