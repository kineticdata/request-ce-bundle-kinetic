import React, { Fragment } from 'react';
import {
  UncontrolledDropdown,
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { FilterMenuAbstract } from '../filter_menu/FilterMenuAbstract';
import isarray from 'isarray';
import { I18n } from '@kineticdata/react';

export const Menu = props => {
  const toggle = props.toggleShowing(props.name);
  const id = `${props.name}-dropdown`;
  return (
    <Fragment>
      <UncontrolledDropdown
        target={id}
        isOpen={props.showing === props.name}
        toggle={toggle}
      >
        {props.renderButton({ onClick: toggle, id })}

        <DropdownMenu className="filter-menu-dropdown">
          {(isarray(props.renderContent)
            ? props.renderContent
            : [props.renderContent]
          ).map((renderContentFn, index) => (
            <div
              className="filter-menu-dropdown__content"
              key={`content-${index}`}
            >
              {renderContentFn()}
            </div>
          ))}
          {(props.validations.length > 0 ||
            (props.messages && props.messages.length > 0)) && (
            <div className="filter-menu-dropdown__validations">
              {props.validations.map((validation, i) => (
                <p key={i} className="text-danger">
                  <small>
                    <I18n>{validation}</I18n>
                  </small>
                </p>
              ))}
              {props.messages &&
                props.messages.map((message, i) => (
                  <p key={i} className="text-info">
                    <small>
                      <I18n>{message}</I18n>
                    </small>
                  </p>
                ))}
            </div>
          )}
          <div className="filter-menu-dropdown__footer">
            <button className="btn btn-link" onClick={props.reset}>
              <I18n>{props.resetLabel || 'Reset'}</I18n>
            </button>
            <button
              className="btn btn-primary"
              onClick={props.apply}
              disabled={!props.dirty || props.validations.length > 0}
            >
              <I18n>
                <I18n>{props.applyLabel || 'Apply'}</I18n>
              </I18n>
            </button>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Fragment>
  );
};

// Define some simple button components just to cleanup the toolbar component.
const MenuButton = props => (
  <DropdownToggle
    tag="button"
    caret
    className="btn btn-subtle"
    {...props}
    setActiveFromChild
  />
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
        aria-label="Clear Filter"
      >
        <i className="fa fa-times" aria-hidden="true" />
      </button>
      {disabled && (
        <UncontrolledTooltip placement="right" target={props.id}>
          <I18n>{props.action}</I18n>
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
      aria-label={`Sort by ${icon}`}
    >
      <span className="icon" aria-hidden="true">
        <span
          className={`fa fa-fw fa-sort-amount-${icon}`}
          style={{ fontSize: '16px', color: '#7e8083' }}
        />
      </span>
    </button>
  );
};

export const FilterMenuToolbar = ({ filter, refresh }) => (
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
            <h2
              className={filter.type === 'adhoc' && filter.name ? 'edited' : ''}
            >
              <I18n>{filter.name || 'Adhoc'}</I18n>
            </h2>
            <div className="queue-filter-list">
              {props.hasTeams && (
                <Menu
                  name="team"
                  {...popoverProps}
                  renderButton={btnProps =>
                    filter.teams.isEmpty() ? (
                      <MenuButton {...btnProps}>
                        <I18n>Any Team</I18n>
                      </MenuButton>
                    ) : (
                      <div className="btn-group">
                        <MenuButton {...btnProps}>
                          <I18n>Team</I18n>: {props.teamSummary}
                        </MenuButton>
                        <ClearButton action={props.clearTeams} />
                      </div>
                    )
                  }
                  renderContent={() => props.teamFilters}
                />
              )}
              <I18n
                render={translate => (
                  <Menu
                    name="assignment"
                    {...popoverProps}
                    renderButton={btnProps =>
                      !filter.assignments ? (
                        <MenuButton {...btnProps}>
                          {translate('Any Assignment')}
                          {filter.createdByMe &&
                            ` | ${translate('Created By Me')}`}
                        </MenuButton>
                      ) : (
                        <div className="btn-group">
                          <MenuButton {...btnProps}>
                            {translate('Assignment')}: {props.assignmentSummary}
                            {filter.createdByMe &&
                              ` | ${translate('Created By Me')}`}
                          </MenuButton>
                        </div>
                      )
                    }
                    renderContent={[
                      () => props.assignmentFilters,
                      () => props.createdByMeFilter,
                    ]}
                  />
                )}
              />
              <Menu
                name="status"
                {...popoverProps}
                renderButton={btnProps =>
                  filter.status.isEmpty() ? (
                    <MenuButton {...btnProps}>
                      <I18n>Any Status</I18n>
                    </MenuButton>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        <I18n>Status</I18n>: {props.statusSummary}
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
                      <I18n>Any Date Range</I18n>
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
            </div>
            <div className="queue-filter-save">
              {filter.type === 'adhoc' && (
                <Menu
                  name="save-filter"
                  {...popoverProps}
                  dirty={true}
                  apply={props.saveFilter}
                  applyLabel="Save"
                  reset={toggleShowing('save-filter')}
                  resetLabel="Cancel"
                  messages={props.saveMessages}
                  renderButton={btnProps => (
                    <MenuButton {...btnProps} className="btn-primary">
                      <I18n>Save Filter?</I18n>
                    </MenuButton>
                  )}
                  renderContent={() => props.saveFilterOptions}
                />
              )}
              {filter.type === 'custom' && (
                <Menu
                  name="delete-filter"
                  {...popoverProps}
                  dirty={true}
                  apply={props.removeFilter}
                  applyLabel="Delete"
                  reset={toggleShowing('delete-filter')}
                  resetLabel="Cancel"
                  renderButton={btnProps => (
                    <MenuButton {...btnProps} className="btn btn-danger">
                      <I18n>Delete Filter</I18n>
                    </MenuButton>
                  )}
                  renderContent={() => (
                    <div>
                      <label>
                        <I18n>Are you sure?</I18n>
                      </label>
                    </div>
                  )}
                />
              )}
              <button
                type="button"
                className="btn btn-link icon-wrapper"
                onClick={refresh}
                aria-label="Refresh"
              >
                <span className="icon">
                  <span
                    className="fa fa-fw fa-refresh"
                    style={{ fontSize: '16px', color: '#7e8083' }}
                  />
                </span>
              </button>
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
                        />{' '}
                        <I18n>Grouped by</I18n> <I18n>{filter.groupBy}</I18n>
                      </MenuButton>
                      <ClearButton action={props.clearGroupedBy} />
                    </div>
                  ) : (
                    <div className="btn-group">
                      <MenuButton {...btnProps}>
                        <span
                          className="fa fa-fw fa-folder-open"
                          style={{ fontSize: '14px', color: '#7e8083' }}
                        />{' '}
                        <I18n>Ungrouped</I18n>
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
            <div className="queue-controls__item--right">
              <Menu
                name="sorted-by"
                {...popoverProps}
                renderButton={btnProps => (
                  <MenuButton {...btnProps}>
                    <span
                      className="fa fa-fw fa-sort"
                      style={{ fontSize: '14px', color: '#1094C4' }}
                    />{' '}
                    <I18n>Sorted by</I18n> {props.sortedBySummary}
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
