import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { NavLink } from 'react-router-dom';
import { actions } from '../../../redux/modules/settingsRobots';
import { CoreForm } from 'react-kinetic-core';
import { Button } from 'reactstrap';
import { toastActions, Loading, PageTitle } from 'common';
import { RobotExecutionsList } from './RobotExecutionsList';
import { PopConfirm } from '../../shared/PopConfirm';

const globals = import('common/globals');

const RobotScheduleComponent = ({
  robot,
  robotSchedule,
  robotScheduleLoading,
  robotScheduleErrors,
  match,
  type,
  handleLoaded,
  handleUpdated,
  handleError,
  confirmDelete,
  setConfirmDelete,
  processDelete,
}) => {
  const loading =
    robotScheduleLoading &&
    (robotSchedule === null || robotSchedule.id !== match.params.scheduleId);
  const isInactive =
    !loading &&
    robotSchedule &&
    robotSchedule.values['Status'].toLowerCase() === 'inactive';
  const isExpired =
    !loading &&
    robotSchedule &&
    robotSchedule.values['End Date'] &&
    moment(robotSchedule.values['End Date']).isBefore(moment());
  return (
    <div className="page-container page-container--robots">
      <PageTitle
        parts={['Schedules', robot.values['Name'], 'Robots', 'Settings']}
      />
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to="/settings/robots">robots</Link> /{` `}
              <Link to={`/settings/robots/${robot.id}/schedules`}>
                {robot.values['Name']}
              </Link>{' '}
              /{` `}
            </h3>
            <h1>
              {!loading &&
                robotSchedule &&
                robotSchedule.values['Schedule Name']}
            </h1>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <Fragment>
            {robotSchedule === null &&
              robotScheduleErrors.length > 0 && (
                <div className="text-center text-danger">
                  <h1>Oops!</h1>
                  <h2>Robot Schedule Not Found</h2>
                  {robotScheduleErrors.map(error => (
                    <p className="error-details">{error}</p>
                  ))}
                </div>
              )}
            {robotSchedule !== null && (
              <Fragment>
                <div className="tab-navigation tab-navigation--robots">
                  <ul className="nav nav-tabs">
                    <li role="presentation">
                      <NavLink
                        exact
                        to={`/settings/robots/${robot.id}/schedules/${
                          match.params.scheduleId
                        }`}
                        activeClassName="active"
                      >
                        Details
                      </NavLink>
                    </li>
                    <li role="presentation">
                      <NavLink
                        to={`/settings/robots/${robot.id}/schedules/${
                          match.params.scheduleId
                        }/executions`}
                        activeClassName="active"
                      >
                        Executions
                      </NavLink>
                    </li>
                  </ul>
                </div>
                {type === 'details' && (
                  <div>
                    {(isInactive || isExpired) && (
                      <div className="alert alert-warning">
                        {'This schedule is '}
                        {isInactive && <strong>Inactive</strong>}
                        {isInactive && isExpired && ' and '}
                        {isExpired && <strong>Expired</strong>}
                        {'.'}
                      </div>
                    )}
                    <CoreForm
                      datastore
                      submission={match.params.scheduleId}
                      loaded={handleLoaded}
                      updated={handleUpdated}
                      error={handleError}
                      globals={globals}
                    />
                    <span id="popover-placeholder" />
                    <PopConfirm
                      target={
                        (confirmDelete && 'delete-schedule-btn') ||
                        'popover-placeholder'
                      }
                      placement="left"
                      isOpen={confirmDelete}
                      toggle={() => setConfirmDelete(!confirmDelete)}
                    >
                      <p>
                        Delete robot schedule{' '}
                        {robotSchedule.values['Schedule Name']}?
                      </p>
                      <Button color="danger" onClick={processDelete}>
                        Yes
                      </Button>
                      <Button
                        color="link"
                        onClick={() => setConfirmDelete(!confirmDelete)}
                      >
                        No
                      </Button>
                    </PopConfirm>
                  </div>
                )}
                {type === 'executions' && (
                  <RobotExecutionsList scheduleId={match.params.scheduleId} />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export const handleLoaded = props => form => {
  const deleteButton = form.find('button.delete-schedule')[0];
  if (deleteButton) {
    deleteButton.addEventListener('click', props.handleDelete);
  }
  const cancelButton = form.find('button.cancel-schedule')[0];
  if (cancelButton) {
    cancelButton.remove();
  }
};

export const handleUpdated = props => response => {
  props.fetchRobotSchedule(response.submission.id);
  props.addSuccess(
    `Successfully updated robot schedule (${
      response.submission.values['Schedule Name']
    })`,
    'Robot Schedule Updated!',
  );
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const handleDelete = props => () => {
  props.setConfirmDelete(true);
};

export const processDelete = props => () => {
  const robotScheduleName = props.robotSchedule.values['Schedule Name'];
  props.deleteRobotSchedule({
    id: props.robotSchedule.id,
    callback: () => {
      props.push(`/settings/robots/${props.robot.id}/schedules`);
      props.addSuccess(
        `Successfully deleted robot schedule (${robotScheduleName})`,
        'Robot Schedule Deleted!',
      );
    },
  });
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotSchedule: state.space.settingsRobots.robotSchedule,
  robotScheduleLoading: state.space.settingsRobots.robotScheduleLoading,
  robotScheduleErrors: state.space.settingsRobots.robotScheduleErrors,
});

export const mapDispatchToProps = {
  push,
  fetchRobotSchedule: actions.fetchRobotSchedule,
  deleteRobotSchedule: actions.deleteRobotSchedule,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const RobotSchedule = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    switch (props.match.params.mode) {
      case 'executions':
        return { type: 'executions' };
      default:
        return { type: 'details' };
    }
  }),
  withState('confirmDelete', 'setConfirmDelete', false),
  withHandlers({
    handleDelete,
    processDelete,
  }),
  withHandlers({
    handleLoaded,
    handleUpdated,
    handleError,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotSchedule(this.props.match.params.scheduleId);
    },
  }),
)(RobotScheduleComponent);
