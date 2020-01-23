import React from 'react';
import { Link, Router } from '@reach/router';
import { connect } from 'react-redux';
import { LoadingMessage } from 'common';
import { SurveySubmission } from './Submission';
import { SurveyList } from './SurveyList';
import { SubmissionSearch } from './SubmissionSearch/SubmissionSearch';
import { SurveySettings } from './SurveySettings';
import { CreateSurvey } from '../shared/CreateSurvey';
import { SurveyTest } from './SurveyTest';
import { I18n } from '@kineticdata/react';
import { context } from '../../redux/store';
import semver from 'semver';

const MINIMUM_CE_VERSION = '2.1.0';

const SurveyError = () => (
  <h1>
    <I18n>Error loading Datastore</I18n>
  </h1>
);

const DatastoreVersionError = ({ coreVersion }) => (
  <div className="page-panel page-panel--scrollable">
    <div className="page-title">
      <div className="page-title__wrapper">
        <h3>
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
      {`You are currently running Kinetic CE ${coreVersion}. Datastore
      requires Kinetic CE ${MINIMUM_CE_VERSION} or greater.`}
    </p>
  </div>
);

export const SurveyRouterComponent = ({
  match,
  loading,
  validVersion,
  coreVersion,
}) =>
  !validVersion ? (
    <DatastoreVersionError version={coreVersion} />
  ) : !loading ? (
    <Router>
      <CreateSurvey path="new" />
      <SurveyError path="error" />
      <SubmissionSearch path=":slug/submissions" />
      <SurveySettings path=":slug/settings" />
      <SurveySubmission path=":slug/submissions/new" />
      <SurveySubmission path=":slug/submissions/:id/:mode" />
      <SurveySubmission path=":slug/submissions/:id" />
      <SurveyTest path="test" />
    </Router>
  ) : (
    <LoadingMessage />
  );

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.loading,
  version: state.app.coreVersion,
  validVersion: semver.satisfies(
    semver.coerce(state.app.coreVersion),
    `>=${MINIMUM_CE_VERSION}`,
  ),
});

export const SurveyRouter = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(SurveyRouterComponent);
