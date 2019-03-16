import { Record } from 'immutable';
import { namespace, withPayload } from '../../utils';

export const types = {
  // API-based actions.
  CREATE_DISCUSSION: namespace('discussion', 'CREATE_DISCUSSION'),

  // Discussion Visibility
  SET_DISCUSSION_VISIBILITY: namespace(
    'discussions',
    'SET_DISCUSSION_VISIBILITY',
  ),
  SET_PAGE_TITLE_INTERVAL: namespace('discussions', 'SET_PAGE_TITLE_INTERVAL'),
};

export const actions = {
  createDiscussion: ({
    title,
    description = '',
    relatedItem = null,
    isPrivate = false,
    owningUsers,
    owningTeams,
    onSuccess,
  }) => ({
    type: types.CREATE_DISCUSSION,
    payload: {
      title,
      description,
      isPrivate,
      relatedItem,
      owningUsers,
      owningTeams,
      onSuccess,
    },
  }),

  // Discussion Visibility
  setDiscussionVisibility: withPayload(types.SET_DISCUSSION_VISIBILITY),
  setPageTitleInterval: withPayload(types.SET_PAGE_TITLE_INTERVAL),
};

export const State = Record({
  isVisible: true,
  pageTitleInterval: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_DISCUSSION_VISIBILITY:
      return state.set('isVisible', payload === 'visible');
    case types.SET_PAGE_TITLE_INTERVAL:
      return state.set('pageTitleInterval', payload);
    default:
      return state;
  }
};
