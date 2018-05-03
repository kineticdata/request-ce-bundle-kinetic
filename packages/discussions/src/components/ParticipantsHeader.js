import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Avatar from 'react-avatar';
import { bundle } from 'react-kinetic-core';
import { actions } from '../redux/modules/discussions';

const participantComparator = (p1, p2) =>
  p1.message_count !== p2.message_count
    ? p2.message_count - p1.message_count
    : p1.name.localeCompare(p2.name);

export const ParticipantsHeader = ({
  discussion,
  openParticipantsModal,
  openInNewTab,
}) =>
  !discussion.participants.isEmpty() && (
    <div className="participants-preview">
      {discussion.participants
        .toList()
        .sort(participantComparator)
        .map(p => (
          <div className={`${p.present ? 'present' : ''}`} key={p.id}>
            <Avatar size={26} src={p.avatar_url} name={p.name} round />
          </div>
        ))}
      <div className="view-all">
        <button
          type="button"
          className="btn btn-icon"
          onClick={openInNewTab}
          title="Expand Discussion"
        >
          <i className="fa fa-expand fa-fw" />
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={openParticipantsModal}
        >
          View All
        </button>
      </div>
    </div>
  );

const mapDispatchToProps = {
  openModal: actions.openModal,
};

export const ParticipantsHeaderContainer = compose(
  connect(null, mapDispatchToProps),
  withHandlers({
    openParticipantsModal: props => () =>
      props.openModal(props.discussion.issue.guid, 'participants'),
    openInNewTab: props => () =>
      window.open(
        `${bundle.spaceLocation()}#/discussions/${props.discussion.issue.guid}`,
        '_blank',
      ),
  }),
)(ParticipantsHeader);
