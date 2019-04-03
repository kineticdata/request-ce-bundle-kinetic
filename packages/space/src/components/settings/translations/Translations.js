import React from 'react';
import { Router, Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { TranslationsList } from './TranslationsList';
import { EntriesList } from './EntriesList';
import { StagedList } from './StagedList';
import { actions } from '../../../redux/modules/settingsTranslations';
import { context } from '../../../redux/store';
import { I18n } from '../../../../../app/src/I18nProvider';
import semver from 'semver';
const MINIMUM_CE_VERSION = '2.3.0';

const TranslationsError = () => (
  <h1>
    <I18n>Error loading Translations</I18n>
  </h1>
);
const TranslationsVersionError = ({ version }) => (
  <div className="page-panel page-panel--scrollable">
    <div className="page-title">
      <div className="page-title__wrapper">
        <h3>
          <Link to="../..">
            <I18n>home</I18n>
          </Link>{' '}
          /{` `}
          <Link to="..">
            <I18n>settings</I18n>
          </Link>{' '}
          /{` `}
        </h3>
        <h1>
          <I18n>Invalid CE Version</I18n>
        </h1>
      </div>
    </div>
    <p>
      {`You are currently running Kinetic CE ${version.version}. Translations
      require Kinetic CE ${MINIMUM_CE_VERSION} or greater.`}
    </p>
  </div>
);

export const TranslationsRouter = ({
  match,
  validVersion,
  version,
  localesLoading,
  localeErrors,
  contextsLoading,
  contextErrors,
}) =>
  !validVersion ? (
    <TranslationsVersionError version={version} />
  ) : (
    !localesLoading &&
    !contextsLoading && (
      <Router>
        <TranslationsError path="error" />
        <EntriesList path="context/:context" />
        <EntriesList path="locale/:locale" />
        <EntriesList path="context/:context/locale/:locale" />
        <EntriesList path="context/:context/key/:keyHash" />
        <StagedList path="staged/:context?" />
        <TranslationsList path=":mode" />
        <TranslationsList path="/" />
      </Router>
    )
  );

export const mapStateToProps = state => ({
  version: state.app.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.version),
    `>=${MINIMUM_CE_VERSION}`,
  ),
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
