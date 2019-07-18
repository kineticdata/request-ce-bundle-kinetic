import { createSubmission } from '@kineticdata/react';

export const ACTIONS_FORM_SLUG = 'actions';

export const createAction = ({
  action,
  type,
  operation,
  relatedId,
  jsonInput,
  displayText,
  successCallback,
  errorCallback,
}) =>
  createSubmission({
    datastore: true,
    formSlug: ACTIONS_FORM_SLUG,
    values: {
      Action: action,
      Type: type,
      Operation: operation,
      'Related Id': relatedId,
      'JSON Input': jsonInput,
      'Display Text': displayText,
    },
    completed: true,
  }).then(({ submission, error }) => {
    if (error) {
      if (typeof errorCallback === 'function') {
        errorCallback(error);
      }
    } else {
      if (typeof successCallback === 'function') {
        successCallback(submission);
      }
    }
  });
