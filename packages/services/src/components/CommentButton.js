import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { KinopsModule } from 'react-kinops-common';
import { getCommentFormConfig } from '../helpers';

const CommentButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-success">
    Add Comment
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
      props.openForm(getCommentFormConfig(props.submission.id)),
  }),
);

export const CommentButtonContainer = enhance(CommentButton);
