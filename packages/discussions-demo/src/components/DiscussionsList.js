import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import axios from 'axios';

import { Button, Input } from 'reactstrap';

import { actions } from 'discussions/src/redux/modules/discussions';

const DiscussionsListComponent = ({
  handleDiscussionCreate,
  handleShowCreateDiscussion,
  showCreateDiscussion,
  handleCanelCreateDiscussion,
  handleNewDiscussionName,
  handleNewDiscussionDesc,
  newDiscussionName,
  newDiscussionDesc,
  handleDiscussionJoin,
  discussionList,
  chatDiscussions,
}) => (
  <div>
    <h4>Discussions</h4>
    {showCreateDiscussion && (
      <form onSubmit={handleDiscussionCreate}>
        <Input
          type="text"
          placeholder="Discussion name"
          bsSize="sm"
          value={newDiscussionName}
          onChange={handleNewDiscussionName}
        />
        <Input
          type="text"
          placeholder="Discussion description"
          bsSize="sm"
          value={newDiscussionDesc}
          onChange={handleNewDiscussionDesc}
        />
        <Button type="submit" color="success" size="sm">
          Create
        </Button>
        <Button
          type="button"
          color="link"
          size="sm"
          onClick={handleCanelCreateDiscussion}
        >
          Cancel
        </Button>
      </form>
    )}

    {!showCreateDiscussion && (
      <div>
        <Button color="primary" size="sm" onClick={handleShowCreateDiscussion}>
          Create Discussion
        </Button>
        {discussionList.map(discussion => {
          const isChatting = chatDiscussions.has(discussion.id);
          const topicStatus = isChatting
            ? chatDiscussions.get(discussion.id).topic.topicStatus
            : 'Unknown';
          return (
            <div key={discussion.id}>
              {discussion.title}
              <Button
                color="success"
                size="sm"
                onClick={handleDiscussionJoin(discussion)}
                disabled={isChatting}
              >
                {isChatting ? topicStatus : 'Join'}
              </Button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const handleDiscussionJoin = ({ addDiscussionTab }) => discussion => () => {
  addDiscussionTab(discussion.id);
};

const handleShowCreateDiscussion = ({ setShowCreateDiscussion }) => () => {
  setShowCreateDiscussion(true);
};

const handleCanelCreateDiscussion = ({ setShowCreateDiscussion }) => () => {
  setShowCreateDiscussion(false);
};

const handleNewDiscussionName = ({ setNewDiscussionName }) => e =>
  setNewDiscussionName(e.target.value);

const handleNewDiscussionDesc = ({ setNewDiscussionDesc }) => e =>
  setNewDiscussionDesc(e.target.value);

const handleDiscussionCreate = ({
  setNewDiscussionName,
  setNewDiscussionDesc,
  newDiscussionName,
  newDiscussionDesc,
  token,
  fetchDiscussions,
  setShowCreateDiscussion,
}) => async e => {
  e.preventDefault();

  await axios.request({
    method: 'post',
    url: 'http://localhost:7071/acme/app/api/v1/discussions',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      title: newDiscussionName,
      description: newDiscussionDesc,
      isArchived: false,
      isPrivate: false,
    },
  });

  setNewDiscussionName('');
  setNewDiscussionDesc('');
  setShowCreateDiscussion(false);
  fetchDiscussions();
};

const fetchDiscussions = ({ setDiscussionsList, token }) => async () => {
  const { data } = await axios.request({
    method: 'get',
    url: `http://localhost:7071/acme/app/api/v1/discussions`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setDiscussionsList(data.discussions);
};

const mapStateToProps = state => ({
  token: state.discussions.socket.token,
  chatDiscussions: state.discussions.discussions.discussions,
});
const mapDispatchToProps = {
  joinDiscussion: actions.joinDiscussion,
};
export const DiscussionsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('showCreateDiscussion', 'setShowCreateDiscussion', false),
  withState('discussionList', 'setDiscussionsList', []),
  withState('newDiscussionName', 'setNewDiscussionName', ''),
  withState('newDiscussionDesc', 'setNewDiscussionDesc', ''),
  withHandlers({
    handleShowCreateDiscussion,
    handleCanelCreateDiscussion,
    handleNewDiscussionName,
    handleNewDiscussionDesc,
    handleDiscussionJoin,
    fetchDiscussions,
  }),
  withHandlers({
    handleDiscussionCreate,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchDiscussions();
    },
  }),
)(DiscussionsListComponent);
