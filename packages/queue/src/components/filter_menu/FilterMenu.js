import React from 'react';
import { Modal, ModalFooter } from 'reactstrap';
import { MainSection } from './MainSection';
import { AssignmentSectionContainer } from './AssignmentSection';
import { TeamsSectionContainer } from './TeamsSection';
import { StatusSectionContainer } from './StatusSection';
import { DateRangeSectionContainer } from './DateRangeSection';
import { SortedBySectionContainer } from './SortedBySection';
import { GroupedBySectionContainer } from './GroupedBySection';
import { I18n } from '@kineticdata/react';

export const FilterMenu = ({
  teams,
  hasTeams,
  isOpen,
  isDirty,
  close,
  reset,
  filterName,
  handleChangeFilterName,
  handleSaveFilter,
  handleRemoveFilter,
  activeSection,
  applyFilterHandler,
  showSection,
  currentFilter,
  errors,
}) => (
  <Modal isOpen={isOpen} toggle={close}>
    <div className="modal-header">
      <div className="modal-title">
        <button type="button" className="btn btn-link" onClick={close}>
          <I18n>Close</I18n>
        </button>
        <span>
          <I18n>Filters</I18n>
        </span>
        <button
          type="button"
          className="btn btn-link"
          disabled={!isDirty}
          onClick={reset}
        >
          <I18n>Reset</I18n>
        </button>
      </div>
      {activeSection !== null && (
        <button
          type="button"
          className="btn btn-link btn-back"
          onClick={() => showSection(null)}
        >
          <span className="icon">
            <span className="fa fa-fw fa-chevron-left" />
          </span>
          <I18n>Filters</I18n>
        </button>
      )}
    </div>
    {currentFilter &&
      activeSection === null && (
        <MainSection
          filter={currentFilter}
          showSection={showSection}
          filterName={filterName}
          handleChangeFilterName={handleChangeFilterName}
          handleSaveFilter={handleSaveFilter}
          handleRemoveFilter={handleRemoveFilter}
          errors={errors}
          hasTeams={hasTeams}
        />
      )}
    {currentFilter &&
      activeSection === 'teams' && (
        <TeamsSectionContainer filter={currentFilter} teams={teams} />
      )}
    {currentFilter &&
      activeSection === 'assignment' && (
        <AssignmentSectionContainer filter={currentFilter} errors={errors} />
      )}
    {currentFilter &&
      activeSection === 'status' && (
        <StatusSectionContainer filter={currentFilter} />
      )}
    {currentFilter &&
      activeSection === 'date' && (
        <DateRangeSectionContainer errors={errors} filter={currentFilter} />
      )}
    {currentFilter &&
      activeSection === 'sort' && (
        <SortedBySectionContainer filter={currentFilter} />
      )}
    {currentFilter &&
      activeSection === 'group' && (
        <GroupedBySectionContainer filter={currentFilter} />
      )}
    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!isDirty || !errors.isEmpty()}
        onClick={applyFilterHandler}
      >
        <I18n>Apply Filter</I18n>
      </button>
    </ModalFooter>
  </Modal>
);
