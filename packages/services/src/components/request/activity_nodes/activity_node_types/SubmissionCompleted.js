import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';
import { I18n } from '@kineticdata/react';

export const SubmissionCompletedHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <div className="card-title">
        <I18n>{activity.label}</I18n>
        <span
          className={`status anotherClass ${
            data.Status ? 'status--success' : 'status--default'
          }`}
        >
          <I18n>{data.Status || 'Complete'}</I18n>
        </span>
      </div>
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
              <span className="fa fa-fw fa-calendar" />
              <I18n>Closed</I18n>
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
            <span>
              <I18n>{data.Comments}</I18n>
            </span>
          </div>
        </div>
      )}
    </Fragment>
  );
};
