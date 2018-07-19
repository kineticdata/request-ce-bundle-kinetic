import React from 'react';
import Avatar from 'react-avatar';
import moment from 'moment';

export const ParticipantCard = ({ participant, button }) => {
  return (
    <div className="card card--profile">
      <div className={`${participant.present ? 'present' : ''}`}>
        <Avatar
          size={96}
          src={participant.avatar_url}
          name={participant.name}
          round
        />
      </div>
      <h1>{participant.name}</h1>
      <p>{participant.email}</p>
      <p>
        {participant.last_logged_in !== null
          ? `Last In: ${moment(participant.last_logged_in).fromNow()}`
          : 'Online Now'}
      </p>
      {button ? button : null}
    </div>
  );
};
