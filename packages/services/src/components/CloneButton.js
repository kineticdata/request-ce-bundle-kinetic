import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { actions } from '../redux/modules/submission';
import { getAttributeValue } from '../helpers';

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
    const disabledAttribute = getAttributeValue(
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
