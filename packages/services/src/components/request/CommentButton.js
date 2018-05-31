import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { modalFormActions, Utils } from 'common';
import { getCommentFormConfig } from '../../utils';

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

export const mapStateToProps = state => ({
  kappSlug: state.app.config.kappSlug,
});

export const mapDispatchToProps = {
  openForm: modalFormActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => {
    const disabledAttribute = Utils.getAttributeValue(
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
      props.openForm(getCommentFormConfig(props.kappSlug, props.submission.id)),
  }),
);

export const CommentButtonContainer = enhance(CommentButton);
