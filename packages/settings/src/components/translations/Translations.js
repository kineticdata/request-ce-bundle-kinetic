import React from 'react';
import { Router } from '@reach/router';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { TranslationsList } from './TranslationsList';
import { EntriesList } from './EntriesList';
import { StagedList } from './StagedList';
import { actions } from '../../redux/modules/settingsTranslations';
import { context } from '../../redux/store';

export const TranslationsRouter = ({
  match,
  localesLoading,
  localeErrors,
  contextsLoading,
  contextErrors,
}) =>
  !localesLoading &&
  !contextsLoading && (
    <Router>
      <EntriesList path="context/:context" />
      <EntriesList path="locale/:locale" />
      <EntriesList path="context/:context/locale/:locale" />
      <EntriesList path="context/:context/key/:keyHash" />
      <StagedList path="staged/:context?" />
      <TranslationsList path=":mode" />
      <TranslationsList default />
    </Router>
  );

export const mapStateToProps = state => ({
  localesLoading: state.settingsTranslations.locales.loading,
  localeErrors: state.settingsTranslations.locales.errors,
  contextsLoading: state.settingsTranslations.contexts.loading,
  contextErrors: state.settingsTranslations.contexts.errors,
  preferredLocale: state.app.profile.preferredLocale,
});

export const mapDispatchToProps = {
  fetchContexts: actions.fetchContexts,
  fetchLocales: actions.fetchLocales,
};

export const Translations = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchContexts({
        custom: true,
        unexpected: true,
        form: true,
      });
      this.props.fetchLocales({ localeCode: this.props.preferredLocale });
    },
  }),
)(TranslationsRouter);
