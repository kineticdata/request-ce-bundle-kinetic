import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';
import { I18n } from '../../../../../../app/src/I18nProvider';

export const TaskHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <h1>
        <I18n>{activity.label}</I18n>
        <span
          className={`status ${
            data.Status === 'Complete'
              ? 'status--gray'
              : data.Status === 'In Progress'
                ? 'status--yellow'
                : 'status--green'
          }`}
        >
          <I18n>{data.Status}</I18n>
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
              <span className="fa fa-fw fa-calendar" />
              <I18n>Created</I18n>
            </dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="data-list-row__col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />
              <I18n>Updated</I18n>
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
                <span className="fa fa-fw fa-user" />
                <I18n>Assignee</I18n>
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
              <dt>
                <I18n>Comments</I18n>
              </dt>
              <dd>{data.Comments}</dd>
            </dl>
          </div>
        )}
      </div>
    </Fragment>
  );
};
