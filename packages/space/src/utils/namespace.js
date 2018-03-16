export const namespace = (category, action) =>
  `@kd/kinops/home/${category}/${action}`;
export const noPayload = type => () => ({ type });
export const withPayload = type => payload => ({ type, payload });
