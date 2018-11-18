import React from 'react';
import { DateBanner } from './DateBanner';
import partitionListBy from '../helpers/partitionListBy';
import { SystemMessageGroup } from './SystemMessageGroup';
import { UserMessageGroup } from './UserMessageGroup';

const differentAuthor = (m1, m2) =>
  m1.type !== m2.type ||
  (m1.type === 'User' && m1.createdBy.username !== m2.createdBy.username);

const Default = ({ dateBanner, messageGroups }) => (
  <div className="messages-date">
    {dateBanner}
    {messageGroups}
  </div>
);

export const MessagesByDate = props => {
  const Component = props.renderMessagesByDate || Default;
  return (
    <Component
      dateBanner={<DateBanner date={props.messages.first().createdAt} />}
      messageGroups={partitionListBy(differentAuthor, props.messages)
        .map(messages => ({
          profile: props.profile,
          messages,
          actions: props.actions,
          key: messages.first().id,
          Component:
            messages.first().type === 'User'
              ? UserMessageGroup
              : SystemMessageGroup,
        }))
        .map(({ Component, ...props }) => <Component {...props} />)}
    />
  );
};
