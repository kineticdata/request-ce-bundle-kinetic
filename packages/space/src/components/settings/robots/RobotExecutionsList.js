import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers } from 'recompose';
import moment from 'moment';
import { Constants, Loading, PageTitle } from 'common';
import { NavLink } from 'react-router-dom';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsRobots';

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
  robotExecutions,
  robotExecutionsLoading,
  robotExecutionsErrors,
  scheduleId,
  match,
  hasNextPage,
  hasPreviousPage,
  handleNextPage,
  handlePreviousPage,
  handleReload,
}) => {
  const loading =
    robotExecutionsLoading &&
    (robotExecutions.size <= 0 ||
      (scheduleId !== undefined &&
        robotExecutions.get(0).values['Schedule ID'] !== scheduleId));
  return loading ? (
    <Loading />
  ) : (
    <div className="page-container page-container--robots">
      <PageTitle parts={['Schedules', 'Robots', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
              <Link to="/settings/robots">robots</Link> /{` `}
            </h3>
            <h1>Executions</h1>
          </div>
        </div>
        <div className="tab-navigation tab-navigation--robots">
          <ul className="nav nav-tabs">
            <li role="presentation">
              <NavLink
                exact
                to={`/settings/robots/${match.params.scheduleId}`}
                activeClassName="active"
              >
                Details
              </NavLink>
            </li>
            <li role="presentation">
              <NavLink
                to={`/settings/robots/${match.params.scheduleId}/executions`}
                activeClassName="active"
              >
                Executions
              </NavLink>
            </li>
          </ul>
        </div>
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
                        to={`/settings/robots/${
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
      </div>
    </div>
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
      props.fetchRobotExecutionsNextPage(props.scheduleId),
    handlePreviousPage: props => () =>
      props.fetchRobotExecutionsPreviousPage(props.scheduleId),
    handleReload: props => () => props.fetchRobotExecutions(props.scheduleId),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotExecutions(this.props.match.params.scheduleId);
    },
  }),
)(RobotExecutionsListComponent);
