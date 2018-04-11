import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { KappLink as Link, PageTitle } from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../redux/modules/queue';
import { QueueItemDetailsContainer } from './QueueItemDetails';
import { QueueItemDiscussionsContainer } from './QueueItemDiscussionsContainer';
import { getFilterByPath, buildFilterPath } from '../../redux/modules/queueApp';

export const QueueItem = ({ filter, queueItem, discussionsEnabled }) =>
  queueItem !== null && (
    <div className="queue-item">
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
        <QueueItemDetailsContainer filter={filter} />
        {discussionsEnabled && <QueueItemDiscussionsContainer />}
      </div>
    </div>
  );

export const mapStateToProps = (state, props) => ({
  id: props.match.params.id,
  filter: getFilterByPath(state, props.location.pathname),
  queueItem: state.queue.currentItem,
  discussionsEnabled: selectDiscussionsEnabled(state),
});

export const mapDispatchToProps = {
  fetchCurrentItem: actions.fetchCurrentItem,
  setCurrentItem: actions.setCurrentItem,
};

export const QueueItemContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
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
