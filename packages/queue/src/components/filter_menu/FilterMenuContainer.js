import { compose, withHandlers, withProps } from 'recompose';
import { is, Map } from 'immutable';
import { push } from 'redux-first-history';
import { FilterMenu } from './FilterMenu';
import { actions } from '../../redux/modules/filterMenu';
import { actions as queueActions } from '../../redux/modules/queue';
import { actions as appActions } from '../../redux/modules/queueApp';
import { connect } from '../../redux/store';

export const mapStateToProps = state => ({
  teams: state.queueApp.myTeams,
  hasTeams: state.queueApp.myTeams.size > 0,
  isOpen: state.filterMenu.get('isOpen'),
  activeSection: state.filterMenu.get('activeSection'),
  currentFilter: state.filterMenu.get('currentFilter'),
  isDirty: !is(
    state.filterMenu.get('currentFilter'),
    state.filterMenu.get('initialFilter'),
  ),
  filterName: state.filterMenu.get('filterName'),
  location: state.app.location,
});

export const mapDispatchToProps = {
  close: actions.close,
  reset: actions.reset,
  setFilterName: actions.setFilterName,
  showSection: actions.showSection,
  setAdhocFilter: queueActions.setAdhocFilter,
  fetchList: queueActions.fetchList,
  addPersonalFilter: appActions.addPersonalFilter,
  updatePersonalFilter: appActions.updatePersonalFilter,
  removePersonalFilter: appActions.removePersonalFilter,
  push,
};

export const validateDateRange = filter => {
  if (
    (filter.status.includes('Cancelled') ||
      filter.status.includes('Complete')) &&
    filter.dateRange.preset === '' &&
    !filter.dateRange.custom
  ) {
    return "A date range is required if Status includes 'Complete' or 'Cancelled'";
  } else if (filter.dateRange.custom) {
    if (filter.dateRange.start === '' && filter.dateRange.end === '') {
      return 'Select a start and end date';
    } else if (filter.dateRange.start === '' && filter.dateRange.end !== '') {
      return 'Select a start date';
    } else if (filter.dateRange.start !== '' && filter.dateRange.end === '') {
      return 'Select an end date';
    } else if (filter.dateRange.end < filter.dateRange.start) {
      return 'Select an end date after the start date';
    }
  }
};

export const validateFilterName = filterName => {
  if (filterName && filterName.indexOf('%') >= 0) {
    return 'Percentage signs are not allowed in filter names.';
  }
};

export const FilterMenuContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ currentFilter, filterName }) => ({
    errors: !currentFilter
      ? Map()
      : Map({
          'Date Range': validateDateRange(currentFilter),
          'Filter Name': validateFilterName(filterName),
        }).filter(value => !!value),
  })),
  withHandlers({
    applyFilterHandler: props => () => {
      props.setAdhocFilter(
        props.currentFilter.set('name', '').set('type', 'adhoc'),
      );
      props.push(`${props.location}/adhoc`);
      props.close();
    },
    handleSaveFilter: ({
      addPersonalFilter,
      updatePersonalFilter,
      fetchList,
      currentFilter,
      filterName,
      push,
      close,
      location,
    }) => () => {
      if (
        currentFilter.type === 'custom' &&
        currentFilter.name === filterName
      ) {
        // Update Personal Filter
        updatePersonalFilter(currentFilter);
        fetchList(currentFilter);
      } else {
        addPersonalFilter(
          currentFilter.set('name', filterName).set('type', 'custom'),
        );
        push(`${location}/custom/${encodeURIComponent(filterName)}`);
      }

      close();
    },
    handleRemoveFilter: ({
      removePersonalFilter,
      currentFilter,
      push,
      close,
      location,
    }) => () => {
      removePersonalFilter(currentFilter);

      push(`${location}/list/Mine`);
      close();
    },
    handleChangeFilterName: ({ setFilterName }) => e =>
      setFilterName(e.target.value),
  }),
)(FilterMenu);
