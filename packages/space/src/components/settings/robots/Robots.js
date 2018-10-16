import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RobotContainer } from './RobotContainer';
import semver from 'semver';
const MINIMUM_CE_VERSION = '2.1.0';

const RobotsError = () => <h1>Error loading Robots</h1>;
const RobotsVersionError = ({ version }) => (
  <div className="page-panel page-panel--scrollable">
    <div className="page-title">
      <div className="page-title__wrapper">
        <h3>
          <Link to="/">home</Link> /{` `}
          <Link to="/settings">settings</Link> /{` `}
        </h3>
        <h1>Invalid CE Version</h1>
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
    <Switch>
      <Route exact path={`${match.path}/error`} component={RobotsError} />
      <Route path={`${match.path}`} component={RobotContainer} />
    </Switch>
  );

export const mapStateToProps = state => ({
  version: state.app.config.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.config.version),
    `>=${MINIMUM_CE_VERSION}`,
  ),
});

export const Robots = connect(mapStateToProps)(RobotsRouter);
