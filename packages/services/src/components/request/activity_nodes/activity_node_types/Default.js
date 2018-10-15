import React, { Fragment } from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

const ActivityDataItem = ({ label, value }) => (
  <dl>
    <dt>{label !== 'STRING' && <span className={'title'}>{label}</span>}</dt>
    <dd>{value}</dd>
  </dl>
);

export const DefaultHeader = ({ activity }) => <h1>{activity.label}</h1>;

export const DefaultBody = ({ activity }) => {
  const data = activityData(activity);
  return (
    <Fragment>
      <div className="data-list-row">
        <div className="data-list-row__col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" /> Created
            </dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="data-list-row__col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" /> Updated
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
