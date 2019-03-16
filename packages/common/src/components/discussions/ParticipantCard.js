import React from 'react';
import Avatar from 'react-avatar';
import moment from 'moment';
import isPresent from '../../helpers/isPresent';

export const ParticipantCard = ({ discussion, participant, button }) => {
  return (
    <div className="card card--profile">
      <div
        className={
          isPresent(discussion, participant.user.username) ? 'present' : ''
        }
      >
        <Avatar
          size={96}
          email={participant.user.email}
          name={participant.user.displayName}
          round
        />
      </div>
      <h1>{participant.user.displayName}</h1>
      <p>{participant.user.email}</p>
      <p>
        {participant.lastSeenAt !== null
          ? `Last In: ${moment(participant.lastSeenAt).fromNow()}`
          : 'Online Now'}
      </p>
      {button ? button : null}
    </div>
  );
};
