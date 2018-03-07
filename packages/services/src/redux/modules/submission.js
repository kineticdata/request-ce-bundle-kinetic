export const types = {
  FETCH_SUBMISSION: '@kd/catalog/FETCH_SUBMISSION',
  SET_SUBMISSION: '@kd/catalog/SET_SUBMISSION',
  SET_SUBMISSION_ERRORS: '@kd/catalog/SET_SUBMISSION_ERRORS',
  CLEAR_SUBMISSION: '@kd/catalog/CLEAR_SUBMISSION',
  CLONE_SUBMISSION: '@kd/catalog/CLONE_SUBMISSION',
  CLONE_SUBMISSION_SUCCESS: '@kd/catalog/CLONE_SUBMISSION_SUCCESS',
  CLONE_SUBMISSION_ERROR: '@kd/catalog/CLONE_SUBMISSION_ERROR',
  DELETE_SUBMISSION: '@kd/catalog/DELETE_SUBMISSION',
  DELETE_SUBMISSION_SUCCESS: '@kd/catalog/DELETE_SUBMISSION_SUCCESS',
  DELETE_SUBMISSION_ERROR: '@kd/catalog/DELETE_SUBMISSION_ERROR',
  START_SUBMISSION_POLLER: '@kd/catalog/START_SUBMISSION_POLLER',
  STOP_SUBMISSION_POLLER: '@kd/catalog/STOP_SUBMISSION_POLLER',
};

export const actions = {
  fetchSubmission: id => ({ type: types.FETCH_SUBMISSION, payload: id }),
  setSubmission: submissions => ({
    type: types.SET_SUBMISSION,
    payload: submissions,
  }),
  setSubmissionErrors: errors => ({
    type: types.SET_SUBMISSION_ERRORS,
    payload: errors,
  }),
  clearSubmission: () => ({ type: types.CLEAR_SUBMISSION }),
  cloneSubmission: id => ({ type: types.CLONE_SUBMISSION, payload: id }),
  cloneSubmissionSuccess: () => ({ type: types.CLONE_SUBMISSION_SUCCESS }),
  cloneSubmissionErrors: errors => ({
    type: types.CLONE_SUBMISSION_ERROR,
    payload: errors,
  }),
  deleteSubmission: (id, callback) => ({
    type: types.DELETE_SUBMISSION,
    payload: { id, callback },
  }),
  deleteSubmissionSuccess: () => ({ type: types.DELETE_SUBMISSION_SUCCESS }),
  deleteSubmissionErrors: errors => ({
    type: types.DELETE_SUBMISSION_ERROR,
    payload: errors,
  }),
  startSubmissionPoller: id => ({
    type: types.START_SUBMISSION_POLLER,
    payload: id,
  }),
  stopSubmissionPoller: () => ({ type: types.STOP_SUBMISSION_POLLER }),
};

export const defaultState = {
  loading: true,
  cloning: false,
  deleting: false,
  errors: [],
  data: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.FETCH_SUBMISSION:
      return { ...state, loading: true, errors: [] };
    case types.SET_SUBMISSION:
      return { ...state, loading: false, errors: [], data: action.payload };
    case types.SET_SUBMISSION_ERRORS:
      return {
        ...state,
        loading: false,
        errors: state.errors.concat(action.payload),
      };
    case types.CLEAR_SUBMISSION:
      return defaultState;
    case types.CLONE_SUBMISSION:
      return { ...state, cloning: true };
    case types.CLONE_SUBMISSION_SUCCESS:
      return { ...state, cloning: false };
    case types.CLONE_SUBMISSION_ERROR:
      return {
        ...state,
        cloning: false,
        errors: state.errors.concat(action.payload),
      };
    case types.DELETE_SUBMISSION:
      return { ...state, deleting: true };
    case types.DELETE_SUBMISSION_SUCCESS:
      return { ...state, deleting: false };
    case types.DELETE_SUBMISSION_ERROR:
      return {
        ...state,
        deleting: false,
        errors: state.errors.concat(action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
