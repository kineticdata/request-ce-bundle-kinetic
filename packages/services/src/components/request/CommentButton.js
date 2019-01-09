import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { Utils } from 'common';

import { actions } from '../../redux/modules/submission';

const CommentButton = props =>
  props.enableButton && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-success"
    >
      Start Discussion
    </button>
  );

export const mapStateToProps = state => ({});

export const mapDispatchToProps = {
  setSendMessageModalOpen: actions.setSendMessageModalOpen,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
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
    handleClick: props => () => props.setSendMessageModalOpen(true, 'comment'),
  }),
);

export const CommentButtonContainer = enhance(CommentButton);
