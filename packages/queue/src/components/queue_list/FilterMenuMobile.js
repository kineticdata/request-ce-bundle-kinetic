import React, { Fragment } from 'react';
import { FilterMenuContainer } from '../filter_menu/FilterMenuContainer';
import { I18n } from '@kineticdata/react';

// Define some simple button components just to cleanup the toolbar component.
const ShortcutButton = props => (
  <button
    type="button"
    className={`btn btn-subtle ${props.inactive ? 'inactive' : ''}`}
    onClick={props.open}
  >
    {props.children}
  </button>
);

const SortButton = props => {
  const icon = props.direction === 'ASC' ? 'asc' : 'desc';
  return (
    <button
      type="button"
      className="btn btn-link icon-wrapper"
      onClick={props.toggle}
    >
      <span className="icon">
        <span
          className={`fa fa-fw fa-sort-amount-${icon}`}
          style={{ fontSize: '16px', color: '#7e8083' }}
        />
      </span>
    </button>
  );
};
export const FilterMenuMobile = ({ filter, ...props }) => (
  <Fragment>
    <div className="queue-controls">
      <div className="queue-controls__filter">
        <h2 className={filter.type === 'adhoc' && filter.name ? 'edited' : ''}>
          <I18n>{filter.name || 'Adhoc'}</I18n>
        </h2>
        <div className="buttons">
          <button
            type="button"
            className="btn btn-link icon-wrapper"
            onClick={props.refresh}
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
            className="btn btn-link"
            onClick={props.openFilterMenu()}
          >
            <span
              className={`fa fa-fw fa-sliders`}
              style={{ fontSize: '16px', color: '#7e8083' }}
            />
          </button>
        </div>
      </div>
      <div className="queue-controls__shortcuts">
        <div className="queue-filter-list queue-filter-list--mobile">
          {props.hasTeams && (
            <ShortcutButton
              open={props.openFilterMenu('teams')}
              inactive={filter.teams.isEmpty()}
            >
              <I18n>Teams</I18n>
            </ShortcutButton>
          )}
          <ShortcutButton
            open={props.openFilterMenu('assignment')}
            inactive={!filter.assignments}
          >
            <I18n>Assignments</I18n>
          </ShortcutButton>
          <ShortcutButton
            open={props.openFilterMenu('status')}
            inactive={filter.status.isEmpty()}
          >
            <I18n>Status</I18n>
          </ShortcutButton>
          <ShortcutButton
            open={props.openFilterMenu('date')}
            inactive={
              !filter.dateRange.custom && filter.dateRange.preset === ''
            }
          >
            <I18n>Date Range</I18n>
          </ShortcutButton>
        </div>
      </div>
      <div className="queue-controls__sorting">
        <div className="queue-controls__item--left">
          <ShortcutButton
            open={props.openFilterMenu('group')}
            inactive={!filter.groupBy}
          >
            <span
              className="fa fa-fw fa-folder-open"
              style={{
                fontSize: '14px',
                color: filter.groupBy ? '#1094C4' : '#7e8083',
              }}
            />
          </ShortcutButton>
          <SortButton
            toggle={props.toggleGroupDirection}
            direction={props.groupDirection}
          />
        </div>
        <div className="queue-controls__item--right">
          <ShortcutButton open={props.openFilterMenu('sort')} inactive={false}>
            <span
              className="fa fa-fw fa-sort"
              style={{ fontSize: '14px', color: '#1094C4' }}
            />
          </ShortcutButton>
          <SortButton
            toggle={props.toggleSortDirection}
            direction={props.sortDirection}
          />
        </div>
      </div>
    </div>
    <FilterMenuContainer />
  </Fragment>
);
