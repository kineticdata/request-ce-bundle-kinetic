import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import { push } from 'redux-first-history';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { CoreForm } from '@kineticdata/react';
import { Button } from 'reactstrap';
import { addSuccess, addError, Loading } from 'common';
import { PageTitle } from '../shared/PageTitle';

import { isActiveClass } from '../../utils';
import { RobotExecutionsList } from './RobotExecutionsList';
import { PopConfirm } from '../shared/PopConfirm';

import { actions, ROBOT_FORM_SLUG } from '../../redux/modules/settingsRobots';
import { context } from '../../redux/store';

import { I18n } from '@kineticdata/react';

const globals = import('common/globals');

const RobotComponent = ({
  robot,
  robotId,
  robotLoading,
  robotErrors,
  type,
  handleLoaded,
  handleUpdated,
  handleError,
  confirmDelete,
  setConfirmDelete,
  processDelete,
}) => {
  const loading = robotLoading && (robot === null || robot.id !== robotId);
  const isInactive =
    !loading && robot && robot.values['Status'].toLowerCase() === 'inactive';
  const isExpired =
    !loading &&
    robot &&
    robot.values['End Date'] &&
    moment(robot.values['End Date']).isBefore(moment());
  return (
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
            <h1>{!loading && robot && robot.values['Robot Name']}</h1>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <Fragment>
            {robot === null &&
              robotErrors.length > 0 && (
                <div className="text-center text-danger">
                  <h1>
                    <I18n>Oops!</I18n>
                  </h1>
                  <h2>
                    <I18n>Robot Not Found</I18n>
                  </h2>
                  {robotErrors.map(error => (
                    <p className="error-details">{error}</p>
                  ))}
                </div>
              )}
            {robot !== null && (
              <Fragment>
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
                {type === 'details' && (
                  <div>
                    {(isInactive || isExpired) && (
                      <div className="alert alert-warning">
                        <I18n>This robot is</I18n>{' '}
                        {isInactive && (
                          <strong>
                            <I18n>Inactive</I18n>
                          </strong>
                        )}
                        {isInactive &&
                          isExpired && (
                            <I18n
                              render={translate => ` ${translate('and')} `}
                            />
                          )}
                        {isExpired && (
                          <strong>
                            <I18n>Expired</I18n>
                          </strong>
                        )}
                        {'.'}
                      </div>
                    )}
                    <I18n context={`datastore.forms.${ROBOT_FORM_SLUG}`}>
                      <CoreForm
                        datastore
                        submission={robotId}
                        loaded={handleLoaded}
                        updated={handleUpdated}
                        error={handleError}
                        globals={globals}
                      />
                    </I18n>
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
                        <I18n>Delete robot</I18n> {robot.values['Robot Name']}?
                      </p>
                      <Button color="danger" onClick={processDelete}>
                        <I18n>Yes</I18n>
                      </Button>
                      <Button
                        color="link"
                        onClick={() => setConfirmDelete(!confirmDelete)}
                      >
                        <I18n>No</I18n>
                      </Button>
                    </PopConfirm>
                  </div>
                )}
                {type === 'executions' && (
                  <RobotExecutionsList robotId={robotId} />
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
  props.fetchRobot(response.submission.id);
  addSuccess(
    `Successfully updated robot (${response.submission.values['Robot Name']})`,
    'Robot Updated!',
  );
};

export const handleError = props => response => {
  addError(response.error, 'Error');
};

export const handleDelete = props => () => {
  props.setConfirmDelete(true);
};

export const processDelete = props => () => {
  const robotName = props.robot.values['Robot Name'];
  props.deleteRobot({
    id: props.robot.id,
    callback: () => {
      props.push(`/settings/robots`);
      addSuccess(`Successfully deleted robot (${robotName})`, 'Robot Deleted!');
    },
  });
};

export const mapStateToProps = state => ({
  robot: state.settingsRobots.robot,
  robotLoading: state.settingsRobots.robotLoading,
  robotErrors: state.settingsRobots.robotErrors,
});

export const mapDispatchToProps = {
  push,
  fetchRobot: actions.fetchRobot,
  deleteRobot: actions.deleteRobot,
};

export const Robot = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withProps(props => {
    switch (props.mode) {
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
      this.props.fetchRobot(this.props.robotId);
    },
  }),
)(RobotComponent);
