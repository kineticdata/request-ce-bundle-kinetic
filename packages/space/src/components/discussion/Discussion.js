import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { parse } from 'query-string';
import { PageTitle } from 'common';
import { Discussion as KinopsDiscussion } from 'discussions';
import { commonActions } from 'common';
import { SOCKET_STAGE } from 'discussions/src/api/socket';

const buildRelatedItemLink = (relatedItem, profile) => {
  let label = relatedItem.type;
  let link;

  if ('Form' === relatedItem.type && relatedItem.item.slug) {
    const form = relatedItem.item;
    link = `/kapps/${form.kapp.slug}/settings/forms/${form.slug}`;
    label = 'Manage Form';
  } else if ('Submission' === relatedItem.type && relatedItem.item.id) {
    const submission = relatedItem.item;

    link = `/kapps/${submission.form.kapp.slug}/submissions/${submission.id}`;
    label = 'Open Item';
  } else if ('Team' === relatedItem.type) {
    link = '/teams/' + relatedItem.key;
    label = 'Team Home';
  } else if (
    'Datastore Submission' === relatedItem.type &&
    relatedItem.item.id
  ) {
    const submission = relatedItem.item;

    link = `/settings/datastore/${submission.form.slug}/${submission.id}`;
    label = 'Open Item';
  }

  return (
    link && (
      <Link
        className="btn btn-inverse btn-sm related-link ml-3"
        to={link}
        key={`${relatedItem.type}/${relatedItem.key}`}
      >
        {label}
      </Link>
    )
  );
};

export const DiscussionComponent = ({
  discussionId,
  discussionName,
  relatedItems,
  profile,
  socketStage,
  handleLeave,
  invitationToken,
}) => (
  <div className="discussion-wrapper">
    <PageTitle parts={[discussionName, 'Discussions']} />
    <div className="subheader">
      <Link to={'/'}>home</Link> / {discussionName}
      {relatedItems &&
        relatedItems.map(relatedItem =>
          buildRelatedItemLink(relatedItem, profile),
        )}
    </div>
    {discussionId ? (
      socketStage === SOCKET_STAGE.IDENTIFIED ||
      socketStage === SOCKET_STAGE.RECONNECTING ? (
        <KinopsDiscussion
          discussionId={discussionId}
          invitationToken={invitationToken}
          leavable
          onLeave={handleLeave}
          renderClose={() => (
            <Link to={`/`} className="btn btn-link">
              Close
            </Link>
          )}
        />
      ) : (
        <div className="empty-discussion">
          <h6>
            Real-time connection to server has been interrupted. Please refresh
            and try again.
          </h6>
        </div>
      )
    ) : (
      <div className="empty-discussion">
        <h6>No discussion to display</h6>
      </div>
    )}
  </div>
);

const handleLeave = ({ push }) => () => {
  push('/');
};

const mapStateToProps = (state, props) => {
  const discussionId = props.match.params.id;
  const discussion = state.discussions.discussions.discussions.get(
    discussionId,
  );

  return {
    socketStage: state.discussions.socket.status.stage,
    profile: state.app.profile,
    discussionId: props.match.params.id,
    discussionName:
      discussion && discussion.title ? discussion.title : 'Loading...',
    relatedItems: discussion ? discussion.relatedItems : [],
    invitationToken: parse(props.location.search).invitationToken,
  };
};

const mapDispatchToProps = {
  push,
};

export const Discussion = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleLeave,
  }),
)(DiscussionComponent);
