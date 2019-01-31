import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { compose, withHandlers, withState } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import moment from 'moment';

import { Constants } from 'common';
import { I18n } from '../../../../../app/src/I18nProvider';

const DiscussionIcon = () => (
  <span className="icon">
    <span
      className="fa fa-fw fa-comments"
      style={{
        color: 'rgb(9, 84, 130)',
        fontSize: '16px',
      }}
    />
  </span>
);

const MobileSubmissionCard = ({ submission, columns, to }) => (
  <tr>
    <td
      scope="row"
      className="d-md-none d-table-cell"
      key={`tcol-0-${submission.id}`}
    >
      <div className="card">
        <div className="card-body">
          <strong className="card-title">
            {showDiscussionIcon(submission, columns.first()) ? (
              <DiscussionIcon />
            ) : (
              getSubmissionData(submission, columns.first())
            )}
          </strong>
          <p className="card-text">
            {columns.map((innerColumn, innerIndex) => {
              const innerRowData = getSubmissionData(submission, innerColumn);
              const isDiscussionIdField =
                innerColumn.name === 'Discussion Id' ? true : false;
              return (
                innerIndex !== 0 && (
                  <Fragment key={`tcol-mobile-${innerIndex}`}>
                    {isDiscussionIdField ? (
                      <DiscussionIcon />
                    ) : (
                      <span>
                        <strong>
                          <I18n>{innerColumn.label}</I18n>:
                        </strong>{' '}
                        {innerRowData}
                      </span>
                    )}
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

const TableSubmissionColumn = ({ shouldLink, to, label, discussionIcon }) => (
  <td className="d-none d-md-table-cell">
    {shouldLink ? (
      <Link to={to}>{discussionIcon ? <DiscussionIcon /> : label}</Link>
    ) : discussionIcon ? (
      <DiscussionIcon />
    ) : (
      <span>{label}</span>
    )}
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
        discussionIcon={showDiscussionIcon(submission, column)}
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
    <MobileSubmissionCard submission={submission} columns={columns} to={to} />
  ) : (
    <TableSubmissionRow
      columns={columns}
      submission={submission}
      to={to}
      openDropdown={openDropdown}
      toggleDropdown={toggleDropdown}
    />
  );

const showDiscussionIcon = (submission, column) =>
  column.type === 'value' &&
  column.name === 'Discussion Id' &&
  submission.values['Discussion Id']
    ? true
    : false;

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
