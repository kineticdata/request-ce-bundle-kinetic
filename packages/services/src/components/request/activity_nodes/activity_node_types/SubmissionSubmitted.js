import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';
import { I18n } from '@kineticdata/react';

export const SubmissionSubmittedHeader = ({ activity, submission }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <h1>
        <I18n>{activity.label}</I18n>
        <span className="status status--green">
          <I18n>{data.Status || 'Submitted'}</I18n>
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
              <span className="fa fa-fw fa-calendar" />
              <I18n>Submitted</I18n>
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
            <p>
              <I18n>{data.Comments}</I18n>
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
};
