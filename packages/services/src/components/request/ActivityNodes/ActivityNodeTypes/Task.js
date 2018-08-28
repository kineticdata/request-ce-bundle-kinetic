import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

export const TaskHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <h1>
        {activity.label}
        <span
          className={`status ${
            data.Status === 'Complete' ? 'status--gray' : 'status--green'
          }`}
        >
          {data.Status}
        </span>
      </h1>
    </Fragment>
  );
};

export const TaskBody = ({ activity }) => {
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
        {(data['Assigned Team'] || data['Assigned Individual']) && (
          <div className="data-list-row__col">
            <dl>
              <dt>
                <span className="fa fa-fw fa-user" />Assignee
              </dt>
              <dd>
                {data['Assigned Team'] && data['Assigned Individual']
                  ? `${data['Assigned Team']} > ${data['Assigned Individual']}`
                  : data['Assigned Team'] || data['Assigned Individual']}
              </dd>
            </dl>
          </div>
        )}
        {data.Comments && (
          <div className="data-list-row__col">
            <dl>
              <dt>Comments</dt>
              <dd>{data.Comments}</dd>
            </dl>
          </div>
        )}
      </div>
    </Fragment>
  );
};
