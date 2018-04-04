import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { CoreForm } from 'react-kinetic-core';
import { AssignmentSelector } from '../shared/AssignmentSelector';

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
            <span className="button-title">{form.name}</span>
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
    Forms
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
    Assignment
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
  <Modal
    isOpen={isOpen}
    toggle={closeNewItemMenu}
    onExit={handleClosed}
    size="lg"
  >
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          type="button"
          className="btn btn-link"
          onClick={closeNewItemMenu}
        >
          Cancel
        </button>
        <span>New {currentForm ? currentForm.name : 'Task'}</span>
        <span>&nbsp;</span>
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
            Save {currentForm.name}
          </button>
        </ModalFooter>
      )}
  </Modal>
);
