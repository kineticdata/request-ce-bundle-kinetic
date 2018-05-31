import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { modalFormActions } from 'common';
import { selectAdminKapp } from 'app/src/redux/selectors';
import { getFeedbackFormConfig } from '../../utils';

const FeedbackButton = props => (
  <button type="button" onClick={props.handleClick} className="btn btn-success">
    Provide Feedback
  </button>
);

export const mapStateToProps = state => ({
  adminKappSlug: selectAdminKapp(state).slug,
});

export const mapDispatchToProps = {
  openForm: modalFormActions.openForm,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleClick: props => () =>
      props.openForm(
        getFeedbackFormConfig(props.adminKappSlug, props.submission.id),
      ),
  }),
);

export const FeedbackButtonContainer = enhance(FeedbackButton);
