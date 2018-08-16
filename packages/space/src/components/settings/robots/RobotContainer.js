import React, { Fragment } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { actions } from '../../../redux/modules/settingsRobots';
import { toastActions, Loading, PageTitle } from 'common';
import { Robot } from './Robot';
import { CreateRobotSchedule } from './CreateRobotSchedule';
import { RobotSchedule } from './RobotSchedule';
import { RobotExecution } from './RobotExecution';

const RobotError = () => <h1>Error loading Robot</h1>;

const RobotContainerComponent = ({
  robot,
  robotLoading,
  robotErrors,
  match,
}) => {
  const loading =
    robotLoading && (robot === null || robot.id !== match.params.id);
  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      {robot === null &&
        robotErrors.length > 0 && (
          <div className="page-container page-container--robots">
            <PageTitle parts={['Robots', 'Settings']} />
            <div className="page-panel page-panel--scrollable page-panel--robots-content">
              <div className="page-title">
                <div className="page-title__wrapper">
                  <h3>
                    <Link to="/">home</Link> /{` `}
                    <Link to="/settings">settings</Link> /{` `}
                    <Link to="/settings/robots">robots</Link> /{` `}
                  </h3>
                </div>
              </div>
              <div className="text-center text-danger">
                <h1>Oops!</h1>
                <h2>Robot Not Found</h2>
                {robotErrors.map(error => (
                  <p className="error-details">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      {robot !== null && (
        <Switch>
          <Route exact path={`${match.path}/error`} component={RobotError} />
          <Route
            exact
            path={`${match.path}/schedules/new`}
            component={CreateRobotSchedule}
          />
          <Route
            exact
            path={`${match.path}/schedules/:scheduleId/:mode?`}
            component={RobotSchedule}
          />
          <Route
            exact
            path={`${match.path}/executions/:executionId`}
            component={RobotExecution}
          />
          <Route
            exact
            path={`${match.path}/schedules/:scheduleId/executions/:executionId`}
            component={RobotExecution}
          />
          <Route path={`${match.path}/:mode?`} component={Robot} />
        </Switch>
      )}
    </Fragment>
  );
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotLoading: state.space.settingsRobots.robotLoading,
  robotErrors: state.space.settingsRobots.robotErrors,
});

export const mapDispatchToProps = {
  push,
  fetchRobot: actions.fetchRobot,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const RobotContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobot(this.props.match.params.id);
    },
  }),
)(RobotContainerComponent);
