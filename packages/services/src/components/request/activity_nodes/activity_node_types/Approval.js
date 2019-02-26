import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';
import { I18n } from '../../../../../../app/src/I18nProvider';

const getStatusColor = status =>
  status === 'In Progress'
    ? 'status-yellow'
    : status === 'Denied'
      ? 'status-red'
      : 'status--green';

export const ApprovalHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <h1>
        <I18n>{activity.label}</I18n>
        <span className={`status ${getStatusColor(data.Status)}`}>
          <I18n>{data.Status}</I18n>
        </span>
      </h1>
    </Fragment>
  );
};

export const ApprovalBody = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <div className="data-list-row">
        <div className="data-list-row__col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />
              <I18n>Created</I18n>
            </dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="data-list-row__col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />
              <I18n>Updated</I18n>
            </dt>
            <dd>
              <TimeAgo timestamp={activity.updatedAt} />
            </dd>
          </dl>
        </div>
      </div>
      <div className="data-list-row">
        {(data['Assigned Team'] || data['Assigned Individual']) && (
          <div className="data-list-row__col">
            <dl>
              <dt>
                <span className="fa fa-fw fa-user" />
                <I18n>Approver</I18n>
              </dt>
              <dd>
                {data['Assigned Team'] && data['Assigned Individual']
                  ? `${data['Assigned Team']} > ${data['Assigned Individual']}`
                  : data['Assigned Team'] || data['Assigned Individual']}
              </dd>
            </dl>
          </div>
        )}
        {data.Status !== 'In Progress' &&
          data.Decision && (
            <div className="data-list-row__col">
              <dl>
                <dt>
                  <span className="fa fa-fw fa-code-fork" />
                  <I18n>Decision</I18n>
                </dt>
                <dd>
                  <I18n>{data.Decision}</I18n>
                </dd>
              </dl>
            </div>
          )}
        {data.Status === 'Denied' &&
          data['Denial Reason'] && (
            <div className="data-list-row__col">
              <dl>
                <dt>
                  <span className="fa fa-fw fa-window-close" />
                  <I18n>Denial Reason</I18n>
                </dt>
                <dd>{data['Denial Reason']}</dd>
              </dl>
            </div>
          )}
        {data.Comments && (
          <div className="data-list-row__col">
            <dl>
              <dt>
                <span className="fa fa-fw fa-comment" />
                <I18n>Comments</I18n>
              </dt>
              <dd>{data.Comments}</dd>
            </dl>
          </div>
        )}
      </div>
    </Fragment>
  );
};
