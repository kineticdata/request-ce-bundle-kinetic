import { Record } from 'immutable';
import * as Utils from '../../utils';

const { namespace, noPayload, withPayload } = Utils;

export const types = {
  OPEN_FORM: namespace('modalForm', 'OPEN_FORM'),
  CLOSE_FORM: namespace('modalForm', 'CLOSE_FORM'),
  COMPLETE_FORM: namespace('modalForm', 'COMPLETE_FORM'),
};

export const actions = {
  openForm: withPayload(types.OPEN_FORM),
  closeForm: noPayload(types.CLOSE_FORM),
  completeForm: noPayload(types.COMPLETE_FORM),
};

export const State = Record({
  form: null,
  formIsCompleted: false,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.OPEN_FORM:
      return state.set('form', payload);
    case types.CLOSE_FORM:
      return state.set('form', null).set('formIsCompleted', false);
    case types.COMPLETE_FORM:
      return state.set('formIsCompleted', true);
    default:
      return state;
  }
};
