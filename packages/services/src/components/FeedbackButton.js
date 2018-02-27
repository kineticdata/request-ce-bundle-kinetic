import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { KinopsModule } from 'react-kinops-common';
import { getFeedbackFormConfig } from '../helpers';

const FeedbackButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-success">
    Provide Feedback
  </button>
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  openForm: KinopsModule.actions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleClick: props => () =>
      props.openForm(getFeedbackFormConfig(props.submission.id)),
  }),
);

export const FeedbackButtonContainer = enhance(FeedbackButton);
