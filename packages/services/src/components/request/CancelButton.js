import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { modalFormActions, Utils } from 'common';
import { actions } from '../../redux/modules/submission';
import * as constants from '../../constants';
import { getCancelFormConfig } from '../../utils';

const CancelButton = props =>
  props.enableButton && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-outline-danger"
    >
      {props.submission.coreState === constants.CORE_STATE_DRAFT
        ? 'Cancel Request'
        : 'Cancel Request'}
    </button>
  );

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  deleteSubmission: actions.deleteSubmission,
  openForm: modalFormActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => {
    const disabledAttribute = Utils.getAttributeValue(
      props.submission.form,
      'Cancel Disabled',
      'false',
    ).toLowerCase();
    return {
      enableButton:
        props.submission.coreState === constants.CORE_STATE_DRAFT
          ? true
          : disabledAttribute === 'true' ||
            disabledAttribute === 'yes' ||
            props.submission.coreState === constants.CORE_STATE_CLOSED
            ? false
            : true,
    };
  }),
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
