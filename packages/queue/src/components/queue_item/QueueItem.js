import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { KappLink as Link, PageTitle } from 'common';
import { DiscussionsPanel } from 'discussions';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../redux/modules/queue';
import { QueueItemDetailsContainer } from './QueueItemDetails';
import { getFilterByPath, buildFilterPath } from '../../redux/modules/queueApp';

export const QueueItem = ({
  filter,
  queueItem,
  discussionsEnabled,
  getCreationParams,
  profile,
}) =>
  queueItem !== null && (
    <div className="queue-item-container">
      {filter && (
        <Link to={buildFilterPath(filter)} className="nav-return">
          <span className="icon">
            <span className="fa fa-fw fa-chevron-left" />
          </span>
          {filter.name || 'Adhoc'}
        </Link>
      )}
      <div className="queue-item-content">
        <PageTitle
          parts={[
            queueItem ? queueItem.handle : '',
            filter ? filter.name || 'Adhoc' : '',
          ]}
        />
        <QueueItemDetailsContainer
          filter={filter}
          getCreationParams={getCreationParams}
        />
        {discussionsEnabled && (
          <DiscussionsPanel
            itemType="Submission"
            itemKey={queueItem.id}
            creationParams={getCreationParams}
            me={profile}
          />
        )}
      </div>
    </div>
  );

export const getCreationParams = props => () => {
  const owningTeams = [{ name: props.queueItem.values['Assigned Team'] }];
  const owningUsers = [
    {
      username:
        props.queueItem.values['Assigned Individual'] || props.profile.username,
    },
  ];

  return {
    title: props.queueItem.label || 'Queue Discussion',
    description: props.queueItem.values['Details'] || '',
    owningTeams,
    owningUsers,
  };
};

export const mapStateToProps = (state, props) => ({
  id: props.match.params.id,
  filter: getFilterByPath(state, props.location.pathname),
  queueItem: state.queue.queue.currentItem,
  discussionsEnabled: selectDiscussionsEnabled(state),
  profile: state.app.profile,
});

export const mapDispatchToProps = {
  fetchCurrentItem: actions.fetchCurrentItem,
  setCurrentItem: actions.setCurrentItem,
};

export const QueueItemContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    getCreationParams,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchCurrentItem(this.props.id);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.id !== nextProps.id) {
        this.props.fetchCurrentItem(nextProps.id);
      }
    },
    componentWillUnmount() {
      this.props.setCurrentItem(null);
    },
  }),
)(QueueItem);
