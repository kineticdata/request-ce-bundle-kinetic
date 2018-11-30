import React, { Fragment } from 'react';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import wallyMissingImage from 'common/src/assets/images/wally-missing.svg';
import { QueueListItemSmall } from './QueueListItem';
import { TOO_MANY_STATUS_STRING } from '../../redux/sagas/queue';
import { PageTitle } from 'common';
import { Popover, PopoverBody } from 'reactstrap';

const SORT_NAMES = {
  createdAt: 'Created At',
  updatedAt: 'Updated At',
  closedAt: 'Closed At',
  'Due Date': 'Due Date',
};

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
  popovers,
  togglePopover,
}) =>
  isExact &&
  (!filter ? (
    <WallyBadFilter />
  ) : (
    <div className="queue-list-container">
      <PageTitle parts={[filter.name || 'Adhoc']} />
      <div className="queue-controls">
        <div className="queue-controls__filter">
          <h2>{filter.name || 'Adhoc'}</h2>
          <div className="queue-filter-list">
            <button
              onClick={togglePopover('teams')}
              id="teams-popover"
              className="btn btn-subtle"
            >
              Any Team
              <i className="fa fa-fw fa-caret-down" />
            </button>
            <Popover
              placement="bottom"
              target="teams-popover"
              isOpen={popovers.get('teams')}
              toggle={togglePopover('teams')}
            >
              <PopoverBody className="filter-menu-popover">
                <div className="filter-menu-popover__content">
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>{' '}
                  <label htmlFor="team-default">
                    <input type="checkbox" id="team-default" />
                    Default
                  </label>
                  <label htmlFor="team-hr">
                    <input type="checkbox" id="team-hr" />
                    Developers:: Singapore::Developers
                    Singapore::Developers::Singapore::
                  </label>
                  <label htmlFor="team-it">
                    <input type="checkbox" id="team-it" />
                    IT
                  </label>
                </div>
                <div className="filter-menu-popover__footer">
                  <button className="btn btn-link">Reset</button>
                  <button className="btn btn-primary">Apply</button>
                </div>
              </PopoverBody>
            </Popover>
            <button className="btn btn-subtle">
              Any Assignment <i className="fa fa-fw fa-caret-down" />
            </button>
            <div className="btn-group">
              <button className="btn btn-subtle">Status: Open, Closed</button>
              <button className="btn btn-subtle">
                <i className="fa fa-times" />
              </button>
            </div>
            <button className="btn btn-subtle">
              Any Date Range <i className="fa fa-fw fa-caret-down" />
            </button>
            <label htmlFor="createdBy" className="btn btn-subtle">
              Created By <input type="checkbox" id="createdBy" />
            </label>
          </div>

          <div className="buttons">
            <button
              type="button"
              className="btn btn-link icon-wrapper"
              onClick={refresh}
            >
              <span className="icon">
                <span
                  className="fa fa-fw fa-refresh"
                  style={{ fontSize: '16px', color: '#7e8083' }}
                />
              </span>
            </button>

            <button
              type="button"
              className="btn btn-link icon-wrapper"
              onClick={openFilterMenu}
            >
              <span className="icon">
                <span
                  className="fa fa-fw fa-sliders"
                  style={{ fontSize: '16px', color: '#7e8083' }}
                />
              </span>
            </button>
          </div>
        </div>
        <div className="queue-controls__sorting">
          <div className="queue-controls__item--left">
            {isGrouped ? (
              <Fragment>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-subtle"
                    id="group-popover"
                    onClick={togglePopover('group')}
                  >
                    <span
                      className="fa fa-fw fa-folder-open"
                      style={{ fontSize: '14px', color: '#1094C4' }}
                    />
                    Grouped by {filter.groupBy}
                  </button>
                  <button className="btn btn-subtle btn-subtle--close">
                    <i className="fa fa-times" />
                  </button>
                </div>
                <Popover
                  placement="bottom"
                  target="group-popover"
                  isOpen={popovers.get('group')}
                  toggle={togglePopover('group')}
                >
                  <PopoverBody className="filter-menu-popover">
                    <h6>Group items by</h6>
                    options
                  </PopoverBody>
                </Popover>
                <button
                  type="button"
                  className="btn btn-link icon-wrapper"
                  onClick={toggleGroupDirection}
                >
                  {groupDirection === 'ASC' ? (
                    <span className="icon">
                      <span
                        className="fa fa-fw fa-sort-amount-asc"
                        style={{ fontSize: '16px', color: '#7e8083' }}
                      />
                    </span>
                  ) : (
                    <span className="icon">
                      <span
                        className="fa fa-fw fa-sort-amount-desc "
                        style={{ fontSize: '16px', color: '#7e8083' }}
                      />
                    </span>
                  )}
                </button>
              </Fragment>
            ) : (
              <Fragment>
                <button className="btn btn-subtle">
                  <span
                    className="fa fa-fw fa-folder-open"
                    style={{ fontSize: '14px', color: '#7e8083' }}
                  />
                  Ungrouped
                </button>
              </Fragment>
            )}
          </div>
          {count > 0 && !isGrouped ? (
            <div className="nav-buttons">
              <button
                type="button"
                className="btn btn-link icon-wrapper"
                disabled={!hasPrevPage}
                onClick={gotoPrevPage}
              >
                <span className="icon">
                  <span className="fa fa-fw fa-caret-left" />
                </span>
              </button>
              <strong>
                {offset + 1}-{offset + queueItems.size}
              </strong>
              {' of '}
              <strong>{count}</strong>
              <button
                type="button"
                className="btn btn-link icon-wrapper"
                disabled={!hasNextPage}
                onClick={gotoNextPage}
              >
                <span className="icon">
                  <span className="fa fa-fw fa-caret-right" />
                </span>
              </button>
            </div>
          ) : (
            <span />
          )}
          <div className="queue-controls__item--right">
            <button
              className="btn btn-subtle"
              id="sort-popover"
              onClick={togglePopover('sort')}
            >
              Sorted by {SORT_NAMES[sortBy]}
            </button>
            <Popover
              placement="bottom"
              target="sort-popover"
              isOpen={popovers.get('sort')}
              toggle={togglePopover('sort')}
            >
              <PopoverBody className="filter-menu-popover">
                <h6>Sort items by</h6>
                options
              </PopoverBody>
            </Popover>
            <button
              type="button"
              className="btn btn-link icon-wrapper"
              onClick={toggleSortDirection}
            >
              {sortDirection === 'ASC' ? (
                <span className="icon">
                  <span
                    className="fa fa-fw fa-sort-amount-asc"
                    style={{ fontSize: '16px', color: '#7e8083' }}
                  />
                </span>
              ) : (
                <span className="icon">
                  <span
                    className="fa fa-fw fa-sort-amount-desc "
                    style={{ fontSize: '16px', color: '#7e8083' }}
                  />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
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
