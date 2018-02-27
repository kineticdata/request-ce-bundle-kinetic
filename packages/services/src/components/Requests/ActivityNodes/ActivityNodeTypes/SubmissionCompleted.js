import React from 'react';
import { TimeAgo } from '../../../TimeAgo';
import { activityData } from '../../RequestActivityList';

export const SubmissionCompletedHeader = ({ activity }) => {
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

export const SubmissionCompletedBody = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>Closed</dt>
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
