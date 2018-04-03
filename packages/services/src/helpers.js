import isarray from 'isarray';
import moment from 'moment';
import * as constants from './constants';

/**
 * Given a model and an attribute name returns the value of that attribute.
 * Should return undefined if attributes are missing or there is no attribute
 * value for the given attrName. It supports both attribute structures (arrays
 * that are returned directly from the API and objects that are returned by the
 * helpers in react-kinetic-core).
 *
 * @param model: { attributes }
 * @param attrName
 * @param defaultValue
 */
export const getAttributeValue = ({ attributes }, attrName, defaultValue) =>
  (isarray(attributes)
    ? attributes.filter(a => a.name === attrName).map(a => a.values[0])[0]
    : attributes && attributes[attrName] && attributes[attrName][0]) ||
  defaultValue;

export const getAttributeValues = ({ attributes }, attrName, defaultValue) => {
  const valuesArray = isarray(attributes)
    ? attributes.filter(a => a.name === attrName).map(a => a.values)[0]
    : attributes && attributes[attrName] && attributes[attrName];
  return !valuesArray || valuesArray.length === 0 ? defaultValue : valuesArray;
};

const getSpaceConfig = (space, name, val) => {
  if (!space) {
    throw new Error(
      'getConfig did not receive space, it must be included on ' +
        'the kapp or manually passed.',
    );
  }
  if (!space.attributes) {
    throw new Error('getConfig failed, space must include attributes.');
  }
  // If the space has a value for the desired attribute return it otherwise
  // return the default value.
  return getAttributeValue(space, name, val);
};

const getKappConfig = (kapp, space, name, val) => {
  if (!kapp) {
    throw new Error(
      'getConfig did not receive kapp, it must be included on ' +
        'the form or manually passed.',
    );
  } else if (!kapp.attributes) {
    throw new Error('getConfig failed, kapp must include attributes');
  }
  // If the kapp has a value for the desired attribute return it otherwise
  // check the space.
  return (
    getAttributeValue(kapp, name) ||
    getSpaceConfig(space || kapp.space, name, val)
  );
};

const getFormConfig = (form, kapp, space, name, val) => {
  if (!form) {
    throw new Error(
      'getConfig did not receive form, it must be included on ' +
        'the submission or manually passed.',
    );
  } else if (!form.attributes) {
    throw new Error('getConfig failed, form must include attributes');
  }
  // If the form has a value for the desired attribute return it otherwise
  // the default value.
  return (
    getAttributeValue(form, name) ||
    getKappConfig(kapp || form.kapp, space, name, val)
  );
};

const getSubmissionConfig = (submission, form, kapp, space, name, def) => {
  if (!submission.values) {
    throw new Error(
      'Cannot perform getConfig when submission does not include values.',
    );
  }
  return (
    submission.values[name] ||
    getFormConfig(form || submission.form, kapp, space, name, def)
  );
};

/**
 * Given a model (via the submission / form / kapp / space options) will look
 * the given configuration value (values on a submission and attribute values on
 * the others). If not found on the present model it will propagate upwards
 * until it is found otherwise it will return an option default or undefined.
 *
 * @param name
 * @param defaultValue
 * @param submission
 * @param form
 * @param kapp
 * @param space
 */
export const getConfig = ({
  name,
  defaultValue,
  submission,
  form,
  kapp,
  space,
}) => {
  if (submission) {
    return getSubmissionConfig(
      submission,
      form,
      kapp,
      space,
      name,
      defaultValue,
    );
  } else if (form) {
    return getFormConfig(form, kapp, space, name, defaultValue);
  } else if (kapp) {
    return getKappConfig(kapp, space, name, defaultValue);
  } else if (space) {
    return getSpaceConfig(space, name, defaultValue);
  } else {
    throw new Error(
      'getConfig must be called with at least one of: ' +
        'submission, form, kapp, space.',
    );
  }
};

export const getDueDate = (submission, attrName) => {
  const daysDue = getConfig({ submission, name: attrName });
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
    const activeStatuses = getAttributeValues(
      form,
      constants.STATUSES_ACTIVE,
      getAttributeValues(form.kapp, constants.STATUSES_ACTIVE, []),
    );
    const inactiveStatuses = getAttributeValues(
      form,
      constants.STATUSES_INACTIVE,
      getAttributeValues(form.kapp, constants.STATUSES_INACTIVE, []),
    );
    const cancelledStatuses = getAttributeValues(
      form,
      constants.STATUSES_CANCELLED,
      getAttributeValues(form.kapp, constants.STATUSES_CANCELLED, []),
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

export const getCommentFormConfig = submissionId => ({
  ...constants.COMMENT_FORM_CONFIG,
  values: { [constants.RELATED_SUBMISSION_ID_FIELD]: submissionId },
});

export const getCancelFormConfig = submissionId => ({
  ...constants.CANCEL_FORM_CONFIG,
  values: { [constants.RELATED_SUBMISSION_ID_FIELD]: submissionId },
});

export const getFeedbackFormConfig = submissionId => ({
  ...constants.FEEDBACK_FORM_CONFIG,
  values: { [constants.REFERRING_ID_FIELD]: submissionId },
});

export const displayableFormPredicate = form =>
  form.type === 'Service' && form.status === 'Active';
