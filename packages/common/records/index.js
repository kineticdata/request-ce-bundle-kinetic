import { Record } from 'immutable';

export const Profile = Record({
  displayName: '',
  username: '',
  email: '',
});

export const DatastoreSubmission = Record({
  activities: [],
  coreState: null,
  createdAt: null,
  createdBy: null,
  form: null,
  handle: null,
  id: null,
  submittedAt: null,
  submittedBy: null,
  updatedAt: null,
  updatedBy: null,
  values: {},
});
