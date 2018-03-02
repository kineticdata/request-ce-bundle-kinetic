import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { commonActions } from 'common';
import { getCommentFormConfig } from '../helpers';

const CommentButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-success">
    Add Comment
  </button>
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  openForm: commonActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleClick: props => () =>
      props.openForm(getCommentFormConfig(props.submission.id)),
  }),
);

export const CommentButtonContainer = enhance(CommentButton);
