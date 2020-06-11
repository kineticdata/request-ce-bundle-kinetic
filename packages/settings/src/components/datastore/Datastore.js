import React from 'react';
import { Link, Router } from '@reach/router';
import { connect } from 'react-redux';
import { DatastoreSubmission } from './Submission';
import { FormList } from './FormList';
import { SubmissionSearch } from './SubmissionSearch/SubmissionSearch';
import { DatastoreSettings } from './DatastoreSettings';
// import { DatastoreEdit } from './DatastoreEdit';

import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';

import semver from 'semver';
const MINIMUM_CE_VERSION = '2.1.0';

const DatastoreError = () => (
  <h1>
    <I18n>Error loading Datastore</I18n>
  </h1>
);
const DatastoreVersionError = ({ coreVersion }) => (
  <div className="page-panel page-panel--scrollable">
    <div className="page-title">
      <div
        role="navigation"
        aria-label="breadcrumbs"
        className="page-title__breadcrumbs"
      >
        <span className="breadcrumb-item">
          <Link to="/settings">
            <I18n>settings</I18n>
          </Link>{' '}
        </span>
        <span aria-hidden="true">/ </span>
        <h1>
          <I18n>Invalid CE Version</I18n>
        </h1>
      </div>
    </div>
    <p>
      {`You are currently running Kinetic CE ${coreVersion}. Datastore
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
        <DatastoreError path="error" />
        <SubmissionSearch path=":slug" />
        <DatastoreSettings path=":slug/settings" />
        {/* <DatastoreEdit path=":slug/settings" /> */}
        <DatastoreSubmission path=":slug/new" />
        <DatastoreSubmission path=":slug/:id/:mode" />
        <DatastoreSubmission path=":slug/:id" />
        <FormList default />
      </Router>
    )
  );

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.loading,
  version: state.app.coreVersion,
  validVersion: semver.satisfies(
    semver.coerce(state.app.coreVersion),
    `>=${MINIMUM_CE_VERSION}`,
  ),
});

export const Datastore = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(DatastoreRouter);
