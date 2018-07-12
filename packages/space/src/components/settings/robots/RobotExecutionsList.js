import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers } from 'recompose';
import moment from 'moment';
import { Constants, Loading } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import {
  actions,
  ROBOT_EXECUTIONS_PAGE_SIZE,
} from '../../../redux/modules/settingsRobots';

const getStatusColor = status =>
  status === 'Queued'
    ? 'status--yellow'
    : status === 'Running'
      ? 'status--green'
      : 'status--gray';

const WallyEmptyMessage = () => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Executions Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Executions are a record of a run of a robot</h6>
    </div>
  );
};

const RobotExecutionsListComponent = ({
  robot,
  robotExecutions,
  robotExecutionsLoading,
  robotExecutionsErrors,
  scheduleId,
  hasNextPage,
  hasPreviousPage,
  handleNextPage,
  handlePreviousPage,
  handleReload,
  pageStartIndex,
  pageEndIndex,
}) => {
  const loading =
    robotExecutionsLoading &&
    (robotExecutions.size <= 0 ||
      robotExecutions.get(0).values['Robot ID'] !== robot.values['Robot ID'] ||
      (scheduleId !== undefined &&
        robotExecutions.get(0).values['Schedule ID'] !== scheduleId));
  return loading ? (
    <Loading />
  ) : (
    <Fragment>
      {robotExecutions.size <= 0 &&
        robotExecutionsErrors.length > 0 && (
          <div className="text-center text-danger">
            <h1>Oops!</h1>
            <h2>Robot Executions Not Found</h2>
            {robotExecutionsErrors.map(error => (
              <p className="error-details">{error}</p>
            ))}
          </div>
        )}
      {robotExecutions.size > 0 && (
        <table className="table table-sm table-striped table-robots">
          <thead className="header">
            <tr>
              <th>Schedule Name</th>
              <th width="10%">Status</th>
              <th>Start</th>
              <th>End</th>
              <th width="1%" />
            </tr>
          </thead>
          <tbody>
            {robotExecutions.map(execution => {
              return (
                <tr key={execution.id}>
                  <td>{execution.values['Schedule Name']}</td>
                  <td>
                    <span
                      className={`status ${getStatusColor(
                        execution.values['Status'],
                      )}`}
                    >
                      {execution.values['Status']}
                    </span>
                  </td>
                  <td>
                    {moment(execution.values['Start']).format(
                      Constants.TIME_FORMAT,
                    )}
                  </td>
                  <td>
                    {moment(execution.values['End']).format(
                      Constants.TIME_FORMAT,
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/settings/robots/${robot.id}/schedules/${
                        execution.values['Schedule ID']
                      }/executions/${execution.id}`}
                    >
                      <span>View&nbsp;</span>
                      <span className="fa fa-external-link-square" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {robotExecutionsErrors.length <= 0 &&
        robotExecutions.size === 0 && <WallyEmptyMessage />}
      <div className="robots-pagination">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-inverse"
            disabled={!hasPreviousPage}
            onClick={handlePreviousPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-left" />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-inverse"
            disabled={robotExecutionsLoading}
            onClick={handleReload}
          >
            <span className="icon">
              <span
                className={`fa fa-fw ${
                  robotExecutionsLoading ? 'fa-spin fa-spinner' : 'fa-refresh'
                }`}
              />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-inverse"
            disabled={!hasNextPage}
            onClick={handleNextPage}
          >
            <span className="icon">
              <span className="fa fa-fw fa-caret-right" />
            </span>
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotExecutions: state.space.settingsRobots.robotExecutions,
  robotExecutionsLoading: state.space.settingsRobots.robotExecutionsLoading,
  robotExecutionsErrors: state.space.settingsRobots.robotExecutionsErrors,
  hasNextPage: !!state.space.settingsRobots.robotExecutionsNextPageToken,
  hasPreviousPage: !state.space.settingsRobots.robotExecutionsPreviousPageTokens.isEmpty(),
});

export const mapDispatchToProps = {
  push,
  fetchRobotExecutions: actions.fetchRobotExecutions,
  fetchRobotExecutionsNextPage: actions.fetchRobotExecutionsNextPage,
  fetchRobotExecutionsPreviousPage: actions.fetchRobotExecutionsPreviousPage,
};

export const RobotExecutionsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleNextPage: props => () =>
      props.fetchRobotExecutionsNextPage(
        props.robot.values['Robot ID'],
        props.scheduleId,
      ),
    handlePreviousPage: props => () =>
      props.fetchRobotExecutionsPreviousPage(
        props.robot.values['Robot ID'],
        props.scheduleId,
      ),
    handleReload: props => () =>
      props.fetchRobotExecutions(
        props.robot.values['Robot ID'],
        props.scheduleId,
      ),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotExecutions(
        this.props.robot.values['Robot ID'],
        this.props.scheduleId,
      );
    },
  }),
)(RobotExecutionsListComponent);
