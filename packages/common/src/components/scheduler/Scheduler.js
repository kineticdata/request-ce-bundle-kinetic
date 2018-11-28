import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { PageTitle, Constants, Moment } from 'common';
import { CoreForm } from 'react-kinetic-core';
import moment from 'moment';
import { LoadingMessage, ErrorMessage, InfoMessage } from './Schedulers';
import { SchedulerManagers } from './SchedulerManagers';
import { SchedulerAgents } from './SchedulerAgents';
import { SchedulerConfig } from './SchedulerConfig';
import { SchedulerAvailability } from './SchedulerAvailability';
import { SchedulerOverrides } from './SchedulerOverrides';
import { actions, SCHEDULER_FORM_SLUG } from '../../redux/modules/schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';
import { DATE_FORMAT } from '../../helpers/schedulerWidget';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from '../../redux/selectors';
import { I18n } from '../../../../app/src/I18nProvider';

const globals = import('common/globals');

export const handleUpdated = props => response => {
  props.fetchScheduler({ id: response.submission.id, clear: true });
  props.push(props.match.url.replace('/edit', ''));
  props.addSuccess(
    ['Successfully updated scheduler', response.submission.values['Name']],
    'Scheduler Updated!',
  );
};
export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

const TabPill = ({ match, id, name, path }) => (
  <li role="presentation">
    <NavLink
      exact
      to={match.path.replace(/:id\/:mode\?/, `${id}${path}`)}
      activeClassName="active"
    >
      <I18n>{name}</I18n>
    </NavLink>
  </li>
);

