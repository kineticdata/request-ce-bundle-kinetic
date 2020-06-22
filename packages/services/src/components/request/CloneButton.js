import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { Utils } from 'common';
import { actions } from '../../redux/modules/submission';
import { connect } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const CloneButton = props =>
  props.enableButton && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-secondary"
    >
      <I18n>Clone as Draft</I18n>
    </button>
  );

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  cloneSubmission: actions.cloneSubmissionRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    const disabledAttribute = Utils.getAttributeValue(
      props.submission.form,
      'Cloning Disabled',
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
      props.cloneSubmission({
        id: props.submission.id,
        success: clonedSubmission =>
          props.navigate(`../../../../Draft/request/${clonedSubmission.id}`),
      }),
  }),
);

export const CloneButtonContainer = enhance(CloneButton);
