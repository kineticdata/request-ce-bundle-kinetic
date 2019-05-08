import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import {
  fetchDefaultLocale,
  fetchEnabledLocales,
  fetchAvailableLocales,
  setDefaultLocale,
  enableLocale,
  disableLocale,
  fetchContexts,
  fetchKapps,
  fetchForms,
  createContext,
  updateContext,
  deleteContext,
  updateContextKey,
  fetchTranslations,
  fetchContextKeys,
  upsertTranslations,
  deleteTranslations,
  fetchStagedTranslations,
  clearTranslationsCache,
} from '@kineticdata/react';
import { List } from 'immutable';
import { addSuccess, addError } from 'common';

import { types, actions } from '../modules/settingsTranslations';

export function* fetchLocalesSaga({
  payload: { exclude = {}, localeCode } = {},
}) {
  const [defaultLocale, enabled, available] = yield all([
    !exclude.default && call(fetchDefaultLocale, {}),
    !exclude.enabled && call(fetchEnabledLocales, {}),
    !exclude.available && call(fetchAvailableLocales, { localeCode }),
  ]);

  const errors = new List();
  const data = {};

  if (defaultLocale) {
    if (defaultLocale.serverError) {
      errors.push(
        defaultLocale.serverError.error || defaultLocale.serverError.statusText,
      );
    } else if (defaultLocale.errors) {
      errors.push(...defaultLocale.errors);
    } else {
      data['default'] = defaultLocale.defaultLocale;
    }
  }

  if (enabled) {
    if (enabled.serverError) {
      errors.push(enabled.serverError.error || enabled.serverError.statusText);
    } else if (enabled.errors) {
      errors.push(...enabled.errors);
    } else {
      data['enabled'] = enabled.locales;
    }
  }

  if (available) {
    if (available.serverError) {
      errors.push(
        available.serverError.error || available.serverError.statusText,
      );
    } else if (available.errors) {
      errors.push(...available.errors);
    } else {
      data['available'] = available.locales;
    }
  }

  if (errors.size > 0) {
    yield put(actions.setLocaleErrors(errors.toJS()));
  } else {
    yield put(actions.setLocales(data));
  }
}

export function* setDefaultLocaleSaga({ payload }) {
  const { errors, serverError } = yield call(setDefaultLocale, {
    localeCode: payload.localeCode,
  });

  if (serverError) {
    yield put(addError('Failed to set default locale.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to set default locale. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The ${
            payload.localeCode
          } locale was successfully set as the default locale.`,
          'Default Locale Set',
        ),
      ),
      put(
        actions.fetchLocales({
          exclude: {
            enabled: true,
            available: true,
          },
        }),
      ),
    ]);
  }
}

export function* enableLocaleSaga({ payload }) {
  const { errors, serverError } = yield call(enableLocale, {
    localeCode: payload.localeCode,
  });

  if (serverError) {
    yield put(addError('Failed to enable locale.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to enable locale. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The ${payload.localeCode} locale was successfully enabled.`,
          'Locale Enabled',
        ),
      ),
      put(
        actions.fetchLocales({
          exclude: {
            default: true,
            available: true,
          },
        }),
      ),
    ]);
  }
}

export function* disableLocaleSaga({ payload }) {
  const { errors, serverError } = yield call(disableLocale, {
    localeCode: payload.localeCode,
  });

  if (serverError) {
    yield put(addError('Failed to disable locale.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to disable locale. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The ${payload.localeCode} locale was successfully disabled.`,
          'Locale Disabled',
        ),
      ),
      put(
        actions.fetchLocales({
          exclude: {
            default: true,
            available: true,
          },
        }),
      ),
    ]);
  }
}

