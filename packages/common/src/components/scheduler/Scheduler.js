import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from '../../redux/store';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { PageTitle } from 'common';
import {
  searchSubmissions,
  SubmissionSearch,
  CoreForm,
  I18n,
  Moment,
} from '@kineticdata/react';
import moment from 'moment';
import { LoadingMessage, ErrorMessage } from '../StateMessages';
import { SchedulerManagers } from './SchedulerManagers';
import { SchedulerAgents } from './SchedulerAgents';
import { SchedulerConfig } from './SchedulerConfig';
import { SchedulerAvailability } from './SchedulerAvailability';
import { SchedulerOverrides } from './SchedulerOverrides';
import {
  actions,
  SCHEDULER_FORM_SLUG,
  SCHEDULED_EVENT_FORM_SLUG,
} from '../../redux/modules/schedulers';
import { addSuccess, addError } from '../../redux/modules/toasts';
import { DATE_FORMAT } from '../../helpers/schedulerWidget';
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
} from '../../redux/selectors';

const globals = import('common/globals');

export const handleUpdated = props => response => {
  props.fetchScheduler({ id: response.submission.id, clear: true });
  addSuccess(
    ['Successfully updated scheduler', response.submission.values['Name']],
    'Scheduler Updated!',
  );
  props.setMode(props.previousMode);
};
export const handleError = props => response => {
  addError(response.error, 'Error');
};

const TabPill = ({ label, onClick, active }) => (
  <li role="presentation">
    <NavLink className={active ? 'active' : ''} onClick={onClick} to="#">
      <I18n>{label}</I18n>
    </NavLink>
  </li>
);

