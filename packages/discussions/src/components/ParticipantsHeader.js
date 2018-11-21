import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { bundle } from 'react-kinetic-core';
import { actions } from '../redux/modules/discussions';
import { isPresent } from '../helpers';
import { Avatar } from 'common';
import { ParticipantCard } from './ParticipantCard';

const participantComparator = (p1, p2) =>
  p1.user.username.localeCompare(p2.user.username);

export const ParticipantsHeader = ({
  discussion,
  openParticipantsModal,
  openEditDiscussionModal,
  openInNewTab,
  isFullScreen,
  canManage,
}) =>
  !discussion.participants.isEmpty() && (
    <div className="participants-preview">
      {discussion.participants
        .toList()
        .filter(p => !p.user.unknown)
        .sort(participantComparator)
        .map(p => (
          <div
            key={p.user.username}
            className={isPresent(discussion, p.user.username) ? 'present' : ''}
          >
            <Avatar size={26} username={p.user.username} />
          </div>
        ))}
      <div className="view-all">
        {!isFullScreen && (
          <button
            type="button"
            className="btn btn-icon btn-expand d-sm-none d-md-inline-flex"
            onClick={openInNewTab}
            title="Expand Discussion"
          >
            <i className="fa fa-expand fa-fw" />
          </button>
        )}
        <button
          type="button"
          className="btn btn-link"
          onClick={openParticipantsModal}
        >
          View All
        </button>
        {canManage && (
          <button
            type="button"
            className="btn btn-link"
            onClick={openEditDiscussionModal}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );

const mapStateToProps = state => ({
  isFullScreen:
    state.router.location.pathname &&
    state.router.location.pathname.startsWith('/discussion'),
});

const mapDispatchToProps = {
  openModal: actions.openModal,
};

export const ParticipantsHeaderContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    openParticipantsModal: props => () =>
      props.openModal(props.discussion.id, 'participants'),
    openEditDiscussionModal: props => () =>
      props.openModal(props.discussion.id, 'edit'),
    openInNewTab: props => () =>
      window.open(
        `${bundle.spaceLocation()}/#/discussions/${props.discussion.id}`,
        '_blank',
      ),
  }),
)(ParticipantsHeader);
