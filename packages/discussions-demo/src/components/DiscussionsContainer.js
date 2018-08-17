import React, { Fragment } from 'react';
import classnames from 'classnames';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import { TOPIC_STATUS } from 'discussions/src/api/topic';
import { actions } from 'discussions/src/redux/modules/discussions';
import { Discussion } from 'discussions';

export const DiscussionsContainerComponent = ({
  discussionTabs,
  discussions,
  activeTab,
  handleTopicTab,
}) => (
  <Fragment>
    <Nav tabs>
      {discussionTabs.map(discussionId => {
        const discussion = discussions.find(d2 => d2.id === discussionId);

        if (discussion) {
          return (
            <NavItem key={discussionId}>
              <NavLink
                className={classnames({
                  active: activeTab === discussionId,
                })}
                onClick={handleTopicTab(discussionId)}
              >
                {discussion.title || 'Unknown'}
              </NavLink>
            </NavItem>
          );
        } else {
          return (
            <NavItem key={discussionId}>
              <NavLink
                className={classnames({
                  active: activeTab === discussionId,
                })}
              >
                Joining...
              </NavLink>
            </NavItem>
          );
        }
      })}
    </Nav>
    <TabContent activeTab={activeTab}>
      {discussionTabs.map(discussionId => (
        <TabPane tabId={discussionId} key={discussionId}>
          <div className="discussion-container">
            <div className="discussion-content">
              <Discussion
                discussionId={discussionId}
                isMobileModal
                renderClose={() => null}
              />
            </div>
          </div>
        </TabPane>
      ))}
    </TabContent>
  </Fragment>
);

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
