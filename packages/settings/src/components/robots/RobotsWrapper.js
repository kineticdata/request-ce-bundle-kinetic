import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import semver from 'semver';

import { Router } from '../../App';
import { RobotContainer } from './RobotContainer';

import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const MINIMUM_CE_VERSION = '2.1.0';

const RobotsError = () => (
  <h1>
    <I18n>Error loading Robots</I18n>
  </h1>
);
const RobotsVersionError = ({ version }) => (
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
      {`You are currently running Kinetic CE ${version.version}. Robots
      require Kinetic CE ${MINIMUM_CE_VERSION} or greater.`}
    </p>
  </div>
);

export const RobotsRouter = ({ match, loading, validVersion, version }) =>
  !validVersion ? (
    <RobotsVersionError version={version} />
  ) : (
    <Router>
      <RobotsError path="error" />
      <RobotContainer default />
    </Router>
  );

export const mapStateToProps = state => ({
  version: state.app.coreVersion,
  validVersion: semver.satisfies(
    semver.coerce(state.app.coreVersion),
    `>=${MINIMUM_CE_VERSION}`,
  ),
});

export const RobotsWrapper = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(RobotsRouter);
