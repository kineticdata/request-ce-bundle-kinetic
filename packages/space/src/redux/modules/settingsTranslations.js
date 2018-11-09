import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const State = Record({
  locales: {
    loading: true,
    errors: [],
    default: {},
    enabled: new List(),
    available: new List(),
  },
  contexts: {
    loading: true,
    errors: [],
    form: new List(),
    datastore: new List(),
    custom: new List(),
    unexpected: new List(),
  },
  translations: {
    loading: true,
    errors: [],
    entries: new List(),
  },
  staged: {
    loading: true,
    errors: [],
    entries: new List(),
  },
});

export const types = {
  FETCH_LOCALES: namespace('translations', 'FETCH_LOCALES'),
  SET_LOCALES: namespace('translations', 'SET_LOCALES'),
  SET_LOCALE_ERRORS: namespace('translations', 'SET_LOCALE_ERRORS'),
  SET_DEFAULT_LOCALE: namespace('translations', 'SET_DEFAULT_LOCALE'),
  ENABLE_LOCALE: namespace('translations', 'ENABLE_LOCALE'),
  DISABLE_LOCALE: namespace('translations', 'DISABLE_LOCALE'),
  FETCH_CONTEXTS: namespace('translations', 'FETCH_CONTEXTS'),
  SET_CONTEXTS: namespace('translations', 'SET_CONTEXTS'),
  SET_CONTEXT_ERRORS: namespace('translations', 'SET_CONTEXT_ERRORS'),
  CREATE_CONTEXT: namespace('translations', 'CREATE_CONTEXT'),
  UPDATE_CONTEXT: namespace('translations', 'UPDATE_CONTEXT'),
  DELETE_CONTEXT: namespace('translations', 'DELETE_CONTEXT'),
  UPDATE_CONTEXT_KEY: namespace('translations', 'UPDATE_CONTEXT_KEY'),
  FETCH_TRANSLATIONS: namespace('translations', 'FETCH_TRANSLATIONS'),
  SET_TRANSLATIONS: namespace('translations', 'SET_TRANSLATIONS'),
  SET_TRANSLATION_ERRORS: namespace('translations', 'SET_TRANSLATION_ERRORS'),
  UPSERT_TRANSLATION: namespace('translations', 'UPSERT_TRANSLATION'),
  DELETE_TRANSLATION: namespace('translations', 'DELETE_TRANSLATION'),
  FETCH_STAGED_TRANSLATIONS: namespace(
    'translations',
    'FETCH_STAGED_TRANSLATIONS',
  ),
  SET_STAGED_TRANSLATIONS: namespace('translations', 'SET_STAGED_TRANSLATIONS'),
  SET_STAGED_TRANSLATION_ERRORS: namespace(
    'translations',
    'SET_STAGED_TRANSLATION_ERRORS',
  ),
  CLEAR_TRANSLATIONS_CACHE: namespace(
    'translations',
    'CLEAR_TRANSLATIONS_CACHE',
  ),
};

export const actions = {
  fetchLocales: withPayload(types.FETCH_LOCALES),
  setLocales: withPayload(types.SET_LOCALES),
  setLocaleErrors: withPayload(types.SET_LOCALE_ERRORS),
  setDefaultLocale: withPayload(types.SET_DEFAULT_LOCALE),
  enableLocale: withPayload(types.ENABLE_LOCALE),
  disableLocale: withPayload(types.DISABLE_LOCALE),
  fetchContexts: withPayload(types.FETCH_CONTEXTS),
  setContexts: withPayload(types.SET_CONTEXTS),
  setContextErrors: withPayload(types.SET_CONTEXT_ERRORS),
  createContext: withPayload(types.CREATE_CONTEXT),
  updateContext: withPayload(types.UPDATE_CONTEXT),
  deleteContext: withPayload(types.DELETE_CONTEXT),
  updateContextKey: withPayload(types.UPDATE_CONTEXT_KEY),
  fetchTranslations: withPayload(types.FETCH_TRANSLATIONS),
  setTranslations: withPayload(types.SET_TRANSLATIONS),
  setTranslationErrors: withPayload(types.SET_TRANSLATION_ERRORS),
  upsertTranslations: withPayload(types.UPSERT_TRANSLATION),
  deleteTranslation: withPayload(types.DELETE_TRANSLATION),
  fetchStagedTranslations: withPayload(types.FETCH_STAGED_TRANSLATIONS),
  setStagedTranslations: withPayload(types.SET_STAGED_TRANSLATIONS),
  setStagedTranslationErrors: withPayload(types.SET_STAGED_TRANSLATION_ERRORS),
  clearTranslationsCache: withPayload(types.CLEAR_TRANSLATIONS_CACHE),
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_LOCALES:
      return state
        .setIn(['locales', 'loading'], true)
        .setIn(['locales', 'errors'], []);
    case types.SET_LOCALES:
      return state
        .setIn(['locales', 'loading'], false)
        .updateIn(['locales', 'default'], o => payload.default || o)
        .updateIn(
          ['locales', 'enabled'],
          o => (payload.enabled ? List(payload.enabled) : o),
        )
        .updateIn(
          ['locales', 'available'],
          o => (payload.available ? List(payload.available) : o),
        );
    case types.SET_LOCALE_ERRORS:
      return state
        .setIn(['locales', 'loading'], false)
        .setIn(['locales', 'errors'], payload);
    case types.FETCH_CONTEXTS:
      return state
        .setIn(['contexts', 'loading'], true)
        .setIn(['contexts', 'errors'], []);
    case types.SET_CONTEXTS:
      return state
        .setIn(['contexts', 'loading'], false)
        .updateIn(
          ['contexts', 'form'],
          o => (payload.form ? List(payload.form) : o),
        )
        .updateIn(
          ['contexts', 'datastore'],
          o => (payload.datastore ? List(payload.datastore) : o),
        )
        .updateIn(
          ['contexts', 'custom'],
          o => (payload.custom ? List(payload.custom) : o),
        )
        .updateIn(
          ['contexts', 'unexpected'],
          o => (payload.unexpected ? List(payload.unexpected) : o),
        );
    case types.SET_CONTEXT_ERRORS:
      return state
        .setIn(['contexts', 'loading'], false)
        .setIn(['contexts', 'errors'], payload);
    case types.FETCH_TRANSLATIONS:
      return state
        .setIn(['translations', 'loading'], true)
        .setIn(['translations', 'errors'], []);
    case types.SET_TRANSLATIONS:
      return state
        .setIn(['translations', 'loading'], false)
        .setIn(['translations', 'entries'], List(payload));
    case types.SET_TRANSLATION_ERRORS:
      return state
        .setIn(['translations', 'loading'], false)
        .setIn(['translations', 'errors'], payload);
    case types.FETCH_STAGED_TRANSLATIONS:
      return state
        .setIn(['staged', 'loading'], true)
        .setIn(['staged', 'errors'], []);
    case types.SET_STAGED_TRANSLATIONS:
      return state
        .setIn(['staged', 'loading'], false)
        .setIn(['staged', 'entries'], List(payload));
    case types.SET_STAGED_TRANSLATION_ERRORS:
      return state
        .setIn(['staged', 'loading'], false)
        .setIn(['staged', 'errors'], payload);
    default:
      return state;
  }
};
