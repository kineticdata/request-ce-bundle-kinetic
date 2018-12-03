import React from 'react';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { QueueListItemSmall } from './QueueListItem';
import { TOO_MANY_STATUS_STRING } from '../../redux/sagas/queue';
import { PageTitle } from 'common';
import { FilterMenuToolbar } from './FilterMenuToolbar';
import { FilterMenuContainer } from '../filter_menu/FilterMenuContainer';

const WallyEmptyMessage = ({ filter }) => {
  if (filter.type === 'adhoc') {
    return (
      <div className="empty-state empty-state--wally">
        <h5>No Results</h5>
        <img src={wallyMissingImage} alt="Missing Wally" />
        <h6>Try a less specific filter.</h6>
        <h5>Try again</h5>
      </div>
    );
  }

  return (
    <div className="empty-state empty-state--wally">
      <h5>No Assignments</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>An empty queue is a happy queue.</h6>
    </div>
  );
};

const WallyErrorMessage = ({ message }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>{message === TOO_MANY_STATUS_STRING ? 'Too Many Items' : 'Error'}</h5>
      <img src={wallyMissingImage} alt="Missing Wally" />
      <h6>{message}</h6>
      <h5>Try again</h5>
    </div>
  );
};

const WallyBadFilter = () => (
  <div className="empty-state empty-state--wally">
    <h5>Invalid List</h5>
    <img src={wallyMissingImage} alt="Missing Wally" />
    <h6>Invalid list, please choose a valid list from the left side.</h6>
  </div>
);

export const QueueList = ({
  filter,
  queueItems,
  statusMessage,
  openFilterMenu,
  sortDirection,
  sortBy,
  toggleSortDirection,
  groupDirection,
  toggleGroupDirection,
  refresh,
  hasPrevPage,
  hasNextPage,
  gotoPrevPage,
  gotoNextPage,
  isExact,
  count,
  limit,
  offset,
  isGrouped,
  isMobile,
}) =>
  isExact &&
  (!filter ? (
    <WallyBadFilter />
  ) : (
    <div className="queue-list-container">
      <PageTitle parts={[filter.name || 'Adhoc']} />
      {isMobile ? (
        <FilterMenuContainer />
      ) : (
        <FilterMenuToolbar filter={filter} />
      )}
      <div className="queue-list-content submissions">
        {statusMessage ? (
          <WallyErrorMessage message={statusMessage} />
        ) : queueItems && queueItems.size > 0 ? (
          isGrouped ? (
            queueItems
              .map((items, groupValue) => (
                <div className="items-grouping" key={groupValue}>
                  <div className="items-grouping__banner">
                    <span>{groupValue}</span>
                  </div>
                  <ul className="list-group">
                    {items.map(item => (
                      <QueueListItemSmall
                        queueItem={item}
                        key={item.id}
                        filter={filter}
                      />
                    ))}
                  </ul>
                </div>
              ))
              .toList()
          ) : (
            <ul className="list-group">
              {' '}
              {queueItems.map(queueItem => (
                <QueueListItemSmall
                  queueItem={queueItem}
                  key={queueItem.id}
                  filter={filter}
                />
              ))}
            </ul>
          )
        ) : (
          <WallyEmptyMessage filter={filter} />
        )}
      </div>
    </div>
  ));
