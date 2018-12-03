import React, { Fragment } from 'react';
import { Popover, PopoverBody, UncontrolledTooltip } from 'reactstrap';
import { FilterMenuAbstract } from '../filter_menu/FilterMenuAbstract';

export const Menu = props => {
  const toggle = props.toggleShowing(props.name);
  const id = `${props.name}-popover`;
  return (
    <Fragment>
      {props.renderButton({ onClick: toggle, id })}
      <Popover
        placement="bottom"
        target={id}
        isOpen={props.showing === props.name}
        toggle={toggle}
      >
        <PopoverBody className="filter-menu-popover">
          <div className="filter-menu-popover__content">
            {props.renderContent()}
            {props.validations.map((validation, i) => (
              <p key={i} className="text-danger">
                {validation}
              </p>
            ))}
          </div>
          <div className="filter-menu-popover__footer">
            <button className="btn btn-link" onClick={props.reset}>
              Reset
            </button>
            <button
              className="btn btn-primary"
              onClick={props.apply}
              disabled={!props.dirty || props.validations.length > 0}
            >
              Apply
            </button>
          </div>
        </PopoverBody>
      </Popover>
    </Fragment>
  );
};

// Define some simple button components just to cleanup the toolbar component.
const MenuButton = props => (
  <button type="button" className="btn btn-subtle" {...props} />
);
const ClearButton = props => {
  const disabled = typeof props.action === 'string';
  return (
    <Fragment>
      <button
        type="button"
        id={props.id}
        className={`btn btn-subtle ${disabled ? 'disabled' : ''}`}
        onClick={!disabled ? props.action : undefined}
      >
        <i className="fa fa-times" />
      </button>
      {disabled && (
        <UncontrolledTooltip placement="right" target={props.id}>
          {props.action}
        </UncontrolledTooltip>
      )}
    </Fragment>
  );
};

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
export const FilterMenuToolbar = ({ filter }) => (
  <FilterMenuAbstract
    filter={filter}
    render={({
      dirty,
      validations,
      apply,
      reset,
      showing,
      toggleShowing,
      ...props
    }) => {
      const popoverProps = {
        dirty,
        apply,
        reset,
        showing,
        toggleShowing,
        validations,
      };
      return (
        <div className="queue-controls">
          <div className="queue-controls__filter">
            <h2>
              {filter.name || 'Adhoc'}
              <button id="filter-config-popover" className="btn btn-link">
                <i className="fa fa-fw fa-cog" id="cog" />
              </button>
            </h2>
            <div className="queue-filter-list">
              <Menu
                name="team"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.teams.isEmpty() ? (
                    <MenuButton {...btnProps}>
                      Any Team
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        Team: {props.teamSummary}
                      </MenuButton>
                      <ClearButton action={props.clearTeams} />
                    </div>
                  )
                }
                renderContent={() => props.teamFilters}
              />
              <Menu
                name="assignment"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.assignments.toSeq().every(b => !b) ? (
                    <MenuButton {...btnProps}>
                      Any Assignment
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        Assignment: {props.assignmentSummary}
                      </MenuButton>
                      <ClearButton action={props.clearAssignments} />
                    </div>
                  )
                }
                renderContent={() => props.assignmentFilters}
              />
              <Menu
                name="status"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.status.isEmpty() ? (
                    <MenuButton {...btnProps}>
                      Any Status
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        Status: {props.statusSummary}
                      </MenuButton>
                      <ClearButton action={props.clearStatus} />
                    </div>
                  )
                }
                renderContent={() => props.statusFilters}
              />
              <Menu
                name="date-range"
                {...popoverProps}
                renderButton={btnProps =>
                  !filter.dateRange.custom && filter.dateRange.preset === '' ? (
                    <MenuButton {...btnProps}>
                      Any Date Range
                      <i className="fa fa-fw fa-caret-down" />
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        {props.dateRangeSummary}
                      </MenuButton>
                      <ClearButton
                        id="clearDateRange"
                        action={props.clearDateRange}
                      />
                    </div>
                  )
                }
                renderContent={() => props.dateRangeFilters}
              />
              <label htmlFor="createdBy" className="btn btn-subtle">
                Created By{' '}
                <input
                  type="checkbox"
                  id="createdBy"
                  checked={filter.createdByMe}
                  onChange={props.toggleCreatedByMe}
                />
              </label>
            </div>
          </div>
          <div className="queue-controls__sorting">
            <div className="queue-controls__item--left">
              <Menu
                name="grouped-by"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.groupBy ? (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        <span
                          className="fa fa-fw fa-folder-open"
                          style={{ fontSize: '14px', color: '#1094C4' }}
                        />
                        Grouped by {filter.groupBy}
                      </MenuButton>
                      <ClearButton action={props.clearGroupedBy} />
                    </div>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        <span
                          className="fa fa-fw fa-folder-open"
                          style={{ fontSize: '14px', color: '#7e8083' }}
                        />
                        Ungrouped
                      </MenuButton>
                    </div>
                  )
                }
                renderContent={() => props.groupedByOptions}
              />
              <SortButton
                toggle={props.toggleGroupDirection}
                direction={props.groupDirection}
              />
            </div>
            {props.count > 0 && !props.isGrouped ? (
              <div className="nav-buttons">
                <button
                  type="button"
                  className="btn btn-link icon-wrapper"
                  disabled={!props.hasPrevPage}
                  onClick={props.gotoPrevPage}
                >
                  <span className="icon">
                    <span className="fa fa-fw fa-caret-left" />
                  </span>
                </button>
                <strong>
                  {/*{props.offset + 1}-{props.offset + props.queueItems.size}*/}
                  0
                </strong>
                {' of '}
                <strong>{props.count}</strong>
                <button
                  type="button"
                  className="btn btn-link icon-wrapper"
                  disabled={!props.hasNextPage}
                  onClick={props.gotoNextPage}
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
              <Menu
                name="sorted-by"
                {...popoverProps}
                renderButton={btnProps => (
                  <MenuButton {...btnProps}>
                    Sorted by {props.sortedBySummary}
                  </MenuButton>
                )}
                renderContent={() => props.sortedByOptions}
              />
              <SortButton
                toggle={props.toggleSortDirection}
                direction={props.sortDirection}
              />
            </div>
          </div>
        </div>
      );
    }}
  />
);
