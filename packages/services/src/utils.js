import moment from 'moment';
import { Utils } from 'common';
import * as constants from './constants';
import { selectCurrentKapp } from 'app/src/redux/selectors';

export const getDueDate = (submission, attrName) => {
  const daysDue = Utils.getConfig({ submission, name: attrName });
  if (!daysDue) {
    throw new Error(`getDueDate failed because "${attrName}" was not set.`);
  }
  const daysDueNumber = parseInt(daysDue, 10);
  if (!daysDueNumber) {
    throw new Error(
      `getDueDate failed because value of "${attrName}" (${daysDue}) is not a number`,
    );
  }
  return submission.submittedAt
    ? moment(submission.submittedAt).add(daysDueNumber, 'days')
    : null;
};

export const getDurationInDays = (start, end) =>
  Math.round(moment(end).diff(start, 'days', true) * 10) / 10;

export const getStatus = submission => {
  if (!submission.values) {
    throw new Error(
      'getStatus failed because values were not included on ' +
        'the submission.',
    );
  }
  return submission.values[constants.STATUS_FIELD] || submission.coreState;
};

export const getRequester = submission => {
  if (!submission.values) {
    throw new Error(
      'getRequester failed because values were not included on ' +
        'the submission.',
    );
  }
  return (
    submission.values[constants.REQUESTED_BY_FIELD] || submission.submittedBy
  );
};

export const getStatusClass = ({ values, form, coreState }) => {
  if (
    !values ||
    !form ||
    !form.attributes ||
    !form.kapp ||
    !form.kapp.attributes
  ) {
    throw new Error(
      'getStatusClass failed because the submission did not ' +
        'have the required includes (values,form.attributes,form.kapp.attributes)',
    );
  }
  const statusFieldValue = values[constants.STATUS_FIELD];
  if (statusFieldValue) {
    const activeStatuses = Utils.getAttributeValues(
      form,
      constants.STATUSES_ACTIVE,
      Utils.getAttributeValues(form.kapp, constants.STATUSES_ACTIVE, []),
    );
    const inactiveStatuses = Utils.getAttributeValues(
      form,
      constants.STATUSES_INACTIVE,
      Utils.getAttributeValues(form.kapp, constants.STATUSES_INACTIVE, []),
    );
    const cancelledStatuses = Utils.getAttributeValues(
      form,
      constants.STATUSES_CANCELLED,
      Utils.getAttributeValues(form.kapp, constants.STATUSES_CANCELLED, []),
    );
    if (activeStatuses.includes(statusFieldValue)) {
      return constants.SUCCESS_LABEL_CLASS;
    } else if (inactiveStatuses.includes(statusFieldValue)) {
      return constants.WARNING_LABEL_CLASS;
    } else if (cancelledStatuses.includes(statusFieldValue)) {
      return constants.DANGER_LABEL_CLASS;
    } else {
      return constants.DEFAULT_LABEL_CLASS;
    }
  } else {
    switch (coreState) {
      case constants.CORE_STATE_DRAFT:
        return constants.WARNING_LABEL_CLASS;
      case constants.CORE_STATE_SUBMITTED:
        return constants.SUCCESS_LABEL_CLASS;
      default:
        return constants.DEFAULT_LABEL_CLASS;
    }
  }
};

export const getSubmissionPath = (submission, mode, listType) => {
  return [
    '/requests',
    listType,
    'request',
    submission.id,
    mode ||
      (submission.coreState === constants.CORE_STATE_DRAFT ? '' : 'activity'),
  ]
    .filter(s => !!s)
    .join('/');
};

export const getCommentFormConfig = (kappSlug, submissionId) => ({
  ...constants.COMMENT_FORM_CONFIG,
  kappSlug,
  values: { [constants.RELATED_SUBMISSION_ID_FIELD]: submissionId },
});

export const getCancelFormConfig = (kappSlug, submissionId) => ({
  ...constants.CANCEL_FORM_CONFIG,
  kappSlug,
  values: { [constants.RELATED_SUBMISSION_ID_FIELD]: submissionId },
});

export const getFeedbackFormConfig = (kappSlug, submissionId) => ({
  ...constants.FEEDBACK_FORM_CONFIG,
  kappSlug,
  values: { [constants.REFERRING_ID_FIELD]: submissionId },
});

export const displayableFormPredicate = form =>
  form.type === 'Service' && form.status === 'Active';
