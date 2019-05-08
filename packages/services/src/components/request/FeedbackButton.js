import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { openModalForm } from 'common';
import { selectAdminKapp } from 'app/src/redux/selectors';
import { context } from '../../redux/store';
import { getFeedbackFormConfig } from '../../utils';
import { I18n } from '@kineticdata/react';

const FeedbackButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-success">
    <I18n>Provide Feedback</I18n>
  </button>
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
    handleClick: props => () =>
      openModalForm(
        getFeedbackFormConfig(props.adminKappSlug, props.submission.id),
      ),
  }),
);

export const FeedbackButtonContainer = enhance(FeedbackButton);
