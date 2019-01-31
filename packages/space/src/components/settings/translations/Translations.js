import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { TranslationsList } from './TranslationsList';
import { EntriesList } from './EntriesList';
import { StagedList } from './StagedList';
import { actions } from '../../../redux/modules/settingsTranslations';
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
          <Link to="/">
            <I18n>home</I18n>
          </Link>{' '}
          /{` `}
          <Link to="/settings">
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
      <Switch>
        <Route
          exact
          path={`${match.path}/error`}
          component={TranslationsError}
        />
        <Route
          exact
          path={`${match.path}/context/:context`}
          component={EntriesList}
        />
        <Route
          exact
          path={`${match.path}/locale/:locale`}
          component={EntriesList}
        />
        <Route
          exact
          path={`${match.path}/context/:context/locale/:locale`}
          component={EntriesList}
        />
        <Route
          exact
          path={`${match.path}/context/:context/key/:keyHash`}
          component={EntriesList}
        />
        <Route
          exact
          path={`${match.path}/staged/:context?`}
          component={StagedList}
        />
        <Route path={`${match.path}/:mode?`} component={TranslationsList} />
      </Switch>
    )
  );

export const mapStateToProps = state => ({
  version: state.app.config.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.config.version),
    `>=${MINIMUM_CE_VERSION}`,
  ),
  localesLoading: state.space.settingsTranslations.locales.loading,
  localeErrors: state.space.settingsTranslations.locales.errors,
  contextsLoading: state.space.settingsTranslations.contexts.loading,
  contextErrors: state.space.settingsTranslations.contexts.errors,
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
