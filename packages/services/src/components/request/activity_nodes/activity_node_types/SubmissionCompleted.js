import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

export const SubmissionCompletedHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <h1>
        {activity.label}
        <span
          className={`status anotherClass ${
            data.Status ? 'status--green' : 'status--gray'
          }`}
        >
          {data.Status || 'Complete'}
        </span>
      </h1>
    </Fragment>
  );
};

export const SubmissionCompletedBody = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <div className="data-list-row">
        <div className="data-list-row__col">
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
        <div className="data-list-row">
          <div className="data-list-row__col">
            <span>{data.Comments}</span>
          </div>
        </div>
      )}
    </Fragment>
  );
};
