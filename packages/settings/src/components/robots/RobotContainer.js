import React from 'react';
import { push } from 'redux-first-history';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Router } from '../../App';
import { CreateRobot } from './CreateRobot';
import { Robot } from './Robot';
import { RobotExecution } from './RobotExecution';
import { RobotExecutionsList } from './RobotExecutionsList';
import { RobotsList } from './RobotsList';

import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const RobotError = () => (
  <h1>
    <I18n>Error loading Robot</I18n>
  </h1>
);

const RobotContainerComponent = () => (
  <Router>
    <RobotError path="error" />
    <CreateRobot path="robots/new" />
    <Robot path=":robotId" />
    <RobotExecutionsList path=":robotId/executions" />
    <RobotExecution path=":robotId/executions/:executionId" />
    <RobotsList default />
  </Router>
);

export const mapStateToProps = state => ({
  robot: state.settingsRobots.robot,
  robotLoading: state.settingsRobots.robotLoading,
  robotErrors: state.settingsRobots.robotErrors,
});

export const mapDispatchToProps = {
  push,
};

export const RobotContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
)(RobotContainerComponent);
