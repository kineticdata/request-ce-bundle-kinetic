import React from 'react';
import moment from 'moment';
import { ModalBody } from 'reactstrap';
import { SORT_OPTIONS } from './SortedBySection';
import { CreatedByMeContainer } from './CreatedByMe';
import { I18n } from '@kineticdata/react';
import { ASSIGNMENT_LABELS } from './FilterMenuAbstract';

const ListSummary = ({ type, list }) =>
  list.size > 0 &&
  (list.size === 1 ? (
    <span>
      <I18n>{list.get(0)}</I18n>
    </span>
  ) : (
    <span>
      {list.size} <I18n>{type}</I18n>
    </span>
  ));

const AssignmentSummary = ({ errors, assignments }) =>
  errors.get('Assignment') ? (
    <span className="validation-error text-danger">
      {errors.get('Assignment')}
    </span>
  ) : (
    assignments && (
      <span>
        <I18n>{ASSIGNMENT_LABELS.get(assignments)}</I18n>
      </span>
    )
  );

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
      <I18n>{errors.get('Date Range')}</I18n>
    </span>
  ) : filter.dateRange.preset !== '' ? (
    <span>
      <I18n>
        {formatTimeline(filter.dateRange.timeline)} in last{' '}
        {formatPreset(filter.dateRange.preset)}
      </I18n>
    </span>
  ) : filter.dateRange.custom ? (
    <span style={{ textAlign: 'right' }}>
      <I18n>{formatTimeline(filter.dateRange.timeline)} between</I18n>
      <br />
      {moment(filter.dateRange.start).format('l')} <I18n>and</I18n>{' '}
      {moment(filter.dateRange.end).format('l')}
    </span>
  ) : null;

const FilterNameSummary = ({ errors }) =>
  errors.get('Filter Name') ? (
    <span className="validation-error text-danger">
      <I18n>{errors.get('Filter Name')}</I18n>
    </span>
  ) : null;

export const MainSection = ({
  filter,
  hasTeams,
  showSection,
  filterName,
  handleChangeFilterName,
  handleSaveFilter,
  handleRemoveFilter,
  errors,
}) => (
  <ModalBody>
    <ul className="list-group button-list">
      {hasTeams && (
        <li className="list-group-item">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => showSection('teams')}
          >
            <span className="button-title">
              <I18n>Teams</I18n>
            </span>
            <ListSummary type="Teams" list={filter.teams} />
            <span className="icon">
              <span className="fa fa-angle-right" />
            </span>
          </button>
        </li>
      )}
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link icon-wrapper"
          onClick={() => showSection('assignment')}
        >
          <span className="button-title">
            <I18n>Assignment</I18n>
          </span>
          <AssignmentSummary errors={errors} assignments={filter.assignments} />
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
          <span className="button-title">
            <I18n>Status</I18n>
          </span>
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
          <span className="button-title">
            <I18n>Date Range</I18n>
          </span>
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
          <span className="button-title">
            <I18n>Sorted By</I18n>
          </span>
          <span>
            <I18n>{SORT_OPTIONS.get(filter.sortBy).label}</I18n>
          </span>
          <span className="icon">
            <span className="fa fa-angle-right" />
          </span>
        </button>
      </li>
      <li className="list-group-item">
        <button
          type="button"
          className="btn btn-link icon-wrapper"
          onClick={() => showSection('group')}
        >
          <span className="button-title">
            <I18n>Grouped By</I18n>
          </span>
          <span>
            <I18n>{filter.groupBy}</I18n>
          </span>
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
      <label>
        <I18n>Filter Name</I18n>
      </label>
      <FilterNameSummary errors={errors} />
      <I18n
        render={translate => (
          <input
            type="text"
            placeholder={translate('New Filter Name')}
            value={filterName}
            onChange={handleChangeFilterName}
          />
        )}
      />
      <button
        type="button"
        className="btn btn-inverse"
        onClick={handleSaveFilter}
        disabled={filterName === '' || !errors.isEmpty()}
      >
        <I18n>
          {filter && filter.type === 'custom' && filter.name === filterName
            ? 'Save Filter'
            : 'Save Filter As'}
        </I18n>
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
            <I18n>Delete Filter</I18n>
          </button>
        )}
    </div>
  </ModalBody>
);
