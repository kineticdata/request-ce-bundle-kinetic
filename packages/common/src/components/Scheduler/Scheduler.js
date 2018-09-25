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
import { PageTitle } from 'common';
import { CoreForm } from 'react-kinetic-core';
import { LoadingMessage, ErrorMessage, InfoMessage } from './Schedulers';
import { SchedulerConfig } from './SchedulerConfig';
import { SchedulerAvailability } from './SchedulerAvailability';
import { SchedulerOverrides } from './SchedulerOverrides';
import { actions } from '../../redux/modules/schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from '../../redux/selectors';

const globals = import('common/globals');

export const handleUpdated = props => response => {
  props.fetchScheduler({ id: response.submission.id, clear: true });
  props.push(props.match.url.replace('/edit', ''));
  props.addSuccess(
    `Successfully updated scheduler (${response.submission.values['Name']})`,
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
      {name}
    </NavLink>
  </li>
);

const ManagersTab = ({ loading, managers }) => (
  <div className="list-wrapper list-wrapper--managers">
    {loading && !managers && <LoadingMessage />}
    {!loading &&
      !managers && (
        <InfoMessage
          heading="The role for managers does not exist yet."
          text=""
        />
      )}
    {managers && (
      <table className="table table-sm table-striped table-managers settings-table">
        <thead className="header">
          <tr>
            <th>Display Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {managers.memberships.map(manager => (
            <tr key={manager.user.username}>
              <td>{manager.user.displayName}</td>
              <td>{manager.user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
const AgentsTab = ({ loading, agents }) => (
  <div className="list-wrapper list-wrapper--managers">
    {loading && !agents && <LoadingMessage />}
    {!loading &&
      !agents && (
        <InfoMessage
          heading="The team for agents does not exist yet."
          text=""
        />
      )}
    {agents && (
      <table className="table table-sm table-striped table-agents settings-table">
        <thead className="header">
          <tr>
            <th>Display Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {agents.memberships.map(agent => (
            <tr key={agent.user.username}>
              <td>{agent.user.displayName}</td>
              <td>{agent.user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
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
            <h1>{pageName}</h1>
          </div>
          {currentLoaded &&
            (mode !== 'edit' ? (
              <Link
                onClick={() => setPreviousMode(mode === 'managers' ? '' : mode)}
                to={match.path.replace(/:id\/:mode\?/, `${id}/edit`)}
                className="btn btn-primary"
              >
                Edit Scheduler
              </Link>
            ) : (
              <Link
                to={match.path.replace(/:id\/:mode\?/, `${id}/${previousMode}`)}
                className="btn btn-secondary"
              >
                Cancel Edit
              </Link>
            ))}
        </div>

        <div className="content-wrapper">
          {loading && !currentLoaded && <LoadingMessage />}
          {!loading &&
            errors.length > 0 && (
              <ErrorMessage
                heading="Failed to retrieve scheduler."
                text={errors.map(e => <div>{e}</div>)}
              />
            )}
          {currentLoaded &&
            (mode !== 'edit' ? (
              <Fragment>
                <div className="form">
                  <h2 className="section__title">General</h2>
                  {scheduler.values['Description'] && (
                    <div className="form-group">
                      <label>Description</label>
                      <div>{scheduler.values['Description']}</div>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <div>{scheduler.values['Status']}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Type</label>
                        <div>{scheduler.values['Type']}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Time Interval</label>
                        <div>{`${
                          scheduler.values['Time Interval']
                        } minutes`}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Reservation Timeout</label>
                        <div>{`${
                          scheduler.values['Reservation Timeout']
                        } minutes`}</div>
                      </div>
                    </div>
                  </div>
                  {scheduler.values['Location'] && (
                    <div className="form-group">
                      <label>Location</label>
                      <div>{scheduler.values['Location']}</div>
                    </div>
                  )}
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
                  {mode === 'managers' && (
                    <ManagersTab loading={loading} managers={managers} />
                  )}
                  {mode === 'agents' && (
                    <AgentsTab loading={loading} agents={agents} />
                  )}
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
              <CoreForm
                datastore
                submission={scheduler.id}
                updated={handleUpdated}
                error={handleError}
                globals={globals}
              />
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
