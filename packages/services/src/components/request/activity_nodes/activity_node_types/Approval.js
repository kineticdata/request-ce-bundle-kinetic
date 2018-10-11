import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

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
        {activity.label}
        <span className={`status ${getStatusColor(data.Status)}`}>
          {data.Status}
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
              <span className="fa fa-fw fa-calendar" />Created
            </dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="data-list-row__col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />Updated
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
                <span className="fa fa-fw fa-user" />Approver
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
                  <span className="fa fa-fw fa-code-fork" />Decision
                </dt>
                <dd>{data.Decision}</dd>
              </dl>
            </div>
          )}
        {data.Status === 'Denied' &&
          data['Denial Reason'] && (
            <div className="data-list-row__col">
              <dl>
                <dt>
                  <span className="fa fa-fw fa-window-close" />Denial Reason
                </dt>
                <dd>{data['Denial Reason']}</dd>
              </dl>
            </div>
          )}
        {data.Comments && (
          <div className="data-list-row__col">
            <dl>
              <dt>
                <span className="fa fa-fw fa-comment" />Comments
              </dt>
              <dd>{data.Comments}</dd>
            </dl>
          </div>
        )}
      </div>
    </Fragment>
  );
};
