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
import {
  actions,
  ROBOT_FORM_SLUG,
} from '../../../redux/modules/settingsRobots';
import { CoreForm } from 'react-kinetic-lib';
import { Button } from 'reactstrap';
import { toastActions, Loading, PageTitle } from 'common';
import { RobotExecutionsList } from './RobotExecutionsList';
import { PopConfirm } from '../../shared/PopConfirm';
import { I18n } from '../../../../../app/src/I18nProvider';

const globals = import('common/globals');

const RobotComponent = ({
  robot,
  robotLoading,
  robotErrors,
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
    robotLoading && (robot === null || robot.id !== match.params.robotId);
  const isInactive =
    !loading && robot && robot.values['Status'].toLowerCase() === 'inactive';
  const isExpired =
    !loading &&
    robot &&
    robot.values['End Date'] &&
    moment(robot.values['End Date']).isBefore(moment());
  return (
    <div className="page-container page-container--robots">
      <PageTitle parts={['Robots', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/">
                <I18n>home</I18n>
              </Link>{' '}
              /{` `}
              <Link to="/settings">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
              <Link to="/settings/robots">
                <I18n>robots</I18n>
              </Link>{' '}
              /{` `}
            </h3>
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
                      <NavLink
                        exact
                        to={`/settings/robots/${match.params.robotId}`}
                        activeClassName="active"
                      >
                        <I18n>Details</I18n>
                      </NavLink>
                    </li>
                    <li role="presentation">
                      <NavLink
                        to={`/settings/robots/${
                          match.params.robotId
                        }/executions`}
                        activeClassName="active"
                      >
                        <I18n>Executions</I18n>
                      </NavLink>
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
                        submission={match.params.robotId}
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
                  <RobotExecutionsList robotId={match.params.robotId} />
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
  props.addSuccess(
    `Successfully updated robot (${response.submission.values['Robot Name']})`,
    'Robot Updated!',
  );
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
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
      props.addSuccess(
        `Successfully deleted robot (${robotName})`,
        'Robot Deleted!',
      );
    },
  });
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotLoading: state.space.settingsRobots.robotLoading,
  robotErrors: state.space.settingsRobots.robotErrors,
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
      this.props.fetchRobot(this.props.match.params.robotId);
    },
  }),
)(RobotComponent);
