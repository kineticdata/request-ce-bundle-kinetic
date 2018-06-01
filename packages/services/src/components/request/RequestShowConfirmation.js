import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { modalFormActions } from 'common';
import { selectAdminKapp } from 'app/src/redux/selectors';

import { getFeedbackFormConfig } from '../../utils';

export const RequestShowConfirmation = ({ handleOpenFeedback }) => (
  <Fragment>
    <h4>Thank you for your submission.</h4>

    <p>
      With&nbsp;
      <a onClick={handleOpenFeedback} role="button" tabIndex={0}>
        Feedback
      </a>
      &nbsp;we are able to continuously improve.
    </p>
  </Fragment>
);

export const mapStateToProps = state => ({
  adminKappSlug: selectAdminKapp(state).slug,
});

export const mapDispatchToProps = {
  openForm: modalFormActions.openForm,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleOpenFeedback: props => () =>
      props.openForm(
        getFeedbackFormConfig(props.adminKappSlug, props.submission.id),
      ),
  }),
);

export const RequestShowConfirmationContainer = enhance(
  RequestShowConfirmation,
);
