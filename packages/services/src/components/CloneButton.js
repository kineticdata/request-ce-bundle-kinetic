import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { Utils } from 'common';
import { actions } from '../redux/modules/submission';

const CloneButton = props =>
  props.enableButton && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-secondary"
    >
      Clone as Draft
    </button>
  );

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  cloneSubmission: actions.cloneSubmission,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
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
    handleClick: props => () => props.cloneSubmission(props.submission.id),
  }),
);

export const CloneButtonContainer = enhance(CloneButton);
