import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Avatar from 'react-avatar';
import { actions } from '../redux/modules/discussions';

const participantComparator = (p1, p2) =>
  p1.message_count !== p2.message_count
    ? p2.message_count - p1.message_count
    : p1.name.localeCompare(p2.name);

export const ParticipantsHeader = ({ discussion, openParticipantsModal }) =>
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
      <button
        type="button"
        className="btn btn-link view-all"
        onClick={openParticipantsModal}
      >
        View All
      </button>
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
  }),
)(ParticipantsHeader);
