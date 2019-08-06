import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { CoreForm } from '@kineticdata/react';
import { AssignmentSelector } from '../shared/AssignmentSelector';
import { I18n } from '@kineticdata/react';

const globals = import('common/globals');

const FormList = ({ myTeamForms, handleFormClick, permittedSubtasks }) => (
  <ul className="list-group button-list">
    {myTeamForms
      .filter(
        form => !permittedSubtasks || permittedSubtasks.includes(form.slug),
      )
      .map(form => (
        <li key={form.slug} className="list-group-item">
          <button
            type="button"
            className="btn btn-link"
            onClick={handleFormClick(form)}
          >
            <span className="button-title">
              <I18n context={`kapps.${form.kapp.slug}.forms.${form.slug}`}>
                {form.name}
              </I18n>
            </span>
            <span className="icon">
              <span className="fa fa-angle-right" />
            </span>
          </button>
        </li>
      ))}
  </ul>
);

const AssignmentList = ({ assignments, handleSelect }) => (
  <AssignmentSelector assignments={assignments} onSelect={handleSelect} />
);

const FormsBackButton = ({ handleFormClick }) => (
  <button
    type="button"
    className="btn btn-link btn-back"
    onClick={handleFormClick(null)}
  >
    <span className="icon">
      <span className="fa fa-fw fa-chevron-left" />
    </span>
    <I18n>Forms</I18n>
  </button>
);

const AssignmentBackButton = ({ handleAssignmentClick }) => (
  <button
    type="button"
    className="btn btn-link btn-back"
    onClick={handleAssignmentClick(null)}
  >
    <span className="icon">
      <span className="fa fa-fw fa-chevron-left" />
    </span>
    <I18n>Assignment</I18n>
  </button>
);

export const NewItemMenu = ({
  kappSlug,
  isOpen,
  options,
  closeNewItemMenu,
  assignments,
  myTeamForms,
  currentAssignment,
  currentForm,
  assignmentRequired,
  kForm,
  onFormLoaded,
  onCreated,
  handleFormClick,
  handleAssignmentClick,
  handleSave,
  handleClosed,
  handleSelect,
}) => (
  <Modal isOpen={isOpen} toggle={handleClosed} onExit={handleClosed} size="lg">
    <div className="modal-header">
      <h4 className="modal-title">
        <button type="button" className="btn btn-link" onClick={handleClosed}>
          <I18n>Close</I18n>
        </button>
        <span>
          <I18n>New</I18n>{' '}
          {currentForm ? (
            <I18n context={`kapps.${kappSlug}.forms.${currentForm.slug}`}>
              {currentForm.name}
            </I18n>
          ) : (
            <I18n>Task</I18n>
          )}
        </span>
      </h4>
      {currentForm !== null &&
        currentAssignment === null && (
          <FormsBackButton handleFormClick={handleFormClick} />
        )}
      {currentForm !== null &&
        currentAssignment !== null && (
          <AssignmentBackButton handleAssignmentClick={handleAssignmentClick} />
        )}
    </div>
    <ModalBody>
      {currentForm === null ? (
        <FormList
          myTeamForms={myTeamForms}
          handleFormClick={handleFormClick}
          permittedSubtasks={options.get('permittedSubtasks')}
        />
      ) : assignmentRequired && currentAssignment === null ? (
        <AssignmentList assignments={assignments} handleSelect={handleSelect} />
      ) : (
        <I18n context={`kapps.${kappSlug}.forms.${currentForm.slug}`}>
          <CoreForm
            kapp={kappSlug}
            form={currentForm.slug}
            globals={globals}
            values={currentAssignment}
            onLoaded={onFormLoaded}
            onCreated={onCreated}
            originId={options.get('originId')}
            parentId={options.get('parentId')}
          />
        </I18n>
      )}
    </ModalBody>
    {currentForm !== null &&
      kForm !== null && (
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            <I18n>Save</I18n>{' '}
            <I18n context={`kapps.${kappSlug}.forms.${currentForm.slug}`}>
              {currentForm.name}
            </I18n>
          </button>
        </ModalFooter>
      )}
  </Modal>
);
