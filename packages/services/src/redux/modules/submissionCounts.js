export const types = {
  FETCH_SUBMISSION_COUNTS: '@kd/catalog/FETCH_SUBMISSION_COUNTS',
  SET_SUBMISSION_COUNTS: '@kd/catalog/SET_SUBMISSION_COUNTS',
};

export const actions = {
  fetchSubmissionCounts: () => ({ type: types.FETCH_SUBMISSION_COUNTS }),
  setSubmissionCounts: counts => ({
    type: types.SET_SUBMISSION_COUNTS,
    payload: counts,
  }),
};

export const defaultState = {
  loading: true,
  data: {},
};

const reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.FETCH_SUBMISSION_COUNTS:
      return { ...state, loading: true, errors: [] };
    case types.SET_SUBMISSION_COUNTS:
      return { ...state, loading: false, data: payload };
    default:
      return state;
  }
};

export default reducer;
