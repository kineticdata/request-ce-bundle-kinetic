import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { actions } from '../../redux/modules/queue';
import { QueueItemDetailsContainer } from './QueueItemDetails';
import { QueueItemDiscussionsContainer } from './QueueItemDiscussionsContainer';
import { PageTitle } from '../PageTitle';
import { getFilterByPath, buildFilterPath } from '../../redux/modules/app';

export const QueueItem = ({ filter, queueItem }) =>
  queueItem !== null && (
    <div className="queue-item">
      {filter && (
        <Link to={buildFilterPath(filter)} className="back-link">
          <div className="icon-wrapper">
            <span className="icon">
              <span
                className="fa fa-fw fa-chevron-left"
                style={{ fontSize: '16px' }}
              />
            </span>
            {filter.name || 'Adhoc'}
          </div>
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
        <QueueItemDiscussionsContainer />
      </div>
    </div>
  );

export const mapStateToProps = (state, props) => ({
  id: props.match.params.id,
  filter: getFilterByPath(state, props.location.pathname),
  queueItem: state.queue.currentItem,
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