const SchedulerComponent = ({
  profile,
  pathPrefix = '',
  breadcrumbs = [],
  id,
  mode,
  setMode,
  previousMode,
  setPreviousMode,
  pageName,
  scheduler,
  currentLoaded,
  error,
  managers,
  agents,
  handleUpdated,
  handleError,
  isSchedulerAdmin,
  isSchedulerManager,
  optionsOpen,
  setOptionsOpen,
  openConfirm,
  toggleConfirm,
  confirmSchedulerDelete,
  handleSchedulerDelete,
}) => {
  return (
    <div className="page-container">
      <PageTitle parts={[pageName, 'Schedulers', 'Settings']} />
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            {breadcrumbs.map(breadcrumb => (
              <Fragment key={breadcrumb.label}>
                <span className="breadcrumb-item">
                  <Link to={breadcrumb.path}>
                    <I18n>{breadcrumb.label}</I18n>
                  </Link>
                </span>{' '}
                <span aria-hidden="true">/ </span>
              </Fragment>
            ))}
            <h1>
              <I18n>{pageName}</I18n>
            </h1>
          </div>
          <div className="page-title__actions">
            {currentLoaded &&
              (mode !== 'edit' ? (
                <Fragment>
                  <button
                    onClick={() => {
                      setPreviousMode(mode);
                      setMode('edit');
                    }}
                    className="btn btn-primary"
                  >
                    <I18n>Edit Scheduler</I18n>
                  </button>
                  {isSchedulerAdmin && (
                    <ButtonDropdown
                      isOpen={optionsOpen}
                      toggle={() => setOptionsOpen(!optionsOpen)}
                    >
                      <DropdownToggle
                        className="dropdown-toggle hide-caret"
                        color="link"
                      >
                        <span className="fa fa-ellipsis-v fa-lg" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <button
                          onClick={confirmSchedulerDelete}
                          className="dropdown-item text-danger"
                        >
                          Delete Scheduler
                        </button>
                      </DropdownMenu>
                    </ButtonDropdown>
                  )}
                </Fragment>
              ) : (
                <button
                  onClick={() => {
                    setMode(previousMode);
                  }}
                  className="btn btn-secondary"
                >
                  <I18n>Cancel Edit</I18n>
                </button>
              ))}
          </div>
        </div>

        <div className="content-wrapper">
          {error && (
            <ErrorMessage
              title="Failed to retrieve scheduler"
              message={error.message}
            />
          )}
          {!error && (!scheduler || !currentLoaded) && <LoadingMessage />}
          {scheduler &&
            currentLoaded &&
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
                  {scheduler.values['Details'] && (
                    <div className="form-group">
                      <label>
                        <I18n>Details</I18n>
                      </label>
                      <div style={{ whiteSpace: 'pre' }}>
                        <I18n>{scheduler.values['Details']}</I18n>
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
                        <I18n>{scheduler.values['Location']}</I18n>{' '}
                        {scheduler.values['Latitude'] && (
                          <span className="text-muted">
                            {`(${scheduler.values['Latitude']}, ${
                              scheduler.values['Longitude']
                            })`}
                          </span>
                        )}
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
                              timestamp={moment(
                                scheduler.values['Scheduling Range Start Date'],
                                DATE_FORMAT,
                              )}
                              format={Moment.formats.date}
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
                              timestamp={moment(
                                scheduler.values['Scheduling Range End Date'],
                                DATE_FORMAT,
                              )}
                              format={Moment.formats.date}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <ul className="nav nav-tabs">
                    <TabPill
                      active={mode === 'managers'}
                      onClick={() => setMode('managers')}
                      label="Managers"
                    />
                    <TabPill
                      active={mode === 'agents'}
                      onClick={() => setMode('agents')}
                      label="Agents"
                    />
                    <TabPill
                      active={mode === 'config'}
                      onClick={() => setMode('config')}
                      label="Event Types"
                    />
                    <TabPill
                      active={mode === 'availability'}
                      onClick={() => setMode('availability')}
                      label="Availability"
                    />
                    <TabPill
                      active={mode === 'overrides'}
                      onClick={() => setMode('overrides')}
                      label="Availability Overrides"
                    />
                  </ul>
                  {mode === 'managers' && (
                    <SchedulerManagers profile={profile} />
                  )}
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

      {openConfirm && (
        <Modal isOpen={!!openConfirm} toggle={toggleConfirm}>
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={toggleConfirm}
              >
                <I18n>Cancel</I18n>
              </button>
              <span>
                <I18n>Confirm Delete</I18n>
              </span>
            </h4>
          </div>
          <ModalBody className="modal-body--padding">
            <div>
              <div>
                <I18n>
                  Are you sure you want to delete this Scheduler? This cannot be
                  undone.
                </I18n>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSchedulerDelete}
            >
              <I18n>Delete</I18n>
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export const mapStateToProps = (state, props) => ({
  error: state.schedulers.scheduler.error,
  scheduler: state.schedulers.scheduler.data,
  managers: state.schedulers.scheduler.teams.managers,
  agents: state.schedulers.scheduler.teams.agents,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(props.profile),
  isSchedulerManager: selectHasRoleSchedulerManager(props.profile),
});

export const mapDispatchToProps = {
  push,
  fetchScheduler: actions.fetchSchedulerRequest,
  deleteScheduler: actions.deleteSchedulerRequest,
};

const toggleConfirm = ({ setOpenConfirm }) => () => setOpenConfirm(false);

const confirmSchedulerDelete = ({
  setOptionsOpen,
  setOpenConfirm,
  scheduler,
}) => e => {
  setOptionsOpen(false);
  const timezone = scheduler.values['Timezone'] || moment.tz.guess();
  if (
    scheduler.values['Scheduling Range End Date'] &&
    moment
      .tz(scheduler.values['Scheduling Range End Date'], DATE_FORMAT, timezone)
      .isBefore(moment.tz(timezone).startOf('day'))
  ) {
    setOpenConfirm(true);
  } else {
    addError(
      'You can only delete a Scheduler if it has a Scheduling Range End Date that is in the past.',
    );
  }
};

const handleSchedulerDelete = ({
  pathPrefix,
  setOpenConfirm,
  scheduler,
  deleteScheduler,
  push,
}) => () => {
  setOpenConfirm(false);
  searchSubmissions({
    search: new SubmissionSearch(true)
      .limit(1000)
      .index('values[Scheduler Id],values[Date],values[Time]')
      .eq('values[Scheduler Id]', scheduler.values['Id'])
      .gteq(
        'values[Date]',
        moment
          .tz(scheduler.values['Timezone'] || moment.tz.guess())
          .startOf('day')
          .format(DATE_FORMAT),
      )
      .build(),
    datastore: true,
    form: SCHEDULED_EVENT_FORM_SLUG,
    include: 'details,values',
  }).then(({ submissions, error }) => {
    if (error) {
      addError(
        'There was an error deleting the scheduler. Please contact an administrator.',
        'Delete Failed',
      );
    } else if (submissions.length > 0) {
      addError(
        'You cannot delete a Scheduler if it still has future events scheduled.',
      );
    } else {
      deleteScheduler({
        id: scheduler.id,
        successCallback: () => {
          addSuccess(
            'The Scheduler was sucessfully deleted.',
            'Delete Successful',
          );
          push(pathPrefix);
        },
      });
    }
  });
};

export const Scheduler = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openConfirm', 'setOpenConfirm', false),
  withState('optionsOpen', 'setOptionsOpen', false),
  withState('mode', 'setMode', 'managers'),
  withState('previousMode', 'setPreviousMode', ''),
  withHandlers({
    handleUpdated,
    handleError,
    toggleConfirm,
    confirmSchedulerDelete,
    handleSchedulerDelete,
  }),
  withProps(({ id, mode, scheduler }) => ({
    currentLoaded: scheduler && scheduler.id === id,
    pageName: `
      ${mode === 'edit' ? 'Edit ' : ''}
      ${scheduler && scheduler.id === id ? scheduler.values['Name'] : ''}
    `,
  })),
  lifecycle({
    componentDidMount() {
      this.props.fetchScheduler({
        id: this.props.id,
      });
    },
  }),
)(SchedulerComponent);
