import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_FORMS: namespace('spaceForms', 'FETCH_FORMS'),
  SET_FORMS: namespace('spaceForms', 'SET_FORMS'),
};

export const actions = {
  fetchForms: withPayload(types.FETCH_FORMS),
  setForms: withPayload(types.SET_FORMS),
};

export const State = Record({
  loading: true,
  data: List(),
});

export const selectFormsForTeam = state => {
  const { team, spaceForms } = state;
  if (team.loading || team.data === null) {
    return List();
  }

  return spaceForms.data.filter(form =>
    Utils.getAttributeValues(form, 'Owning Team', List()).includes(
      team.data.name,
    ),
  );
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORMS:
      return state.set('loading', true);
    case types.SET_FORMS:
      return state.set('loading', false).set('data', payload);
    default:
      return state;
  }
};
