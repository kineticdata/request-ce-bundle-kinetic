import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../redux/modules/discussions';

export const ArchivedBannerComponent = props => (
  <div className="archived-banner text-danger">
    <i className="fa fa-fw fa-briefcase" />
    <span className="message">This discussion has been archived.</span>
    {props.canManage && (
      <a role="button" onClick={props.openEditDiscussionModal}>
        Restore?
      </a>
    )}
  </div>
);

const mapDispatchToProps = {
  openModal: actions.openModal,
};

export const ArchivedBanner = compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  withHandlers({
    openEditDiscussionModal: props => () =>
      props.openModal(props.discussion.id, 'edit'),
  }),
)(ArchivedBannerComponent);
