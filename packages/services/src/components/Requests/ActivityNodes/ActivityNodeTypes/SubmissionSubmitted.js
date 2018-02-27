import React from 'react';
import { TimeAgo } from '../../../TimeAgo';
import { activityData } from '../../RequestActivityList';

export const SubmissionSubmittedHeader = ({ activity, submission }) => (
  <h1>
    {activity.label}
    <TimeAgo timestamp={submission.submittedAt} />
  </h1>
);

export const SubmissionSubmittedBody = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>Submitted</dt>
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
