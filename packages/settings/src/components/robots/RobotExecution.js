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

const RobotExecutionComponent = ({
  robotExecution,
  robotId,
  executionId,
  handleError,
}) => {
  return (
    <div className="page-container">
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
            {robotExecution && (
              <>
                <span className="breadcrumb-item">
                  <Link to={`/settings/robots/${robotId}`}>
                    <span>{robotExecution.values['Robot Name']}</span>
                  </Link>
                </span>{' '}
                <span aria-hidden="true">/ </span>
              </>
            )}
            <h1>
              <I18n>Execution Details</I18n>
            </h1>
          </div>
        </div>
        <I18n context={`datastore.forms.${ROBOT_EXECUTIONS_FORM_SLUG}`}>
          <CoreForm
            datastore
            review
            submission={executionId}
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
