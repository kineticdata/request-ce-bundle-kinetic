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
import { I18n } from '../../../../app/src/I18nProvider';
import semver from 'semver';
const MINIMUM_CE_VERSION = '2.1.0';

const SchedulersError = () => <h1>Error loading Schedulers</h1>;
const SchedulersVersionError = ({ version, breadcrumbs }) => (
  <div className="page-panel page-panel--scrollable">
    <div className="page-title">
      <div className="page-title__wrapper">
        <h3>{breadcrumbs}</h3>
        <h1>
          <I18n>Invalid CE Version</I18n>
        </h1>
      </div>
    </div>
    <p>
      <I18n
        render={translate => {
          return `${translate(
            'You are currently running Kinetic CE',
          )} ${version}. ${translate(
            `Schedulers require Kinetic CE ${MINIMUM_CE_VERSION} or greater.`,
          )}`;
        }}
      />
    </p>
  </div>
);
export const LoadingMessage = ({ heading, text }) => {
  return (
    <div className="loading-state">
      <h4>
        <i className="fa fa-spinner fa-spin fa-lg fa-fw" />
      </h4>
      <h5>
        <I18n>{heading || 'Loading'}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};
export const EmptyMessage = ({ heading, text }) => {
  return (
    <div className="empty-state">
      <h5>
        <I18n>{heading || 'No Results Found'}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};
export const ErrorMessage = ({ heading, text }) => {
  return (
    <div className="error-state">
      <h4>
        <I18n>Oops!</I18n>
      </h4>
      <h5>
        <I18n>{heading || 'Error'}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};
export const InfoMessage = ({ heading, text }) => {
  return (
    <div className="info-state">
      <h5>
        <I18n>{heading}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
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
  type,
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
              type={type}
              breadcrumbs={buildBreadcrumbs(
                <Fragment>
                  <Link to={match.path}>
                    <I18n>schedulers</I18n>
                  </Link>{' '}
                  /{` `}
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
                  <Link to={match.path}>
                    <I18n>schedulers</I18n>
                  </Link>{' '}
                  /{` `}
                </Fragment>,
              )}
            />
          )}
        />
        <Route
          render={props => (
            <SchedulersList
              {...props}
              type={type}
              breadcrumbs={buildBreadcrumbs()}
            />
          )}
        />
      </Switch>
    )
  ) : (
    <ErrorUnauthorized />
  );

export const mapStateToProps = state => ({
  version: state.app.version,
  validVersion: semver.satisfies(
    semver.coerce(state.app.version),
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
              <Link to="/">
                <I18n>home</I18n>
              </Link>{' '}
              /{` `}
            </Fragment>
          )}
          {breadcrumbs}
        </Fragment>
      );
    },
  }),
  connect(mapStateToProps),
)(SchedulersRouter);
