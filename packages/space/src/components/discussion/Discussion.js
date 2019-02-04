import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { parse } from 'query-string';
import { PageTitle } from 'common';
import { Discussion as KinopsDiscussion } from 'discussions';
import { SOCKET_STAGE } from 'discussions/src/api/socket';
import { I18n } from '../../../../app/src/I18nProvider';

const buildRelatedItemLink = relatedItem => {
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
        <I18n>{label}</I18n>
      </Link>
    )
  );
};

const DiscussionHeader = props => {
  const discussion = props.discussion;
  const discussionName =
    discussion && discussion.title ? discussion.title : 'Loading...';
  const relatedItems = discussion ? discussion.relatedItems : [];

  return (
    <Fragment>
      <PageTitle parts={[discussionName, 'Discussions']} />
      <div className="discussion__subheader">
        <Link to={'/'}>
          <I18n>home</I18n>
        </Link>{' '}
        / {discussionName}
        {relatedItems &&
          relatedItems.map(relatedItem => buildRelatedItemLink(relatedItem))}
      </div>
    </Fragment>
  );
};
export const DiscussionComponent = ({
  discussionId,
  socketStage,
  handleLeave,
  invitationToken,
}) => (
  <div className="page-panel page-panel--discussions">
    {discussionId ? (
      socketStage === SOCKET_STAGE.IDENTIFIED ||
      socketStage === SOCKET_STAGE.RECONNECTING ? (
        <KinopsDiscussion
          fullPage
          id={discussionId}
          invitationToken={invitationToken}
          onLeave={handleLeave}
          renderHeader={DiscussionHeader}
        />
      ) : (
        <Fragment>
          <DiscussionHeader />

          <div className="empty-state empty-state--discussions">
            <h6 className="empty-state__title">
              <I18n>
                Real-time connection to server has been interrupted. Please
                refresh and try again.
              </I18n>
            </h6>
          </div>
        </Fragment>
      )
    ) : (
      <Fragment>
        <DiscussionHeader />
        <div className="empty-state empty-state--discussions">
          <h6 className="empty-state__title">
            <I18n>No discussion to display</I18n>
          </h6>
        </div>
      </Fragment>
    )}
  </div>
);

const handleLeave = ({ push }) => () => {
  push('/');
};

const mapStateToProps = (state, props) => ({
  socketStage: state.discussions.socket.status.stage,
  discussionId: props.match.params.id,
  invitationToken: parse(props.location.search).invitationToken,
});

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
