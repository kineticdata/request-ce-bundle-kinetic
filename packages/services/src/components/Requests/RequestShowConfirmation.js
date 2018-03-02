import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { commonActions } from 'common';
import { getFeedbackFormConfig } from '../../helpers';

export const RequestShowConfirmation = ({ handleOpenFeedback }) => (
  <div>
    <div className="row details">
      <h4>Thank you for your submission.</h4>
    </div>
    <div className="row details">
      <p>
        With&nbsp;
        <a onClick={handleOpenFeedback} role="button" tabIndex={0}>
          Feedback
        </a>
        &nbsp;we are able to continuously improve.
      </p>
    </div>
    <hr />
  </div>
);

const enhance = compose(
  connect(null, { openForm: commonActions.openForm }),
  withHandlers({
    handleOpenFeedback: props => () =>
      props.openForm(getFeedbackFormConfig(props.submission.id)),
  }),
);

export const RequestShowConfirmationContainer = enhance(
  RequestShowConfirmation,
);
