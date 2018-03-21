import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { commonActions } from 'common';
import { getCommentFormConfig, getAttributeValue } from '../helpers';

const CommentButton = props =>
  props.enableButton && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-success"
    >
      Add Comment
    </button>
  );

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  openForm: commonActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => {
    const disabledAttribute = getAttributeValue(
      props.submission.form,
      'Comment Disabled',
      'false',
    ).toLowerCase();
    return {
      enableButton:
        disabledAttribute === 'true' || disabledAttribute === 'yes'
          ? false
          : true,
    };
  }),
  withHandlers({
    handleClick: props => () =>
      props.openForm(getCommentFormConfig(props.submission.id)),
  }),
);

export const CommentButtonContainer = enhance(CommentButton);
