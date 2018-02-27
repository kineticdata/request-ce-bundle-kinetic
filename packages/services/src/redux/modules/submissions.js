import { List } from 'immutable';

export const types = {
  FETCH_SUBMISSIONS: '@kd/catalog/FETCH_SUBMISSIONS',
  FETCH_NEXT_PAGE: '@kd/catalog/FETCH_NEXT_PAGE',
  FETCH_PREVIOUS_PAGE: '@kd/catalog/FETCH_PREVIOUS_PAGE',
  SET_SUBMISSIONS: '@kd/catalog/SET_SUBMISSIONS',
};

export const actions = {
  fetchSubmissions: coreState => ({
    type: types.FETCH_SUBMISSIONS,
    payload: { coreState },
  }),
  fetchNextPage: coreState => ({
    type: types.FETCH_NEXT_PAGE,
    payload: { coreState },
  }),
  fetchPreviousPage: coreState => ({
    type: types.FETCH_PREVIOUS_PAGE,
    payload: { coreState },
  }),
  setSubmissions: (submissions, nextPageToken) => ({
    type: types.SET_SUBMISSIONS,
    payload: { submissions, nextPageToken },
  }),
};

export const defaultState = {
  loading: true,
  data: List(),
  // page token tracking
  previous: List(),
  current: null,
  next: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.FETCH_SUBMISSIONS:
      return {
        ...state,
        loading: true,
        previous: List(),
        current: null,
      };
    case types.FETCH_NEXT_PAGE:
      return {
        ...state,
        loading: true,
        previous: state.previous.push(state.current),
        current: state.next,
      };
    case types.FETCH_PREVIOUS_PAGE:
      return {
        ...state,
        loading: true,
        previous: state.previous.pop(),
        current: state.previous.last(),
      };
    case types.SET_SUBMISSIONS:
      return {
        ...state,
        loading: false,
        data: List(action.payload.submissions),
        next: action.payload.nextPageToken,
      };
    default:
      return state;
  }
};

export default reducer;
