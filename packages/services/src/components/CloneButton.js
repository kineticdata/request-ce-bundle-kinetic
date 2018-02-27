import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../redux/modules/submission';

const CloneButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-default">
    Clone as Draft
  </button>
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  cloneSubmission: actions.cloneSubmission,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleClick: props => () => props.cloneSubmission(props.submission.id),
  }),
);

export const CloneButtonContainer = enhance(CloneButton);
