import React from 'react';
import moment from 'moment';
import { ModalBody } from 'reactstrap';
import { SORT_OPTIONS } from './SortedBySection';
import { CreatedByMeContainer } from './CreatedByMe';

const ListSummary = ({ type, list }) =>
  list.size > 0 &&
  (list.size === 1 ? (
    <span>{list.get(0)}</span>
  ) : (
    <span>
      {list.size} {type}
    </span>
  ));

const AssignmentSummary = ({ errors, appliedAssignments }) => {
  if (errors.get('Assignment')) {
    return (
      <span className="validation-error text-danger">
        {errors.get('Assignment')}
      </span>
    );
  } else if (appliedAssignments.size === 1) {
    return <span>{appliedAssignments.get(0)}</span>;
  }
  return <span>{appliedAssignments.size} Assignments</span>;
};

const formatTimeline = timeline => {
  const match = timeline.match(/(.)(.*)At/);
  return `${match[1].toUpperCase()}${match[2]}`;
};

const formatPreset = preset => {
  const match = preset.match(/(\d+)days/);
  return `${match[1]} days`;
};

const DateRangeSummary = ({ errors, filter }) =>
  errors.get('Date Range') ? (
    <span className="validation-error text-danger">
      {errors.get('Date Range')}
    </span>
  ) : filter.dateRange.preset !== '' ? (
    <span>
      {formatTimeline(filter.dateRange.timeline)} in last&nbsp;
      {formatPreset(filter.dateRange.preset)}
    </span>
  ) : filter.dateRange.custom ? (
    <span style={{ textAlign: 'right' }}>
      {formatTimeline(filter.dateRange.timeline)} between<br />
      {moment(filter.dateRange.start).format('l')} and&nbsp;
      {moment(filter.dateRange.end).format('l')}
    </span>
  ) : null;

export const MainSection = ({
  filter,
  showSection,
  filterName,
  handleChangeFilterName,
  handleSaveFilter,
  handleRemoveFilter,
  appliedAssignments,
  errors,
}) => (
  <ModalBody>
    <ul className="list-group button-list">
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => showSection('teams')}
        >
          <span className="button-title">Teams</span>
          <ListSummary type="Teams" list={filter.teams} />
          <span className="icon">
            <span className="fa fa-angle-right" />
          </span>
        </button>
      </li>
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link icon-wrapper"
          onClick={() => showSection('assignment')}
        >
          <span className="button-title">Assignment</span>
          <AssignmentSummary
            errors={errors}
            appliedAssignments={appliedAssignments}
          />
          <span className="icon">
            <span className="fa fa-angle-right" />
          </span>
        </button>
      </li>
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link icon-wrapper"
          onClick={() => showSection('status')}
        >
          <span className="button-title">Status</span>
          <ListSummary type="Statuses" list={filter.status} />
          <span className="icon">
            <span className="fa fa-angle-right" />
          </span>
        </button>
      </li>
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link icon-wrapper"
          onClick={() => showSection('date')}
        >
          <span className="button-title">Date Range</span>
          <DateRangeSummary errors={errors} filter={filter} />
          <span className="icon">
            <span className="fa fa-angle-right" />
          </span>
        </button>
      </li>
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link icon-wrapper"
          onClick={() => showSection('sort')}
        >
          <span className="button-title">Sorted By</span>
          <span>{SORT_OPTIONS.get(filter.sortBy).label}</span>
          <span className="icon">
            <span className="fa fa-angle-right" />
          </span>
        </button>
      </li>
      <li className="list-group-item">
        <CreatedByMeContainer filter={filter} />
      </li>
    </ul>
    <div className="save-filter">
      <label>Filter Name</label>
      <input
        type="text"
        placeholder="New Filter Name"
        value={filterName}
        onChange={handleChangeFilterName}
      />
      <button
        type="button"
        className="btn btn-inverse"
        onClick={handleSaveFilter}
        disabled={filterName === '' || !errors.isEmpty()}
      >
        {filter && filter.type === 'custom' && filter.name === filterName
          ? 'Save Filter'
          : 'Save Filter As'}
      </button>
      {filter &&
        filter.type === 'custom' &&
        filter.name.length > 0 && (
          <button
            type="button"
            className="btn btn-inverse text-danger"
            onClick={handleRemoveFilter}
            disabled={filterName === '' || !errors.isEmpty()}
          >
            Delete Filter
          </button>
        )}
    </div>
  </ModalBody>
);