export function* fetchContextsSaga({ payload = {} }) {
  const customContextRegex = new RegExp('custom.([a-z0-9.-]+)');

  const [custom, unexpected, kapps] = yield all([
    payload.custom && call(fetchContexts, { custom: true }),
    payload.unexpected && call(fetchContexts, { unexpected: true }),
    payload.form && call(fetchKapps, { manage: true }),
  ]);

  const errorList = [];
  const handleErrors = ({ errors, serverError }) => {
    if (serverError) {
      errorList.push(serverError.error || serverError.statusText);
    } else if (errors) {
      errorList.push(...custom.errors);
    } else {
      return false;
    }
    return true;
  };
  const data = {};

  if (custom && !handleErrors(custom)) {
    data['custom'] = custom.contexts.map(context => {
      const match = context.name.match(customContextRegex);
      if (match) {
        return { ...context, displayName: match[1] };
      } else {
        return context;
      }
    });
  }

  if (unexpected && !handleErrors(unexpected)) {
    data['unexpected'] = unexpected.contexts;
  }

  if (kapps && !handleErrors(kapps)) {
    const [datastoreForms, ...kappFormsList] = yield all([
      call(fetchForms, { datastore: true, manage: true }),
      ...kapps.kapps.map(({ slug }) =>
        call(fetchForms, {
          kappSlug: slug,
          manage: true,
          include: 'kapp',
        }),
      ),
    ]);

    if (datastoreForms && !handleErrors(datastoreForms)) {
      data['datastore'] = datastoreForms.forms.map(form => ({
        name: `datastore.forms.${form.slug}`,
        formName: form.name,
      }));
    }

    kappFormsList &&
      kappFormsList.forEach(kappForms => {
        if (kappForms && !handleErrors(kappForms)) {
          data['form'] = [
            ...(data['form'] || []),
            ...kappForms.forms.map(form => ({
              name: `kapps.${form.kapp.slug}.forms.${form.slug}`,
              formName: form.name,
              kappName: form.kapp.name,
            })),
          ];
        }
      });
  }

  if (errorList.length > 0) {
    yield put(actions.setContextErrors(errorList));
  } else {
    yield put(actions.setContexts(data));
  }
}

export function* createContextSaga({ payload }) {
  const { context, errors, serverError } = yield call(createContext, {
    context: payload.context,
  });

  if (serverError) {
    yield put(addError('Failed to create context.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to create context. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The ${context.name} context was successfully created.`,
          'Context Created',
        ),
      ),
      put(actions.fetchContexts({ custom: true })),
    ]);
    if (typeof payload.success === 'function') {
      payload.success(context);
    }
  }
}

export function* updateContextSaga({ payload }) {
  const { errors, serverError } = yield call(updateContext, {
    contextName: payload.contextName,
    context: payload.context,
  });

  if (serverError) {
    yield put(addError('Failed to update context.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to update context. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The ${payload.contextName} context was successfully updated to ${
            payload.context.name
          }`,
          'Context Updated',
        ),
      ),
      put(actions.fetchContexts({ custom: true })),
    ]);
  }
}

export function* deleteContextSaga({ payload }) {
  const { errors, serverError } = yield call(deleteContext, {
    contextName: payload.contextName,
  });

  if (serverError) {
    yield put(addError('Failed to delete context.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to delete context. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The ${payload.contextName} context was successfully deleted.`,
          'Context Deleted',
        ),
      ),
      put(actions.fetchContexts({ custom: true })),
    ]);
  }
}

export function* updateContextKeySaga({ payload }) {
  const { errors, serverError } = yield call(updateContextKey, {
    contextName: payload.context,
    keyHash: payload.keyHash,
    key: { name: payload.key },
  });

  if (serverError) {
    yield put(addError('Failed to update key.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to update key. ${errors[0]}`, 'Error'));
  } else {
    yield put(
      addSuccess(
        `The key was successfully updated to ${payload.key}`,
        'Context Updated',
      ),
    );
    if (typeof payload.callback === 'function') {
      payload.callback();
    }
  }
}

export function* fetchTranslationsSaga({ payload = {} }) {
  const [{ entries, errors, serverError }, keys, locales] = yield all([
    call(fetchTranslations, {
      cache: !!payload.cache,
      contextName: payload.contextName,
      localeCode: payload.localeCode,
      keyHash: payload.keyHash,
      missing: !!payload.missing,
      export: payload.export,
    }),
    payload.contextName &&
      call(fetchContextKeys, { contextName: payload.contextName }),
    select(state => state.settingsTranslations.locales.enabled),
  ]);

  if (serverError) {
    yield put(
      actions.setTranslationErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setTranslationErrors(errors));
  } else {
    if (keys && keys.keys) {
      const keysMap = List(keys.keys)
        .filter(key => !payload.keyHash || payload.keyHash === key.hash)
        .reduce((list, key) => list.push({ [key.hash]: key.usages }), List());
      yield put(
        actions.setTranslations(
          entries.map(entry => ({
            ...entry,
            usages: keysMap[entry.keyHash] || [],
          })),
        ),
      );
    } else {
      yield put(actions.setTranslations(entries));
    }
  }
}

export function* upsertTranslationsSaga({ payload }) {
  const { errors, serverError } = yield call(upsertTranslations, {
    translation: payload.translation,
    file: payload.file,
    import: payload.import,
  });

  if (serverError) {
    yield put(addError('Failed to save translation.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to save translation. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The translation was successfully saved.`,
          'Translation Saved',
        ),
      ),
      payload.fetchParams &&
        put(actions.fetchTranslations(payload.fetchParams)),
    ]);
  }
}

