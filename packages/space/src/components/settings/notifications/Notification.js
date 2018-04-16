import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { ButtonGroup, Button } from 'reactstrap';
import { CoreForm } from 'react-kinetic-core';
import { LinkContainer } from 'react-router-bootstrap';

import { actions as toastActions } from 'kinops/src/redux/modules/toasts';

import {
  selectPrevAndNext,
  actions,
  NOTIFICATIONS_FORM_SLUG,
  selectKapps,
} from '../../../redux/modules/settingsNotifications';

const globals = import('common/globals');

const NotificationComponent = ({
  form,
  showPrevAndNext,
  prevAndNext,
  submissionId,
  submissionLabel,
  handleCreated,
  handleUpdated,
  handleError,
  submission,
  isEditing,
  handleEditClick,
  formKey,
  notificationType,
}) => (
  <div className="datastore-container">
    <div className="datastore-content">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to={`/settings/notifications`}>notifications</Link> /{` `}
          </h3>
          <h1>
            {submissionId ? (submission ? submission.label : '') : ' New'}
          </h1>
        </div>
        <div className="page-title-actions">
          {showPrevAndNext &&
            !isEditing && (
              <ButtonGroup className="datastore-prev-next">
                <LinkContainer to={prevAndNext.prev || ''}>
                  <Button color="inverse" disabled={!prevAndNext.prev}>
                    <span className="icon">
                      <span className="fa fa-fw fa-caret-left" />
                    </span>
                  </Button>
                </LinkContainer>
                <LinkContainer to={prevAndNext.next || ''}>
                  <Button color="inverse" disabled={!prevAndNext.next}>
                    <span className="icon">
                      <span className="fa fa-fw fa-caret-right" />
                    </span>
                  </Button>
                </LinkContainer>
              </ButtonGroup>
            )}
          {submissionId &&
            !isEditing && (
              <Link
                to={`/settings/notifications/${submissionId}/edit`}
                className="btn btn-primary ml-3 datastore-edit"
              >
                Edit Record
              </Link>
            )}
        </div>
      </div>
      <div>
        {submissionId ? (
          <CoreForm
            datastore
            review={!isEditing}
            submission={submissionId}
            updated={handleUpdated}
            error={handleError}
            globals={globals}
          />
        ) : (
          <CoreForm
            key={formKey}
            form={NOTIFICATIONS_FORM_SLUG}
            datastore
            onCreated={handleCreated}
            error={handleError}
            globals={globals}
          />
        )}
      </div>
    </div>
  </div>
);

export const getRandomKey = () =>
  Math.floor(Math.random() * (100000 - 100 + 1)) + 100;

export const shouldPrevNextShow = state =>
  state.settingsNotifications.notification !== null &&
  state.settingsNotifications.notifications.size > 0;

export const getIsEditing = props => (props.match.params.mode ? true : false);

export const handleUpdated = props => response => {
  if (props.submissionId) {
    props.addSuccess(
      `Successfully updated notitication (${response.submission.handle})`,
      'Notification Updated!',
    );
    props.push(props.match.url.replace('/edit', ''));
  }
};

export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const handleCreated = props => (response, actions) => {
  props.addSuccess(
    `Successfully created notification (${response.submission.handle})`,
    'Notification Created!',
  );
  props.setFormKey(getRandomKey());
};

export const handleEditClick = props => () => {
  props.push(`${props.match.url}/edit`);
};

export const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  submission: state.settingsNotifications.notification,
  showPrevAndNext: shouldPrevNextShow(state),
  prevAndNext: selectPrevAndNext(state),
  notificationType: state.settingsNotifications.notificationType,
  isEditing: params.mode && params.mode === 'edit' ? true : false,

  kapps: selectKapps,
});

export const mapDispatchToProps = {
  push,
  fetchNotification: actions.fetchNotification,
  resetNotification: actions.resetNotification,
  fetchVariables: actions.fetchVariables,
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
};

export const Notification = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('formKey', 'setFormKey', getRandomKey),
  withHandlers({
    handleUpdated,
    handleCreated,
    handleEditClick,
    handleError,
  }),
  lifecycle({
    componentWillMount() {
      if (this.props.match.params.id) {
        this.props.fetchNotification(this.props.match.params.id);
      }
      this.props.fetchVariables();
    },
    componentWillReceiveProps(nextProps) {
      if (
        nextProps.match.params.id &&
        this.props.match.params.id !== nextProps.match.params.id
      ) {
        this.props.fetchNotification(nextProps.match.params.id);
      }
    },
    componentWillUnmount() {
      this.props.resetNotification();
    },
  }),
)(NotificationComponent);
