import React from 'react';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { QueueListItemSmall } from './QueueListItem';
import { TOO_MANY_STATUS_STRING } from '../../redux/sagas/queue';
import { PageTitle, Moment, Constants } from 'common';
import { FilterMenuToolbar } from './FilterMenuToolbar';
import { FilterMenuMobile } from './FilterMenuMobile';
import { QueueListPagination } from './QueueListPagination';
import moment from 'moment';

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

const GroupByValue = ({ value }) => {
  if (!value) {
    return '';
  } else if (value.match(Constants.DATE_TIME_REGEX)) {
    return (
      <Moment
        timestamp={moment(value)}
        format={Constants.MOMENT_FORMATS.dateTimeNumeric}
      />
    );
  } else if (value.match(Constants.DATE_REGEX)) {
    return (
      <Moment
        timestamp={moment(value, 'YYYY-MM-DD')}
        format={Constants.MOMENT_FORMATS.dateNumeric}
      />
    );
  } else if (value.match(Constants.TIME_REGEX)) {
    return (
      <Moment
        timestamp={moment(value, 'HH:mm')}
        format={Constants.MOMENT_FORMATS.time}
      />
    );
  } else {
    return value;
  }
};

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
  pageCount,
  limit,
  offset,
  isGrouped,
  isMobile,
}) => {
  const paginationProps = {
    hasPrevPage,
    hasNextPage,
    gotoPrevPage,
    gotoNextPage,
    count,
    pageCount,
    limit,
    offset,
  };
  return (
    isExact &&
    (!filter ? (
      <WallyBadFilter />
    ) : (
      <div className="queue-list-container">
        <PageTitle parts={[filter.name || 'Adhoc']} />
        {isMobile ? (
          <FilterMenuMobile
            filter={filter}
            openFilterMenu={openFilterMenu}
            refresh={refresh}
            sortDirection={sortDirection}
            toggleSortDirection={toggleSortDirection}
            groupDirection={groupDirection}
            toggleGroupDirection={toggleGroupDirection}
          />
        ) : (
          <FilterMenuToolbar filter={filter} refresh={refresh} />
        )}
        <div className="queue-list-content submissions">
          {statusMessage ? (
            <WallyErrorMessage message={statusMessage} />
          ) : queueItems && queueItems.size > 0 ? (
            isGrouped ? (
              queueItems
                .map((items, groupValue) => (
                  <div
                    className="items-grouping"
                    key={groupValue || 'no-group'}
                  >
                    <div className="items-grouping__banner">
                      <span>
                        <GroupByValue value={groupValue} />
                      </span>
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
        <QueueListPagination
          filter={filter}
          paginationProps={paginationProps}
        />
      </div>
    ))
  );
};