const SchedulerComponent = ({
  breadcrumbs,
  match,
  id,
  mode,
  previousMode,
  setPreviousMode,
  pageName,
  scheduler,
  loading,
  currentLoaded,
  errors,
  managers,
  agents,
  handleUpdated,
  handleError,
  isSchedulerAdmin,
  isSchedulerManager,
}) => {
  return (
    <div className="page-container page-container--scheduler">
      <PageTitle parts={[pageName, 'Schedulers', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--scheduler-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>{breadcrumbs}</h3>
            <h1>
              <I18n>{pageName}</I18n>
            </h1>
          </div>
          {currentLoaded &&
            (mode !== 'edit' ? (
              <Link
                onClick={() => setPreviousMode(mode === 'managers' ? '' : mode)}
                to={match.path.replace(/:id\/:mode\?/, `${id}/edit`)}
                className="btn btn-primary"
              >
                <I18n>Edit Scheduler</I18n>
              </Link>
            ) : (
              <Link
                to={match.path.replace(/:id\/:mode\?/, `${id}/${previousMode}`)}
                className="btn btn-secondary"
              >
                <I18n>Cancel Edit</I18n>
              </Link>
            ))}
        </div>

        <div className="content-wrapper">
          {loading && !currentLoaded && <LoadingMessage />}
          {!loading &&
            errors.length > 0 && (
              <ErrorMessage
                heading="Failed to retrieve scheduler."
                text={errors.map((e, i) => (
                  <div key={`error-${i}`}>
                    <I18n>{e}</I18n>
                  </div>
                ))}
              />
            )}
          {currentLoaded &&
            (mode !== 'edit' ? (
              <Fragment>
                <div className="form">
                  <h2 className="section__title">
                    <I18n>General</I18n>
                  </h2>
                  {scheduler.values['Description'] && (
                    <div className="form-group">
                      <label>
                        <I18n>Description</I18n>
                      </label>
                      <div>
                        <I18n>{scheduler.values['Description']}</I18n>
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <I18n>Status</I18n>
                        </label>
                        <div>
                          <I18n>{scheduler.values['Status']}</I18n>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <I18n>Type</I18n>
                        </label>
                        <div>
                          <I18n>{scheduler.values['Type']}</I18n>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <I18n>Time Interval</I18n>
                        </label>
                        <div>
                          <span>{`${scheduler.values['Time Interval']} `}</span>
                          <I18n>minutes</I18n>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <I18n>Reservation Timeout</I18n>
                        </label>
                        <div>
                          <span>{`${
                            scheduler.values['Reservation Timeout']
                          } `}</span>
                          <I18n>minutes</I18n>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <I18n>Timezone</I18n>
                        </label>
                        <div>
                          <I18n>{scheduler.values['Timezone']}</I18n>
                        </div>
                      </div>
                    </div>
                    {scheduler.values['Scheduling Window'] && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            <I18n>Scheduling Window</I18n>
                          </label>
                          <div>
                            <span>{`${
                              scheduler.values['Scheduling Window']
                            } `}</span>
                            <I18n>days</I18n>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {scheduler.values['Location'] && (
                    <div className="form-group">
                      <label>
                        <I18n>Location</I18n>
                      </label>
                      <div>
                        <I18n>{scheduler.values['Location']}</I18n>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    {scheduler.values['Scheduling Range Start Date'] && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            <I18n>Scheduling Range Start Date</I18n>
                          </label>
                          <div>
                            <Moment
                              timestampe={moment(
                                scheduler.values['Scheduling Range Start Date'],
                                DATE_FORMAT,
                              )}
                              format={Constants.MOMENT_FORMATS.date}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {scheduler.values['Scheduling Range End Date'] && (
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            <I18n>Scheduling Range End Date</I18n>
                          </label>
                          <div>
                            <Moment
                              timestampe={moment(
                                scheduler.values['Scheduling Range End Date'],
                                DATE_FORMAT,
                              )}
                              format={Constants.MOMENT_FORMATS.date}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <ul className="nav nav-tabs">
                    <TabPill match={match} id={id} name="Managers" path="" />
                    <TabPill
                      match={match}
                      id={id}
                      name="Agents"
                      path="/agents"
                    />
                    <TabPill
                      match={match}
                      id={id}
                      name="Event Types"
                      path="/config"
                    />
                    <TabPill
                      match={match}
                      id={id}
                      name="Availability"
                      path="/availability"
                    />
                    <TabPill
                      match={match}
                      id={id}
                      name="Availability Overrides"
                      path="/overrides"
                    />
                  </ul>
                  {mode === 'managers' && <SchedulerManagers />}
                  {mode === 'agents' && <SchedulerAgents />}
                  {mode === 'config' && (
                    <SchedulerConfig
                      schedulerId={scheduler.values['Id']}
                      timeInterval={scheduler.values['Time Interval']}
                    />
                  )}
                  {mode === 'availability' && (
                    <SchedulerAvailability
                      schedulerId={scheduler.values['Id']}
                    />
                  )}
                  {mode === 'overrides' && (
                    <SchedulerOverrides schedulerId={scheduler.values['Id']} />
                  )}
                </div>
              </Fragment>
            ) : (
              <I18n context={`datastore.forms.${SCHEDULER_FORM_SLUG}`}>
                <CoreForm
                  datastore
                  submission={scheduler.id}
                  updated={handleUpdated}
                  error={handleError}
                  globals={globals}
                />
              </I18n>
            ))}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.common.schedulers.scheduler.loading,
  errors: state.common.schedulers.scheduler.errors,
  scheduler: state.common.schedulers.scheduler.data,
  managers: state.common.schedulers.scheduler.teams.managers,
  agents: state.common.schedulers.scheduler.teams.agents,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(state),
  isSchedulerManager: selectHasRoleSchedulerManager(state),
});

export const mapDispatchToProps = {
  push,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
  fetchScheduler: actions.fetchScheduler,
};

export const Scheduler = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleUpdated,
    handleError,
  }),
  withState('previousMode', 'setPreviousMode', ''),
  withProps(({ match: { params: { id, mode = 'managers' } }, scheduler }) => ({
    id,
    currentLoaded: scheduler.id === id,
    pageName: `
      ${mode === 'edit' ? 'Edit ' : ''}
      ${scheduler && scheduler.id === id ? scheduler.values['Name'] : ''}
    `,
    mode: [
      'edit',
      'agents',
      'availability',
      'config',
      'overrides',
      'managers',
    ].includes(mode)
      ? mode
      : null,
  })),
  lifecycle({
    componentDidMount() {
      this.props.fetchScheduler({
        id: this.props.id,
      });
    },
  }),
)(SchedulerComponent);
