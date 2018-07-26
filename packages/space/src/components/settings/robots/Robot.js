import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { NavLink } from 'react-router-dom';
import {
  actions,
  hasRobotSchedules,
} from '../../../redux/modules/settingsRobots';
import { CoreForm } from 'react-kinetic-core';
import { Button } from 'reactstrap';
import { toastActions, PageTitle } from 'common';
import { RobotSchedulesList } from './RobotSchedulesList';
import { RobotExecutionsList } from './RobotExecutionsList';
import { PopConfirm } from '../../shared/PopConfirm';

const globals = import('common/globals');

const RobotComponent = ({
  robot,
  match,
  type,
  handleLoaded,
  handleUpdated,
  handleError,
  confirmDelete,
  setConfirmDelete,
  processDelete,
}) => (
  <div className="page-container page-container--robots">
    <PageTitle parts={[robot && robot.values['Name'], 'Robots', 'Settings']} />
    <div className="page-panel page-panel--scrollable page-panel--robots-content">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to="/settings/robots">robots</Link> /{` `}
          </h3>
          <h1>{robot && robot.values['Name']}</h1>
        </div>
        {type === 'schedules' &&
          robot && (
            <Link
              to={`/settings/robots/${robot.id}/schedules/new`}
              className="btn btn-primary"
            >
              Create Schedule
            </Link>
          )}
      </div>

      <div className="tab-navigation tab-navigation--robots">
        <ul className="nav nav-tabs">
          <li role="presentation">
            <NavLink
              exact
              to={`/settings/robots/${match.params.id}`}
              activeClassName="active"
            >
              Details
            </NavLink>
          </li>
          <li role="presentation">
            <NavLink
              to={`/settings/robots/${match.params.id}/schedules`}
              activeClassName="active"
            >
              Schedules
            </NavLink>
          </li>
          <li role="presentation">
            <NavLink
              to={`/settings/robots/${match.params.id}/executions`}
              activeClassName="active"
            >
              Executions
            </NavLink>
          </li>
        </ul>
      </div>
      {type === 'details' && (
        <div>
          <CoreForm
            datastore
            submission={match.params.id}
            loaded={handleLoaded}
            updated={handleUpdated}
            error={handleError}
            globals={globals}
          />
          <span id="popover-placeholder" />
          <PopConfirm
            target={
              (confirmDelete && 'delete-robot-btn') || 'popover-placeholder'
            }
            placement="left"
            isOpen={confirmDelete}
            toggle={() => setConfirmDelete(!confirmDelete)}
          >
            <p>Delete robot {robot.values['Name']}?</p>
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
      {type === 'schedules' && <RobotSchedulesList />}
      {type === 'executions' && <RobotExecutionsList />}
    </div>
  </div>
);

export const handleLoaded = props => form => {
  const deleteButton = form.find('button.delete-robot')[0];
  if (deleteButton) {
    deleteButton.addEventListener('click', props.handleDelete);
  }
  const cancelButton = form.find('button.cancel-robot')[0];
  if (cancelButton) {
    cancelButton.remove();
  }
};

export const handleUpdated = props => response => {
  props.fetchRobot(response.submission.id);
  props.addSuccess(
    `Successfully updated robot (${response.submission.values['Name']})`,
    'Robot Updated!',
  );
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const handleDelete = props => () => {
  hasRobotSchedules(
    props.robot.values['Robot ID'],
    ({ submissions, errors, error, serverError }) => {
      if (submissions && submissions.length > 0) {
        props.addError(
          'You can not delete a robot which has schedules. ' +
            'Please delete all schedules first.',
          'Not Allowed',
        );
      } else if (serverError || errors || error) {
        props.addError(
          'An error occurred while checking if schedules exit.',
          'Error',
        );
      } else {
        props.setConfirmDelete(true);
      }
    },
  );
};

export const processDelete = props => () => {
  const robotName = props.robot.values['Name'];
  props.deleteRobot({
    id: props.robot.id,
    callback: () => {
      props.push('/settings/robots');
      props.addSuccess(
        `Successfully deleted robot (${robotName})`,
        'Robot Deleted!',
      );
    },
  });
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
});

export const mapDispatchToProps = {
  push,
  fetchRobot: actions.fetchRobot,
  deleteRobot: actions.deleteRobot,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const Robot = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    switch (props.match.params.mode) {
      case 'schedules':
        return { type: 'schedules' };
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
      this.props.fetchRobot(this.props.match.params.id);
    },
  }),
)(RobotComponent);
