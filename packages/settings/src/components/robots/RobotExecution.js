import React from 'react';
import { Link } from '@reach/router';
import { push } from 'redux-first-history';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import {
  actions,
  ROBOT_EXECUTIONS_FORM_SLUG,
} from '../../redux/modules/settingsRobots';
import { CoreForm } from '@kineticdata/react';
import { addError } from 'common';

import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const globals = import('common/globals');

const RobotExecutionComponent = ({ robotExecution, match, handleError }) => {
  return (
    <div className="page-container page-container--robots">
      <div className="page-panel page-panel--scrollable page-panel--robots-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
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
  addError(response.error, 'Error');
};

export const mapStateToProps = state => ({
  robot: state.settingsRobots.robot,
  robotExecution: state.settingsRobots.robotExecution,
});

export const mapDispatchToProps = {
  push,
  fetchRobotExecution: actions.fetchRobotExecution,
};

export const RobotExecution = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withHandlers({
    handleError,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRobotExecution(this.props.executionId);
    },
  }),
)(RobotExecutionComponent);
