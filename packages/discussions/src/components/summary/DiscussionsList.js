import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Utils } from 'common';
import { FormGroup, Label, Input } from 'reactstrap';
import { DiscussionCard } from './DiscussionCard';
import { actions as listActions } from '../../redux/modules/discussionsList';
import { actions as discussionsActions } from '../../redux/modules/discussions';

export const SearchArchivedCheckbox = ({
  toggleSearchArchived,
  searchArchived,
}) => (
  <div className="form-check">
    <input
      className="form-check-input"
      name="searchArchived"
      type="checkbox"
      onChange={toggleSearchArchived}
      checked={searchArchived}
    />{' '}
    <label className="form-check-label">Archived Discussions</label>
  </div>
);

export const DiscussionsListComponent = ({
  handleCreateDiscussion,
  handleDiscussionClick,
  toggleSearchArchived,
  searchArchived,
  discussions,
  me,
}) => {
  return discussions && discussions.size > 0 ? (
    <Fragment>
      <button onClick={handleCreateDiscussion} className="btn btn-inverse">
        New Discussion
      </button>

      <div style={{ alignSelf: 'flex-end' }}>
        <SearchArchivedCheckbox
          toggleSearchArchived={toggleSearchArchived}
          searchArchived={searchArchived}
        />
      </div>

      {Utils.getGroupedDiscussions(discussions)
        .map((discussions, dateGroup) => (
          <div className="messages" key={dateGroup}>
            <div className="date">
              <hr />
              <span>{dateGroup}</span>
              <hr />
            </div>
            {discussions.map(discussion => (
              <DiscussionCard
                key={discussion.id}
                me={me}
                discussion={discussion}
                onDiscussionClick={handleDiscussionClick}
              />
            ))}
          </div>
        ))
        .toList()}
    </Fragment>
  ) : (
    <div className="empty-discussion">
      <h5>No discussion to display</h5>
      <p>
        <SearchArchivedCheckbox
          toggleSearchArchived={toggleSearchArchived}
          searchArchived={searchArchived}
        />
        <button onClick={handleCreateDiscussion} className="btn btn-link">
          Create a new discussion
        </button>
      </p>
    </div>
  );
};

export const toggleSearchArchived = props => e => {
  props.setSearchArchived(e.target.checked);
  props.fetchRelatedDiscussions(props.itemType, props.itemKey, props.onLoad);
};

const mapDispatchToProps = {
  setSearchArchived: listActions.setSearchArchived,
  fetchRelatedDiscussions: listActions.fetchRelatedDiscussions,
  createDiscussion: discussionsActions.createDiscussion,
};

const mapStateToProps = state => ({
  discussions: state.discussions.discussionsList.relatedDiscussions,
  searchArchived: state.discussions.discussionsList.searchArchived,
});
export const DiscussionsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    toggleSearchArchived,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchRelatedDiscussions(
        this.props.itemType,
        this.props.itemKey,
        this.props.onLoad,
      );
    },
  }),
)(DiscussionsListComponent);
