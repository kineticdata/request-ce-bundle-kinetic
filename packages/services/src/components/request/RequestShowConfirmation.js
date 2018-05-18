import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { modalFormActions } from 'common';
import { getFeedbackFormConfig } from '../../utils';

export const RequestShowConfirmation = ({ handleOpenFeedback }) => (
  <Fragment>
    <h4>Thank you for your submission.</h4>

    <p>
      With&nbsp;
      <a onClick={handleOpenFeedback} role="button" tabIndex={0}>
        Feedback
      </a>
      &nbsp;we are able to continuously improve.
    </p>
  </Fragment>
);

const enhance = compose(
  connect(null, { openForm: modalFormActions.openForm }),
  withHandlers({
    handleOpenFeedback: props => () =>
      props.openForm(getFeedbackFormConfig(props.submission.id)),
  }),
);

export const RequestShowConfirmationContainer = enhance(
  RequestShowConfirmation,
);
