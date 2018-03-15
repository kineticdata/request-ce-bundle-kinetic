export const zip = (array1, array2) =>
  array1.reduce(
    (reduction, key, i) => ({ ...reduction, [key]: array2[i] }),
    {},
  );

export const namespace = (category, action) =>
  `@kd/kinops/queue/${category}/${action}`;
export const noPayload = type => () => ({ type });
export const withPayload = (type, ...names) => (...data) =>
  names.length === 0
    ? { type, payload: data[0] }
    : { type, payload: zip(names, data) };

export const getAttributeValue = (value, defaultValue, ...sources) => {
  const best = sources.find(
    source =>
      source.attributes &&
      source.attributes[value] &&
      source.attributes[value].length > 0,
  );

  if (best) {
    return best.attributes[value];
  }

  return [defaultValue];
};
