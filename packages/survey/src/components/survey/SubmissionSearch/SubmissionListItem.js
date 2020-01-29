import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import moment from 'moment';
import { Constants } from 'common';
import { I18n } from '@kineticdata/react';

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

const TableSubmissionRow = ({ columns, submission, path }) => (
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

export const SubmissionListItem = ({
  submission,
  columns,
  form,
  path,
  isMobile,
}) =>
  isMobile ? (
    <MobileSubmissionCard
      submission={submission}
      columns={columns}
      path={path}
    />
  ) : (
    <TableSubmissionRow columns={columns} submission={submission} path={path} />
  );
