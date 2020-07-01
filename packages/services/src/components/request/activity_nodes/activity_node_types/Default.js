import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';
import { I18n } from '@kineticdata/react';

const ActivityDataItem = ({ label, value }) => (
  <dl>
    <dt>
      {label !== 'STRING' && (
        <span className={'title'}>
          <I18n>{label}</I18n>
        </span>
      )}
    </dt>
    <dd>
      <I18n>{value}</I18n>
    </dd>
  </dl>
);

export const DefaultHeader = ({ activity }) => (
  <div className="card--title">{activity.label}</div>
);

export const DefaultBody = ({ activity }) => {
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
      </div>
      <div className="data-list-row">
        <div className="data-list-row__col">
          {Object.keys(data)
            // map to a list of objects with label, value, and key properties
            .map(key => ({ key, label: key, value: data[key] }))
            // filter out keys with falsey values
            .filter(({ value }) => value)
            .map(props => <ActivityDataItem {...props} />)}
        </div>
      </div>
    </Fragment>
  );
};
