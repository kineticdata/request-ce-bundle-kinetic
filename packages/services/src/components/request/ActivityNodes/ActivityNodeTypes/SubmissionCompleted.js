import React from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

export const SubmissionCompletedHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <div>
      <h1>
        {activity.label}
        <span className="status status-green">{data.Status || 'Complete'}</span>
      </h1>
    </div>
  );
};

export const SubmissionCompletedBody = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />Closed
            </dt>
            <dd>
              <TimeAgo timestamp={submission.closedAt} />
            </dd>
          </dl>
        </div>
      </div>
      {data.Comments && (
        <div className="row">
          <div className="col">
            <span>{data.Comments}</span>
          </div>
        </div>
      )}
    </div>
  );
};
