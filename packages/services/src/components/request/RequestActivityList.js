import React from 'react';
import { ActivityNode } from './ActivityNodes/ActivityNode';
import { EmptyNode } from './ActivityNodes/EmptyNode';
import { EndNode } from './ActivityNodes/EndNode';
import { InProgressNode } from './ActivityNodes/InProgressNode';
import { StartNode } from './ActivityNodes/StartNode';

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
);
