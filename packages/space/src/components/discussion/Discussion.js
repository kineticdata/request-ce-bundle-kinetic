import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Utils, PageTitle } from 'common';
import { bundle } from 'react-kinetic-core';
import { Discussion as KinopsDiscussion } from 'discussions';

const buildRelatedItem = issue => {
  const tagList = issue.tag_list;
  return tagList.reduce((obj, tag) => {
    const key = tag.split(':').splice(1)[0];
    obj[key] = tag.split(':').splice(1)[1];
    return obj;
  }, {});
};

const buildRelatedItemLink = (relatedItem, profile) => {
  let label = relatedItem.LABEL;
  let link;
  if ('Form' === relatedItem.TYPE) {
    label = 'Manage Form';
  } else if ('Queue Task' === relatedItem.TYPE) {
    label = 'Open Task';
  } else if ('Team' === relatedItem.TYPE) {
    label = 'Team Home';
  }
  if ('Form' === relatedItem.TYPE) {
    let idSegments = relatedItem.ID.split('/');
    link =
      bundle.spaceLocation() +
      '/admin' +
      '/management' +
      '?page=management/form' +
      '&kapp=' +
      idSegments[0] +
      '&form=' +
      idSegments[1];
  } else if ('Queue Task' === relatedItem.TYPE) {
    let assignedIndividual = relatedItem['Assigned Individual'];
    let assignedTeam = relatedItem['Assigned Team'];
    if (
      assignedIndividual === profile.username ||
      Utils.isMemberOf(profile, assignedTeam)
    ) {
      link = '#/kapps/queue/submissions/' + relatedItem.ID;
    }
  } else if ('Team' === relatedItem.TYPE) {
    link = '#/teams/' + relatedItem.ID;
  } else if ('Datastore Submission' === relatedItem.TYPE) {
    link = `#/settings/datastore/${relatedItem.FORMSLUG}/${relatedItem.ID}`;
  }

  return (
    link && (
      <a className="btn btn-inverse btn-sm related-link ml-3" href={link}>
        {label}
      </a>
    )
  );
};

export const DiscussionComponent = ({
  discussionId,
  discussionName,
  relatedItem,
  profile,
}) => (
  <div className="discussion-wrapper">
    <PageTitle parts={[discussionName, 'Discussions']} />
    <div className="subheader">
      <Link to={'/'}>home</Link> / {discussionName}
      {relatedItem && buildRelatedItemLink(relatedItem, profile)}
    </div>
    {discussionId ? (
      <KinopsDiscussion
        discussionId={discussionId}
        renderClose={() => (
          <Link to={`/`} className="btn btn-link">
            Close
          </Link>
        )}
      />
    ) : (
      <div className="empty-discussion">
        <h6>No discussion to display</h6>
      </div>
    )}
  </div>
);

const mapStateToProps = (state, props) => {
  const discussionId = props.match.params.id;
  const discussion = state.discussions.discussions.discussions.get(
    discussionId,
  );

  return {
    profile: state.app.profile,
    discussionId: props.match.params.id,
    discussionName:
      discussion && discussion.issue ? discussion.issue.name : 'Loading...',
    relatedItem:
      discussion && discussion.issue ? buildRelatedItem(discussion.issue) : {},
  };
};

export const Discussion = compose(connect(mapStateToProps))(
  DiscussionComponent,
);
