import isarray from 'isarray';
import { all, fork } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

export const zip = (array1, array2) =>
  array1.reduce(
    (reduction, key, i) => ({ ...reduction, [key]: array2[i] }),
    {},
  );

// Parameterize this for 'kapp' in addition to category.
export const namespace = (category, action) =>
  `@kd/common/${category}/${action}`;
export const noPayload = type => () => ({ type });
export const withPayload = (type, ...names) => (...data) =>
  names.length === 0
    ? { type, payload: data[0] }
    : { type, payload: zip(names, data) };

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}

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

export const isMemberOf = (profile, name) => {
  const matchingMembership = profile.memberships.find(
    membership => membership.team.name === name,
  );
  return matchingMembership !== undefined;
};

export const isMemberOfDescendant = (profile, name) => {
  const matchingMembership = profile.memberships.find(membership =>
    membership.team.name.startsWith(`${name}::`),
  );
  return matchingMembership !== undefined;
};

export const getTeams = profile => {
  const matchingMemberships = profile.memberships.filter(
    membership =>
      membership.team.name !== 'Role' &&
      !membership.team.name.startsWith('Role::'),
  );
  return matchingMemberships
    ? matchingMemberships.map(membership => membership.team)
    : [];
};

export const getRoles = profile => {
  const matchingMemberships = profile.memberships.filter(membership =>
    membership.team.name.startsWith('Role::'),
  );
  return matchingMemberships
    ? matchingMemberships.map(membership => membership.team)
    : [];
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

export const recordSearch = (kappSlug, query, results) => {
  CoreAPI.createSubmission({
    datastore: true,
    formSlug: 'search-results',
    values: {
      'Kapp Slug': kappSlug,
      Query: query,
      'Search Results': results,
    },
  });
};
