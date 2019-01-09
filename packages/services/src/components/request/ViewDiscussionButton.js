import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

const ViewDiscussionButton = props =>
  props.isSmallLayout &&
  props.hasDiscussions && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-outline-info"
    >
      View Discussion
    </button>
  );

export const mapStateToProps = state => ({
  isSmallLayout: state.app.layout.get('size') === 'small',
  hasDiscussions: state.services.submission.discussion !== null,
});

const enhance = compose(
  connect(
    mapStateToProps,
    null,
  ),
  withHandlers({
    handleClick: props => () => {
      props.openDiscussion();
    },
  }),
);

export const ViewDiscussionButtonContainer = enhance(ViewDiscussionButton);
