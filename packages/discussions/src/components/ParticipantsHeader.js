import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { bundle } from 'react-kinetic-core';
import { Hoverable } from 'common';
import { actions } from '../redux/modules/discussions';
import Avatar from 'react-avatar';
import { isPresent } from '../helpers';
import { ParticipantCard } from './ParticipantCard';

const participantComparator = (p1, p2) =>
  p1.user.username.localeCompare(p2.user.username);

export const ParticipantsHeader = ({
  discussion,
  openParticipantsModal,
  openEditDiscussionModal,
  openInNewTab,
  isFullScreen,
}) =>
  !discussion.participants.isEmpty() && (
    <div className="participants-preview">
      {discussion.participants
        .toList()
        .filter(p => !p.user.unknown)
        .sort(participantComparator)
        .map(p => (
          <Hoverable
            key={p.user.username}
            render={() => (
              <ParticipantCard discussion={discussion} participant={p} />
            )}
          >
            <div
              className={
                isPresent(discussion, p.user.username) ? 'present' : ''
              }
            >
              <Avatar
                size={26}
                email={p.user.email}
                name={p.user.displayName}
                round
              />
            </div>
          </Hoverable>
        ))}
      <div className="view-all">
        {!isFullScreen && (
          <button
            type="button"
            className="btn btn-icon"
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
        <button
          type="button"
          className="btn btn-link"
          onClick={openEditDiscussionModal}
        >
          Edit
        </button>
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
