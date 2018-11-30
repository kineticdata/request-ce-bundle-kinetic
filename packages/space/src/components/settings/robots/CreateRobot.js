import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { ROBOT_FORM_SLUG } from '../../../redux/modules/settingsRobots';
import { CoreForm } from 'react-kinetic-core';
import { toastActions } from 'common';

const globals = import('common/globals');

const CreateRobotComponent = ({
  robot,
  match,
  handleLoaded,
  handleCreated,
  handleError,
}) => (
  <div className="page-container page-container--robots">
    <div className="page-panel page-panel--scrollable page-panel--robots-content">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to="/settings/robots">robots</Link> /{` `}
          </h3>
          <h1>New Robot</h1>
        </div>
      </div>

      <div>
        <CoreForm
          datastore
          form={ROBOT_FORM_SLUG}
          loaded={handleLoaded}
          created={handleCreated}
          error={handleError}
          globals={globals}
        />
      </div>
    </div>
  </div>
);

export const handleLoaded = props => form => {
  const cancelButton = form.find('button.cancel-schedule')[0];
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      props.push(`/settings/robots`);
    });
  }
  const deleteButton = form.find('button.delete-schedule')[0];
  if (deleteButton) {
    deleteButton.remove();
  }
};

export const handleCreated = props => response => {
  props.addSuccess(
    `Successfully created robot (${response.submission.values['Name']})`,
    'Robot Created!',
  );
  props.push(`/settings/robots/${response.submission.id}`);
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const mapStateToProps = state => ({
  robot: state.space.settingsRobots.robot,
});

export const mapDispatchToProps = {
  push,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const CreateRobot = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleLoaded,
    handleCreated,
    handleError,
  }),
)(CreateRobotComponent);
