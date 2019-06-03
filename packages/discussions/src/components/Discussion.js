import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose } from 'recompose';
import { PageTitle } from './shared/PageTitle';
import { Discussion as DiscussionDisplay } from 'common';

export const DiscussionComponent = ({
  id,
  profile,
  discussionTitle,
  navigate,
}) => (
  <Fragment>
    <PageTitle parts={['Discussions']} />
    <div className="page-container">
      <div className="page-panel page-panel--discussions">
        <DiscussionDisplay
          id={id}
          me={profile}
          handleBackClick={() => navigate('../')}
          renderHeader={({ discussion }) => (
            <span>{discussion ? discussion.title : discussionTitle}</span>
          )}
        />
      </div>
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => {
  const currentDiscussion = state.discussions.data
    ? state.discussions.data.find(d => d.id === props.id)
    : null;
  return {
    profile: state.app.profile,
    discussionTitle: currentDiscussion ? currentDiscussion.title : '\u00A0',
  };
};

export const mapDispatchToProps = {};

export const Discussion = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DiscussionComponent);
