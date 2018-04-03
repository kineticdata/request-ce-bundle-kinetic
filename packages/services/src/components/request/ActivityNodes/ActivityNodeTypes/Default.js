import React from 'react';
import { TimeAgo } from 'common';
import { activityData } from '../../RequestActivityList';

const ActivityDataItem = ({ label, value }) => (
  <div>
    {label !== 'STRING' && <span className={'title'}>{label}</span>}
    <span>{value}</span>
  </div>
);

export const DefaultHeader = ({ activity }) => <h1>{activity.label}</h1>;

export const DefaultBody = ({ activity }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />
              <span>Created</span>
            </dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="col">
          <dl>
            <dt>
              <span className="fa fa-fw fa-calendar" />
              <span>Updated</span>
            </dt>
            <dd>
              <TimeAgo timestamp={activity.updatedAt} />
            </dd>
          </dl>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {Object.keys(data)
            // map to a list of objects with label, value, and key properties
            .map(key => ({ key, label: key, value: data[key] }))
            // filter out keys with falsey values
            .filter(({ value }) => value)
            .map(props => <ActivityDataItem {...props} />)}
        </div>
      </div>
    </div>
  );
};
