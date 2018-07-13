import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { is, List, Map } from 'immutable';
import { push } from 'connected-react-router';
import { FilterMenu } from './FilterMenu';
import { actions } from '../../redux/modules/filterMenu';
import { actions as queueActions } from '../../redux/modules/queue';
import { actions as appActions } from '../../redux/modules/queueApp';

const selectAppliedAssignments = state => {
  if (state.queue.filterMenu.get('currentFilter')) {
    const assignments = state.queue.filterMenu.get('currentFilter').assignments;
    return List([
      assignments.mine && 'Mine',
      assignments.teammates && 'Teammates',
      assignments.unassigned && 'Unassigned',
    ]).filter(assignmentType => !!assignmentType);
  }
  return List([]);
};

export const mapStateToProps = state => ({
  teams: state.queue.queueApp.myTeams,
  isOpen: state.queue.filterMenu.get('isOpen'),
  activeSection: state.queue.filterMenu.get('activeSection'),
  currentFilter: state.queue.filterMenu.get('currentFilter'),
  isDirty: !is(
    state.queue.filterMenu.get('currentFilter'),
    state.queue.filterMenu.get('initialFilter'),
  ),
  filterName: state.queue.filterMenu.get('filterName'),
  appliedAssignments: selectAppliedAssignments(state),
  kappSlug: state.app.config.kappSlug,
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

const validateDateRange = filter => {
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
    } else if (filter.dateRange.end <= filter.dateRange.start) {
      return 'Select an end date after the start date';
    }
  }
};

export const FilterMenuContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ appliedAssignments, currentFilter }) => ({
    errors: !currentFilter
      ? Map()
      : Map({
          Assignment:
            appliedAssignments.isEmpty() &&
            !currentFilter.createdByMe &&
            'No assignments selected',
          'Date Range': validateDateRange(currentFilter),
        }).filter(value => !!value),
  })),
  withHandlers({
    applyFilterHandler: props => () => {
      props.setAdhocFilter(
        props.currentFilter.set('name', '').set('type', 'adhoc'),
      );
      props.push(`/kapps/${props.kappSlug}/adhoc`);
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
      kappSlug,
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
        push(`/kapps/${kappSlug}/custom/${filterName}`);
      }

      close();
    },
    handleRemoveFilter: ({
      removePersonalFilter,
      currentFilter,
      push,
      close,
      kappSlug,
    }) => () => {
      removePersonalFilter(currentFilter);

      push(`/kapps/${kappSlug}/list/Mine`);
      close();
    },
    handleChangeFilterName: ({ setFilterName }) => e =>
      setFilterName(e.target.value),
  }),
)(FilterMenu);
