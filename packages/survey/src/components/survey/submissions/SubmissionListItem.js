import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { compose, withHandlers, withState } from 'recompose';
import moment from 'moment';
import { Constants } from 'common';
import { I18n } from '@kineticdata/react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

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

const MobileSubmissionCard = ({ submission, columns, path }) => (
  <tr>
    <td className="d-md-none d-table-cell" key={`tcol-0-${submission.id}`}>
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
            <Link to={`${path}/${submission.id}`} className="btn btn-primary">
              <I18n>View</I18n>
            </Link>
            {submission.coreState === 'Draft' && (
              <button
                onClick={console.log('resend invitation')}
                className="btn btn-success"
              >
                <I18n>Resend Invitation</I18n>
              </button>
            )}
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
  path,
  openDropdown,
  toggleDropdown,
}) => (
  <tr>
    {columns.map((column, index) => (
      <TableSubmissionColumn
        key={`tcol-${index}-${submission.id}`}
        shouldLink={index === 0}
        to={`${path}/${submission.id}`}
        label={getSubmissionData(submission, column)}
        discussionIcon={showDiscussionIcon(submission, column)}
      />
    ))}
    <td>
      <Dropdown
        toggle={toggleDropdown(submission.id)}
        isOpen={openDropdown === submission.id}
      >
        <DropdownToggle color="link" className="btn-sm">
          <span className="fa fa-ellipsis-h fa-2x" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem tag={Link} to={`${path}/${submission.id}`}>
            <I18n>View</I18n>
          </DropdownItem>
          {submission.coreState === 'Draft' && (
            <button
              onClick={() => console.log('resend invitation')}
              className="dropdown-item"
            >
              <I18n>Resend Invitation</I18n>
            </button>
          )}
        </DropdownMenu>
      </Dropdown>
    </td>
  </tr>
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

const SubmissionListItemComponent = ({
  submission,
  columns,
  form,
  path,
  isMobile,
  openDropdown,
  toggleDropdown,
}) =>
  isMobile ? (
    <MobileSubmissionCard
      submission={submission}
      columns={columns}
      path={path}
    />
  ) : (
    <TableSubmissionRow
      columns={columns}
      submission={submission}
      path={path}
      openDropdown={openDropdown}
      toggleDropdown={toggleDropdown}
    />
  );

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const SubmissionListItem = compose(
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    toggleDropdown,
  }),
)(SubmissionListItemComponent);
