import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { Utils } from 'common';
import { actions } from '../../redux/modules/submission';
import { context } from '../../redux/store';

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
  deleteSubmission: actions.deleteSubmission,
  setSendMessageModalOpen: actions.setSendMessageModalOpen,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
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
        props.deleteSubmission(props.submission.id, props.deleteCallback);
      } else {
        props.setSendMessageModalOpen(true, 'cancel');
      }
    },
  }),
);

export const CancelButtonContainer = enhance(CancelButton);
