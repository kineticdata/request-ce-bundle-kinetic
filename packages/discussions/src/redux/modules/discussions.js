import { Record, List, Map } from 'immutable';
import { commonTypes, Utils } from 'common';
const { namespace, withPayload } = Utils;

export const types = {
  // API-based actions.
  CREATE_DISCUSSION: namespace('discussion', 'CREATE_DISCUSSION'),

  // Modal dialog state.
  OPEN_MODAL: namespace('discussions', 'OPEN_MODAL'),
  CLOSE_MODAL: namespace('discussions', 'CLOSE_MODAL'),

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

  // Modal dialog state.
  openModal: withPayload(types.OPEN_MODAL, 'guid', 'modalType'),
  closeModal: withPayload(types.CLOSE_MODAL),

  // Discussion Visibility
  setDiscussionVisibility: withPayload(types.SET_DISCUSSION_VISIBILITY),
  setPageTitleInterval: withPayload(types.SET_PAGE_TITLE_INTERVAL),
};

export const State = Record({
  discussions: Map(),
  activeDiscussion: null,
  currentOpenModals: List(),
  isVisible: true,
  pageTitleInterval: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.OPEN_MODAL:
      return state
        .set('activeDiscussion', payload.guid)
        .update('currentOpenModals', list => list.push(payload.modalType));
    case types.CLOSE_MODAL:
      return payload
        ? state.update('currentOpenModals', list =>
            list.filter(item => item !== payload),
          )
        : state.delete('currentOpenModals');
    case commonTypes.SET_SIZE:
      return state.delete('currentOpenModals');
    case types.SET_DISCUSSION_VISIBILITY:
      return state.set('isVisible', payload === 'visible');
    case types.SET_PAGE_TITLE_INTERVAL:
      return state.set('pageTitleInterval', payload);
    default:
      return state;
  }
};
