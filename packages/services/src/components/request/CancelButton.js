import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { Utils } from 'common';
import { actions } from '../../redux/modules/submission';
import { connect } from '../../redux/store';

import * as constants from '../../constants';
import { I18n } from '@kineticdata/react';

const CancelButton = props =>
  props.enableButton && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-outline-danger"
    >
      <I18n>
        {props.submission.coreState === constants.CORE_STATE_DRAFT
          ? 'Cancel Request'
          : 'Cancel Request'}
      </I18n>
    </button>
  );

export const mapStateToProps = state => ({
  kappSlug: state.app.kappSlug,
});

export const mapDispatchToProps = {
  deleteSubmission: actions.deleteSubmissionRequest,
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
        props.deleteSubmission({
          id: props.submission.id,
          callback: props.deleteCallback,
        });
      } else {
        props.setSendMessageModalOpen({ isOpen: true, type: 'cancel' });
      }
    },
  }),
);

export const CancelButtonContainer = enhance(CancelButton);
