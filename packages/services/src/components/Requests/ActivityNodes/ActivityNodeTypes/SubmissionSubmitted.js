import React from 'react';
import { TimeAgo } from '../../../TimeAgo';
import { activityData } from '../../RequestActivityList';

export const SubmissionSubmittedHeader = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <div>
      <h1>
        {activity.label}
        <span className="status status-green">
          {data.Status || 'Submitted'}
        </span>
      </h1>
    </div>
  );
};

export const SubmissionSubmittedBody = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />Submitted
            </dt>
            <dd>
              <TimeAgo timestamp={submission.submittedAt} />
            </dd>
          </dl>
        </div>
      </div>
      {data.Comments && (
        <div className="row">
          <div className="col">
            <p>{data.Comments}</p>
          </div>
        </div>
      )}
    </div>
  );
};
