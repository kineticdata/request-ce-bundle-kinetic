import React, { Fragment } from 'react';
import classnames from 'classnames';
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { TOPIC_STATUS } from 'discussions/src/api/topic';
import { actions } from 'discussions/src/redux/modules/discussions';
import { Discussion } from 'discussions';

const produceContent = message =>
  message.content.reduce((content, token) => (content += token.value), '');

const isPresent = (username, presences) =>
  presences.find(p => p.user === username) !== undefined;

export const DiscussionsContainerComponent = ({
  discussions,
  activeTab,
  messageInput,
  handleTopicTab,
  handleTopicLeave,
  handleSend,
  handleMessageInput,
}) => {
  console.log(discussions);
  return (
    <Fragment>
      <Nav tabs>
        {discussions
          .map(
            discussion =>
              discussion.topic.topicStatus === TOPIC_STATUS.subscribed ? (
                <NavItem key={discussion.topic.topicId}>
                  <NavLink
                    className={classnames({
                      active: activeTab === discussion.topic.topicId,
                    })}
                    onClick={handleTopicTab(discussion.topic.topicId)}
                  >
                    {discussion.title}
                    <Button
                      onClick={handleTopicLeave(discussion.id)}
                      size="sm"
                      color="link"
                    >
                      X
                    </Button>
                  </NavLink>
                </NavItem>
              ) : (
                <NavItem key={discussion.topic.topicId}>
                  <NavLink>
                    {`${discussion.title} - ${discussion.topic.topicStatus}`}
                  </NavLink>
                </NavItem>
              ),
          )
          .toList()}
      </Nav>
      <TabContent activeTab={activeTab}>
        {discussions
          .map(
            discussion =>
              discussion.topic.topicStatus === TOPIC_STATUS.subscribed ? (
                <TabPane tabId={discussion.topic.topicId} key={discussion.id}>
                  <Discussion
                    discussionId={discussion.id}
                    isMobileModal
                    renderClose={() => null}
                  />
                  {/* <div className="row">
                    <div className="col-2">
                      <strong>Participants</strong>
                      {discussion.participants.map(p => (
                        <div
                          className={
                            isPresent(p.user.username, discussion.presences)
                              ? 'text-success'
                              : ''
                          }
                          key={p.user.id}
                        >
                          {p.user.displayName || p.user.username}
                        </div>
                      ))}
                      <hr />
                      <strong>Invitations</strong>
                      {discussion.invitations.map(invite => (
                        <div key={invite.email}>{invite.email}</div>
                      ))}
                      <hr />
                      <strong>Related Items</strong>
                      {discussion.relatedItems.map(relatedItem => (
                        <div key={`${relatedItem.type}+${relatedItem.key}`}>
                          {`(${relatedItem.type}) - ${relatedItem.key}`}
                        </div>
                      ))}
                    </div>
                    <div className="col">
                      <form onSubmit={handleSend(discussion.topic.topicId)}>
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="message to send"
                            value={messageInput}
                            onChange={handleMessageInput}
                          />
                          <InputGroupAddon addonType="append">
                            <Button
                              color="primary"
                              disabled={messageInput === ''}
                            >
                              Send
                            </Button>
                          </InputGroupAddon>
                        </InputGroup>
                      </form>
                      <ListGroup>
                        {discussion.messages.items.map(message => (
                          <ListGroupItem key={message.id}>{`${moment(
                            message.createdAt,
                          ).fromNow()} - ${produceContent(
                            message,
                          )}`}</ListGroupItem>
                        ))}
                      </ListGroup>
                    </div>
                      </div>*/}
                </TabPane>
              ) : null,
          )
          .toList()}
      </TabContent>
    </Fragment>
  );
};

const handleTopicTab = ({ setActiveTab }) => topicId => () =>
  setActiveTab(topicId);

const handleTopicLeave = ({ removeTopic }) => id => () => {
  removeTopic(id);
};

const handleSend = ({
  sendMessage,
  messageInput,
  setMesageInput,
}) => topicId => e => {
  e.preventDefault();
  setMesageInput('');
  sendMessage(topicId, messageInput);
};

const handleMessageInput = ({ setMesageInput }) => e =>
  setMesageInput(e.target.value);

const mapDispatchToProps = {
  sendMessage: actions.sendMessage,
  removeTopic: actions.removeTopic,
};

const mapStateToProps = state => ({
  discussions: state.discussions.discussions.discussions,
});
export const DiscussionsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('activeTab', 'setActiveTab', ''),
  withState('messageInput', 'setMesageInput', ''),
  withHandlers({
    handleTopicTab,
    handleTopicLeave,
    handleSend,
    handleMessageInput,
  }),
)(DiscussionsContainerComponent);
