import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

export const SubmissionSubmittedHeader = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <h1>
        {activity.label}
        <span className="status status--green">
          {data.Status || 'Submitted'}
        </span>
      </h1>
    </Fragment>
  );
};

export const SubmissionSubmittedBody = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <div className="data-list-row">
        <div className="data-list-row__col">
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
        <div className="data-list-row">
          <div className="data-list-row__col">
            <p>{data.Comments}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
};