export function* deleteTranslationsSaga({ payload }) {
  if (!payload.context && !payload.locale) {
    throw new Error(
      'You must provide either context or locale when deleting translations.',
    );
  }
  const { errors, serverError } = yield call(deleteTranslations, {
    contextName: payload.context,
    localeCode: payload.locale,
    keyHash: payload.keyHash,
  });

  if (serverError) {
    yield put(addError('Failed to delete translation.', 'Error'));
  } else if (errors) {
    yield put(addError(`Failed to delete translation. ${errors[0]}`, 'Error'));
  } else {
    yield all([
      put(
        addSuccess(
          `The translation was successfully deleted.`,
          'Translation Deleted',
        ),
      ),
      payload.fetchParams &&
        put(actions.fetchTranslations(payload.fetchParams)),
    ]);
    if (typeof payload.callback === 'function') {
      payload.callback();
    }
  }
}

export function* fetchStagedTranslationsSaga({ payload = {} }) {
  const { changes, errors, serverError } = yield call(fetchStagedTranslations, {
    contextName: payload.contextName,
  });

  if (serverError) {
    yield put(
      actions.setStagedTranslationErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setStagedTranslationErrors(errors));
  } else {
    yield put(actions.setStagedTranslations(changes));
  }
}

export function* clearTranslationsCacheSaga({ payload = {} }) {
  const { errors, serverError } = yield call(clearTranslationsCache, {});

  if (serverError) {
    yield put(addError('Failed to publish translations.', 'Error'));
  } else if (errors) {
    yield put(
      addError(`Failed to publish translations. ${errors[0]}`, 'Error'),
    );
  } else {
    yield all([
      put(
        addSuccess(
          `Translations were successfully published.`,
          'Translations Published',
        ),
      ),
    ]);
    if (typeof payload.callback === 'function') {
      payload.callback();
    }
  }
}

export function* watchSettingsTranslations() {
  yield takeEvery(types.FETCH_LOCALES, fetchLocalesSaga);
  yield takeEvery(types.SET_DEFAULT_LOCALE, setDefaultLocaleSaga);
  yield takeEvery(types.ENABLE_LOCALE, enableLocaleSaga);
  yield takeEvery(types.DISABLE_LOCALE, disableLocaleSaga);
  yield takeEvery(types.FETCH_CONTEXTS, fetchContextsSaga);
  yield takeEvery(types.CREATE_CONTEXT, createContextSaga);
  yield takeEvery(types.UPDATE_CONTEXT, updateContextSaga);
  yield takeEvery(types.DELETE_CONTEXT, deleteContextSaga);
  yield takeEvery(types.UPDATE_CONTEXT_KEY, updateContextKeySaga);
  yield takeEvery(types.FETCH_TRANSLATIONS, fetchTranslationsSaga);
  yield takeEvery(types.UPSERT_TRANSLATION, upsertTranslationsSaga);
  yield takeEvery(types.DELETE_TRANSLATION, deleteTranslationsSaga);
  yield takeEvery(types.FETCH_STAGED_TRANSLATIONS, fetchStagedTranslationsSaga);
  yield takeEvery(types.CLEAR_TRANSLATIONS_CACHE, clearTranslationsCacheSaga);
}
