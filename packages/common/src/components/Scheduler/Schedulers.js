import React, { Fragment } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ErrorUnauthorized } from '../ErrorUnauthorized';
import { SchedulersList } from './SchedulersList';
import { CreateScheduler } from './CreateScheduler';
import { Scheduler } from './Scheduler';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from '../../redux/selectors';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import semver from 'semver';
const MINIMUM_CE_VERSION = '2.1.0';

const SchedulersError = () => <h1>Error loading Schedulers</h1>;
const SchedulersVersionError = ({ version, breadcrumbs }) => (
  <div className="page-panel page-panel--scrollable">
    <div className="page-title">
      <div className="page-title__wrapper">
        <h3>{breadcrumbs}</h3>
        <h1>Invalid CE Version</h1>
      </div>
    </div>
    <p>
      {`You are currently running Kinetic CE ${version}. Schedulers
      require Kinetic CE ${MINIMUM_CE_VERSION} or greater.`}
    </p>
  </div>
);
export const LoadingMessage = ({ heading, text }) => {
  return (
    <div className="loading-state">
      <h4>
        <i className="fa fa-spinner fa-spin fa-lg fa-fw" />
      </h4>
      <h5>{heading || 'Loading'}</h5>
      {text && <h6>{text}</h6>}
    </div>
  );
};
export const EmptyMessage = ({ heading, text }) => {
  return (
    <div className="empty-state">
      <h5>{heading || 'No Results Found'}</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      {text && <h6>{text}</h6>}
    </div>
  );
};
export const ErrorMessage = ({ heading, text }) => {
  return (
    <div className="error-state">
      <h4>{'Oops!'}</h4>
      <h5>{heading || 'Error'}</h5>
      {text && <h6>{text}</h6>}
    </div>
  );
};
export const InfoMessage = ({ heading, text }) => {
  return (
    <div className="info-state">
      <h5>{heading}</h5>
      {text && <h6>{text}</h6>}
    </div>
  );
};

export const SchedulersRouter = ({
  match,
  loading,
  validVersion,
  version,
  breadcrumbs,
  buildBreadcrumbs,
  isSchedulerAdmin,
  isSchedulerManager,
}) =>
  isSchedulerAdmin || isSchedulerManager ? (
    !validVersion ? (
      <SchedulersVersionError
        version={version}
        breadcrumbs={buildBreadcrumbs()}
      />
    ) : (
      <Switch>
        <Route exact path={`${match.path}/error`} component={SchedulersError} />
        <Route
          exact
          path={`${match.path}/new`}
          render={props => (
            <CreateScheduler
              {...props}
              breadcrumbs={buildBreadcrumbs(
                <Fragment>
                  <Link to={match.path}>schedulers</Link> /{` `}
                </Fragment>,
              )}
            />
          )}
        />
        <Route
          path={`${match.path}/:id/:mode?`}
          render={props => (
            <Scheduler
              {...props}
              breadcrumbs={buildBreadcrumbs(
                <Fragment>
                  <Link to={match.path}>schedulers</Link> /{` `}
                </Fragment>,
              )}
            />
          )}
        />
        <Route
          render={props => (
            <SchedulersList {...props} breadcrumbs={buildBreadcrumbs()} />
          )}
        />
      </Switch>
    )
  ) : (
    <ErrorUnauthorized />
  );

export const mapStateToProps = state => ({
  version: state.app.config.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.config.version),
    `>=${MINIMUM_CE_VERSION}`,
  ),
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state),
  isSchedulerManager: selectHasRoleSchedulerManager(state),
});

export const Schedulers = compose(
  withHandlers({
    buildBreadcrumbs: ({ breadcrumbs: base }) => breadcrumbs => {
      return (
        <Fragment>
          {base || (
            <Fragment>
              <Link to="/">home</Link> /{` `}
            </Fragment>
          )}
          {breadcrumbs}
        </Fragment>
      );
    },
  }),
  connect(mapStateToProps),
)(SchedulersRouter);
