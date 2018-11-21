import React from 'react';
import { ActivityNode } from './activity_nodes/ActivityNode';
import { EmptyNode } from './activity_nodes/EmptyNode';
import { EndNode } from './activity_nodes/EndNode';
import { InProgressNode } from './activity_nodes/InProgressNode';
import { StartNode } from './activity_nodes/StartNode';

// Attempts to parse the activities data property as JSON, if successful it
// returns that otherwise it returns the string value wrapped in an object.
export const activityData = activity => {
  try {
    return JSON.parse(activity.data);
  } catch (e) {
    return { STRING: activity.data };
  }
};

export const RequestActivityList = ({ submission }) => (
  <div className="submission-timeline">
    <ul>
      {submission.submittedAt ? (
        <StartNode timestamp={submission.submittedAt} label="Started" />
      ) : (
        <StartNode timestamp={submission.createdAt} label="Created" />
      )}
      {submission.activities
        .map(activity => ({ activity, submission, key: activity.id }))
        .map(props => <ActivityNode {...props} />)}
      {submission.activities.length === 0 && <EmptyNode />}
      {submission.closedAt ? (
        <EndNode timestamp={submission.closedAt} />
      ) : (
        <InProgressNode />
      )}
    </ul>
  </div>
);
