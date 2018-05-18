import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { modalFormActions } from 'common';
import { getFeedbackFormConfig } from '../../utils';

const FeedbackButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-success">
    Provide Feedback
  </button>
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  openForm: modalFormActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleClick: props => () =>
      props.openForm(getFeedbackFormConfig(props.submission.id)),
  }),
);

export const FeedbackButtonContainer = enhance(FeedbackButton);
