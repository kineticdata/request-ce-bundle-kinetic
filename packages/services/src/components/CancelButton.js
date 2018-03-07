import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { commonActions } from 'common';
import { actions } from '../redux/modules/submission';
import * as constants from '../constants';
import { getCancelFormConfig } from '../helpers';

const CancelButton = props => (
  <button
    type="button"
    onClick={props.handleClick}
    className="btn btn-outline-danger"
  >
    {props.submission.coreState === constants.CORE_STATE_DRAFT
      ? 'Cancel Request'
      : 'Request to Cancel'}
  </button>
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  deleteSubmission: actions.deleteSubmission,
  openForm: commonActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleClick: props => () => {
      if (props.submission.coreState === constants.CORE_STATE_DRAFT) {
        props.deleteSubmission(props.submission.id, props.deleteCallback);
      } else {
        props.openForm(getCancelFormConfig(props.submission.id));
      }
    },
  }),
);

export const CancelButtonContainer = enhance(CancelButton);
