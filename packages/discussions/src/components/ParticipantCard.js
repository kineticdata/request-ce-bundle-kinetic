import React from 'react';
import Avatar from 'react-avatar';
import moment from 'moment';

export const ParticipantCard = ({ participant, button }) => {
  return (
    <div className="card card--profile">
      <div className={`${true ? 'present' : ''}`}>
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
        {participant.lastSeen !== null
          ? `Last In: ${moment(participant.lastSeen).fromNow()}`
          : 'Online Now'}
      </p>
      {button ? button : null}
    </div>
  );
};
