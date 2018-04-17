import { Record } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_PROFILE: namespace('profiles', 'FETCH_PROFILE'),
  SET_PROFILE: namespace('profiles', 'SET_PROFILE'),
  SET_PROFILE_ERROR: namespace('profiles', 'SET_PROFILE_ERROR'),
  UPDATE_PROFILE: namespace('profiles', 'UPDATE_PROFILE'),
  TOGGLE_PASSWORD: namespace('profiles', 'TOGGLE_PASSWORD'),
};

export const actions = {
  fetchProfile: withPayload(types.FETCH_PROFILE),
  setProfile: withPayload(types.SET_PROFILE),
  setProfileError: withPayload(types.SET_PROFILE_ERROR),
  updateProfile: withPayload(types.UPDATE_PROFILE),
  setChangePasswordVisible: withPayload(types.TOGGLE_PASSWORD),
};

export const selectIsMyProfile = ({ profiles, kinops }) =>
  profiles.profile && profiles.profile.username === kinops.profile.username;

export const State = Record({
  loading: true,
  profile: null,
  error: null,
  isChangePasswordVisible: false,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_PROFILE:
      return state.set('loading', true);
    case types.SET_PROFILE:
      return state
        .set('profile', payload)
        .set('loading', false)
        .set('error', null);
    case types.SET_PROFILE_ERROR:
      return state
        .set('profile', null)
        .set('loading', false)
        .set('error', payload);
    case types.TOGGLE_PASSWORD:
      return state.set('isChangePasswordVisible', payload);
    case types.UPDATE_PROFILE:
      return state.set('loading', false);
    default:
      return state;
  }
};
