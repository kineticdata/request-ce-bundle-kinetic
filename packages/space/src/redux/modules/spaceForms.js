import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, withPayload, noPayload } = Utils;

export const types = {
  FETCH_FORMS: namespace('spaceForms', 'FETCH_FORMS'),
  SET_FORMS: namespace('spaceForms', 'SET_FORMS'),
  RESET_FORMS: namespace('spaceForms', 'RESET_FORMS'),
};

export const actions = {
  fetchForms: withPayload(types.FETCH_FORMS),
  setForms: withPayload(types.SET_FORMS),
  resetForms: noPayload(types.RESET_FORMS),
};

export const State = Record({
  loading: true,
  data: List(),
});

export const selectFormsForTeam = state => {
  if (state.space.team.loading || state.space.team.data === null) {
    return List();
  }

  return state.space.spaceForms.data.filter(form =>
    Utils.getAttributeValues(form, 'Owning Team', List()).includes(
      state.space.team.data.name,
    ),
  );
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORMS:
      return state.set('loading', true);
    case types.SET_FORMS:
      return state.set('loading', false).set('data', payload);
    case types.RESET_FORMS:
      return state.set('loading', true).set('data', List());
    default:
      return state;
  }
};
