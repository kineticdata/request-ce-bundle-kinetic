import React from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

export const TaskHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <div>
      <h1>
        {activity.label}
        <span className="status status-green">{data.Status}</span>
      </h1>
    </div>
  );
};

export const TaskBody = ({ activity }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>Created</dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="col">
          <dl>
            <dt>Updated</dt>
            <dd>
              <TimeAgo timestamp={activity.updatedAt} />
            </dd>
          </dl>
        </div>
        {(data['Assigned Team'] || data['Assigned Individual']) && (
          <div className="col">
            <dl>
              <dt>Assignee</dt>
              <dd>
                {data['Assigned Team'] && data['Assigned Individual']
                  ? `${data['Assigned Team']} > ${data['Assigned Individual']}`
                  : data['Assigned Team'] || data['Assigned Individual']}
              </dd>
            </dl>
          </div>
        )}
        {data.Comments && (
          <div className="col">
            <dl>
              <dt>Comments</dt>
              <dd>{data.Comments}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};
