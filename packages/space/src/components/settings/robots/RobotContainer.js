import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { toastActions } from 'common';
import { CreateRobotSchedule } from './CreateRobotSchedule';
import { RobotSchedule } from './RobotSchedule';
import { RobotExecution } from './RobotExecution';
import { RobotExecutionsList } from './RobotExecutionsList';
import { RobotSchedulesList } from './RobotSchedulesList';

const RobotError = () => <h1>Error loading Robot</h1>;

const RobotContainerComponent = ({ match }) => (
  <Fragment>
    <Switch>
      <Route exact path={`${match.path}/error`} component={RobotError} />
      <Route
        exact
        path={`${match.path}/schedules/new`}
        component={CreateRobotSchedule}
      />
      <Route
        exact
        path={`${match.path}/:scheduleId`}
        component={RobotSchedule}
      />
      <Route
        exact
        path={`${match.path}/:scheduleId/executions`}
        component={RobotExecutionsList}
      />
      <Route
        exact
        path={`${match.path}/:scheduleId/executions/:executionId`}
        component={RobotExecution}
      />
      <Route exact path={`${match.path}`} component={RobotSchedulesList} />
    </Switch>
  </Fragment>
);

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotLoading: state.space.settingsRobots.robotLoading,
  robotErrors: state.space.settingsRobots.robotErrors,
});

export const mapDispatchToProps = {
  push,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const RobotContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RobotContainerComponent);
