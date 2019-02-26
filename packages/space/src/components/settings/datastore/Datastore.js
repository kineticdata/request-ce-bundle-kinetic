import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DatastoreSubmission } from './Submission';
import { FormList } from './FormList';
import { SubmissionSearch } from './SubmissionSearch/SubmissionSearch';
import { DatastoreSettings } from './DatastoreSettings';
import { CreateDatastore } from './CreateDatastore';
import { I18n } from '../../../../../app/src/I18nProvider';
import semver from 'semver';
const MINIMUM_CE_VERSION = '2.1.0';

const DatastoreError = () => (
  <h1>
    <I18n>Error loading Datastore</I18n>
  </h1>
);
const DatastoreVersionError = ({ version }) => (
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
      {`You are currently running Kinetic CE ${version.version}. Datastore
      requires Kinetic CE ${MINIMUM_CE_VERSION} or greater.`}
    </p>
  </div>
);

export const DatastoreRouter = ({ match, loading, validVersion, version }) =>
  !validVersion ? (
    <DatastoreVersionError version={version} />
  ) : (
    !loading && (
      <Switch>
        <Route exact path={`${match.path}/new`} component={CreateDatastore} />
        <Route exact path={`${match.path}/error`} component={DatastoreError} />
        <Route
          exact
          path={`${match.path}/:slug`}
          component={SubmissionSearch}
        />
        <Route
          exact
          path={`${match.path}/:slug/settings`}
          component={DatastoreSettings}
        />
        <Route
          exact
          path={`${match.path}/:slug/new`}
          component={DatastoreSubmission}
        />
        <Route
          exact
          path={`${match.path}/:slug/:id`}
          component={DatastoreSubmission}
        />
        <Route
          exact
          path={`${match.path}/:slug/:id/:mode`}
          component={DatastoreSubmission}
        />
        <Route component={FormList} />
      </Switch>
    )
  );

export const mapStateToProps = state => ({
  loading: state.space.settingsDatastore.loading,
  version: state.app.config.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.config.version),
    `>=${MINIMUM_CE_VERSION}`,
  ),
});

export const Datastore = connect(mapStateToProps)(DatastoreRouter);
