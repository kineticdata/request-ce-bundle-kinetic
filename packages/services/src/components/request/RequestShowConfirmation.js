import React, { Fragment } from 'react';
import { compose, withHandlers } from 'recompose';
import { openModalForm, selectAdminKappSlug } from 'common';
import { connect } from '../../redux/store';

import { getFeedbackFormConfig } from '../../utils';
import { I18n } from '@kineticdata/react';

export const RequestShowConfirmation = ({ handleOpenFeedback }) => (
  <Fragment>
    <h2 className="h4">
      <I18n>Thank you for your submission.</I18n>
    </h2>

    <p>
      <I18n>With</I18n>{' '}
      <button className="btn btn-text" onClick={handleOpenFeedback}>
        <I18n>Feedback</I18n>
      </button>{' '}
      <I18n>we are able to continuously improve.</I18n>
    </p>
  </Fragment>
);

export const mapStateToProps = state => ({
  adminKappSlug: selectAdminKappSlug(state),
});

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    handleOpenFeedback: props => () =>
      openModalForm(
        getFeedbackFormConfig(props.adminKappSlug, props.submission.id),
      ),
  }),
);

export const RequestShowConfirmationContainer = enhance(
  RequestShowConfirmation,
);
