import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { openModalForm } from 'common';
import { selectAdminKapp } from 'app/src/redux/selectors';
import { context } from '../../redux/store';

import { getFeedbackFormConfig } from '../../utils';
import { I18n } from '@kineticdata/react';

export const RequestShowConfirmation = ({ handleOpenFeedback }) => (
  <Fragment>
    <h4>
      <I18n>Thank you for your submission.</I18n>
    </h4>

    <p>
      <I18n>With</I18n>{' '}
      <a onClick={handleOpenFeedback} role="button" tabIndex={0}>
        <I18n>Feedback</I18n>
      </a>{' '}
      <I18n>we are able to continuously improve.</I18n>
    </p>
  </Fragment>
);

export const mapStateToProps = state => ({
  adminKappSlug: selectAdminKapp(state).slug,
});

const enhance = compose(
  connect(
    mapStateToProps,
    null,
    null,
    { context },
  ),
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
