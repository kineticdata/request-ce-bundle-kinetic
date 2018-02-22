import { all, fork } from 'redux-saga/effects';

export const zip = (array1, array2) =>
  array1.reduce(
    (reduction, key, i) => ({ ...reduction, [key]: array2[i] }),
    {},
  );

// Parameterize this for 'kapp' in addition to category.
export const namespace = (category, action) =>
  `@kd/kinops/home/${category}/${action}`;
export const noPayload = type => () => ({ type });
// export const withPayload = (type, ...names) => (...data) =>
//   names.length === 0
//     ? { type, payload: data[0] }
//     : { type, payload: zip(names, data) };
export const withPayload = type => payload => ({ type, payload });

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}
