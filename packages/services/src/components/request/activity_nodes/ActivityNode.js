import React from 'react';
import { ApprovalHeader, ApprovalBody } from './activity_node_types/Approval';
import { DefaultHeader, DefaultBody } from './activity_node_types/Default';
import {
  SubmissionCompletedHeader,
  SubmissionCompletedBody,
} from './activity_node_types/SubmissionCompleted';
import {
  SubmissionSubmittedHeader,
  SubmissionSubmittedBody,
} from './activity_node_types/SubmissionSubmitted';
import { TaskHeader, TaskBody } from './activity_node_types/Task';

// Helper to get the correct header component given the activity type.
export const getActivityNodeHeader = activityType => {
  switch (activityType) {
    case 'Approval':
      return ApprovalHeader;
    case 'Submission Completed':
      return SubmissionCompletedHeader;
    case 'Submission Submitted':
      return SubmissionSubmittedHeader;
    case 'Task':
      return TaskHeader;
    default:
      return DefaultHeader;
  }
};

// Helper to get the correct body component given the activity type.
export const getActivityNodeBody = activityType => {
  switch (activityType) {
    case 'Approval':
      return ApprovalBody;
    case 'Submission Completed':
      return SubmissionCompletedBody;
    case 'Submission Submitted':
      return SubmissionSubmittedBody;
    case 'Task':
      return TaskBody;
    default:
      return DefaultBody;
  }
};

export const ActivityNode = props => {
  const ActivityNodeHeader = getActivityNodeHeader(props.activity.type);
  const ActivityNodeBody = getActivityNodeBody(props.activity.type);
  return (
    <li>
      <div className="card card--timeline">
        <span className="card--timeline__circle" />
        <ActivityNodeHeader {...props} />
        <ActivityNodeBody {...props} />
      </div>
    </li>
  );
};
