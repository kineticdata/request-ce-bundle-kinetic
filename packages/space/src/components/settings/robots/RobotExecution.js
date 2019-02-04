import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import {
  actions,
  ROBOT_EXECUTIONS_FORM_SLUG,
} from '../../../redux/modules/settingsRobots';
import { CoreForm } from 'react-kinetic-core';
import { toastActions } from 'common';
import { I18n } from '../../../../../app/src/I18nProvider';

const globals = import('common/globals');

const RobotExecutionComponent = ({ robotExecution, match, handleError }) => {
  return (
    <div className="page-container page-container--robots">
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
              {robotExecution && (
                <Link to={`/settings/robots/${match.params.robotId}`}>
                  <span>{robotExecution.values['Robot Name']}</span>
                </Link>
              )}
            </h3>
            <h1>
              <I18n>Execution Details</I18n>
            </h1>
          </div>
        </div>
        <I18n context={`datastore.forms.${ROBOT_EXECUTIONS_FORM_SLUG}`}>
          <CoreForm
            datastore
            review
            submission={match.params.executionId}
            error={handleError}
            globals={globals}
          />
        </I18n>
      </div>
    </div>
  );
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
  robotExecution: state.space.settingsRobots.robotExecution,
});

export const mapDispatchToProps = {
  push,
  fetchRobotExecution: actions.fetchRobotExecution,
  addError: toastActions.addError,
};

export const RobotExecution = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleError,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotExecution(this.props.match.params.executionId);
    },
  }),
)(RobotExecutionComponent);
