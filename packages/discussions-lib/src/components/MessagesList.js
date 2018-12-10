import React from 'react';
import moment from 'moment';
import partitionListBy from '../helpers/partitionListBy';
import { MessagesByDate } from './MessagesByDate';

const getMessageDate = message =>
  moment(message.createdAt).format('YYYY-MM-DD');
const differentDate = (m1, m2) => getMessageDate(m1) !== getMessageDate(m2);

export const MessagesList = props => (
  <div className="message-list">
    {partitionListBy(differentDate, props.messages).map((messages, i) => (
      <MessagesByDate
        key={i}
        discussion={props.discussion}
        profile={props.profile}
        messages={messages}
        actions={props.actions}
      />
    ))}
  </div>
);
