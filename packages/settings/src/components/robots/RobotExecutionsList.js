import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { compose, lifecycle, withHandlers } from 'recompose';
import moment from 'moment';
import { Constants, Loading } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';

import { isActiveClass } from '../../utils';
import { actions } from '../../redux/modules/settingsRobots';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';
import { PageTitle } from '../shared/PageTitle';

const getStatusColor = status =>
  status === 'Queued'
    ? 'status--yellow'
    : status === 'Running'
      ? 'status--green'
      : 'status--gray';

const WallyEmptyMessage = () => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Executions Found</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        <I18n>Executions are a record of a run of a robot</I18n>
      </h6>
    </div>
  );
};

const RobotExecutionsListComponent = ({
  robot,
  robotExecutions,
  robotExecutionsLoading,
  robotExecutionsErrors,
  robotId,
  hasNextPage,
  hasPreviousPage,
  handleNextPage,
  handlePreviousPage,
  handleReload,
}) => {
  const loading =
    robotExecutionsLoading &&
    (robotExecutions.size <= 0 ||
      (robotId !== undefined &&
        robotExecutions.get(0).values['Robot ID'] !== robotId));
  return loading ? (
    <Loading />
  ) : (
    <div className="page-container">
      <PageTitle parts={['Robots', 'Settings']} />
      <div className="page-panel page-panel--white">
        <div className="page-title">
          <div
            role="navigation"
            aria-label="breadcrumbs"
            className="page-title__breadcrumbs"
          >
            <span className="breadcrumb-item">
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <span className="breadcrumb-item">
              <Link to="/settings/robots">
                <I18n>robots</I18n>
              </Link>
            </span>{' '}
            <span aria-hidden="true">/ </span>
            <h1>
              {(robot && robot.values['Robot Name']) || <I18n>Executions</I18n>}
            </h1>
          </div>
        </div>
        <div className="tab-navigation tab-navigation--robots">
          <ul className="nav nav-tabs">
            <li role="presentation">
              <Link
                to={`/settings/robots/${robotId}`}
                getProps={isActiveClass()}
              >
                <I18n>Details</I18n>
              </Link>
            </li>
            <li role="presentation">
              <Link
                to={`/settings/robots/${robotId}/executions`}
                getProps={isActiveClass()}
              >
                <I18n>Executions</I18n>
              </Link>
            </li>
          </ul>
        </div>
        {robotExecutions.size <= 0 &&
          robotExecutionsErrors.length > 0 && (
            <div className="text-center text-danger">
              <h1>
                <I18n>Oops!</I18n>
              </h1>
              <h2>
                <I18n>Robot Executions Not Found</I18n>
              </h2>
              {robotExecutionsErrors.map(error => (
                <p className="error-details">{error}</p>
              ))}
            </div>
          )}
        {robotExecutions.size > 0 && (
          <table className="table table-sm table-striped table-robots">
            <thead className="header">
              <tr>
                <th scope="col">
                  <I18n>Robot Name</I18n>
                </th>
                <th scope="col" width="10%">
                  <I18n>Status</I18n>
                </th>
                <th scope="col">
                  <I18n>Start</I18n>
                </th>
                <th scope="col">
                  <I18n>End</I18n>
                </th>
                <th width="1%" />
              </tr>
            </thead>
            <tbody>
              {robotExecutions.map(execution => {
                return (
                  <tr key={execution.id}>
                    <td>{execution.values['Robot Name']}</td>
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
                      {execution.values['Status'].toLowerCase() !== 'running' &&
                        execution.values['End'] &&
                        moment(execution.values['End']).format(
                          Constants.TIME_FORMAT,
                        )}
                    </td>
                    <td>
                      <Link
                        to={`/settings/robots/${
                          execution.values['Robot ID']
                        }/executions/${execution.id}`}
                      >
                        <span>
                          <I18n>View</I18n>{' '}
                        </span>
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
  robot: state.settingsRobots.robot,
  robotExecutions: state.settingsRobots.robotExecutions,
  robotExecutionsLoading: state.settingsRobots.robotExecutionsLoading,
  robotExecutionsErrors: state.settingsRobots.robotExecutionsErrors,
  hasNextPage: !!state.settingsRobots.robotExecutionsNextPageToken,
  hasPreviousPage: !state.settingsRobots.robotExecutionsPreviousPageTokens.isEmpty(),
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
    null,
    { context },
  ),
  withHandlers({
    handleNextPage: props => () =>
      props.fetchRobotExecutionsNextPage(props.robotId),
    handlePreviousPage: props => () =>
      props.fetchRobotExecutionsPreviousPage(props.robotId),
    handleReload: props => () => props.fetchRobotExecutions(props.robotId),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotExecutions(this.props.robotId);
    },
  }),
)(RobotExecutionsListComponent);
