import React from 'react';
import { TimeAgo } from '../../../TimeAgo';
import { activityData } from '../../RequestActivityList';

export const ApprovalHeader = ({ activity }) => {
  const data = activityData(activity);
  return (
    <div>
      <h1>
        {activity.label}
        <span className="status status-green">{data.Status}</span>
      </h1>
    </div>
  );
};

export const ApprovalBody = ({ activity }) => {
  const data = activityData(activity);
  return (
    <div>
      <div className="row">
        <div className="col">
          <dl>
            <dt>Created</dt>
            <dd>
              <TimeAgo timestamp={activity.createdAt} />
            </dd>
          </dl>
        </div>
        <div className="col">
          <dl>
            <dt>Updated</dt>
            <dd>
              <TimeAgo timestamp={activity.updatedAt} />
            </dd>
          </dl>
        </div>
      </div>
      <div className="row">
        {(data['Assigned Team'] || data['Assigned Individual']) && (
          <div className="col">
            <dl>
              <dt>Approver</dt>
              <dd>
                {data['Assigned Team'] && data['Assigned Individual']
                  ? `${data['Assigned Team']} > ${data['Assigned Individual']}`
                  : data['Assigned Team'] || data['Assigned Individual']}
              </dd>
            </dl>
          </div>
        )}
        {data.Status !== 'In Progress' &&
          data.Decision && (
            <div className="col">
              <dl>
                <dt>Decision</dt>
                <dd>{data.Decision}</dd>
              </dl>
            </div>
          )}
        {data.Status === 'Denied' &&
          data['Denial Reason'] && (
            <div className="col">
              <dl>
                <dt>Denial Reason</dt>
                <dd>{data['Denial Reason']}</dd>
              </dl>
            </div>
          )}
        {data.Comments && (
          <div className="col">
            <dl>
              <dt>Comments</dt>
              <dd>{data.Comments}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};
