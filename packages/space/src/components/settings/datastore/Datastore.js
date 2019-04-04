import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { DatastoreSubmission } from './Submission';
import { FormList } from './FormList';
import { SubmissionSearch } from './SubmissionSearch/SubmissionSearch';
import { DatastoreSettings } from './DatastoreSettings';
import { CreateDatastore } from './CreateDatastore';

import { Router } from '../../../SpaceApp';
import { I18n } from '../../../../../app/src/I18nProvider';
import { context } from '../../../redux/store';

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
      <Router>
        <CreateDatastore path="new" />
        <DatastoreError path="error" />
        <SubmissionSearch path=":slug" />
        <DatastoreSettings path=":slug/settings" />
        <DatastoreSubmission path=":slug/new" />
        <DatastoreSubmission path=":slug/:id/:mode" />
        <DatastoreSubmission path=":slug/:id" />
        <FormList default />
      </Router>
    )
  );

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.loading,
  version: state.app.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.version),
    `>=${MINIMUM_CE_VERSION}`,
  ),
});

export const Datastore = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(DatastoreRouter);
