export const actionTypes = (prefix = '') => {
  return new Proxy(
    {},
    {
      get(target, name) {
        return `${prefix}${name}`;
      },
    },
  );
};

export const zip = (array1, array2) =>
  array1.reduce(
    (reduction, key, i) => ({ ...reduction, [key]: array2[i] }),
    {},
  );

export const withPayload = (type, ...names) => (...data) =>
  names.length === 0
    ? { type, payload: data[0] }
    : { type, payload: zip(names, data) };
