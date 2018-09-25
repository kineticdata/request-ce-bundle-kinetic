import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { CoreForm } from 'react-kinetic-core';
import moment from 'moment';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { LoadingMessage, ErrorMessage, EmptyMessage } from './Schedulers';
import {
  actions,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULER_OVERRIDES_PAGE_SIZE,
} from '../../redux/modules/schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';

const globals = import('common/globals');

const formatDate = date => moment(date, 'YYYY/MM/DD').format('ll');
const formatTime = time => moment(time, 'HH:mm').format('LT');

const SchedulerOverridesComponent = ({
  schedulerId,
  overrides,
  loading,
  errors,
  hasPreviousPage,
  hasNextPage,
  startIndex,
  endIndex,
  fetchPreviousSchedulerOverrides,
  fetchNextSchedulerOverrides,
  includePastOverrides,
  togglePastOverrides,
  openDropdown,
  toggleDropdown,
  openModal,
  toggleModal,
  handleAdd,
  handleEdit,
  openConfirm,
  toggleConfirm,
  handleDelete,
  handleSaved,
  processDelete,
}) => (
  <div className="list-wrapper list-wrapper--overrides">
    <div className="text-right">
      <button
        className={`btn ${includePastOverrides ? 'btn-success' : 'btn-subtle'}`}
        onClick={() => togglePastOverrides(!includePastOverrides)}
      >
        {`${includePastOverrides ? 'Hide' : 'Show'} Past Overrides`}
      </button>
      <button className="btn btn-primary" onClick={handleAdd}>
        Add Override
      </button>
    </div>
    {loading && overrides.size === 0 && <LoadingMessage />}
    {!loading &&
      errors.length > 0 && (
        <ErrorMessage
          heading="Failed to retrieve overrides"
          text={errors.map(e => <div>{e}</div>)}
        />
      )}
    {!loading &&
      errors.length === 0 &&
      overrides.size === 0 && (
        <EmptyMessage
          heading="No Overrides Found"
          text="Overrides overwrite the standard availability for a given date."
        />
      )}
    {overrides.size > 0 && (
      <table className="table table-sm table-striped table-overrides settings-table">
        <thead className="header">
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Slots</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {overrides.map((a, index) => (
            <tr key={`overrides-${index}`}>
              <td>{formatDate(a.values['Date'])}</td>
              <td>{formatTime(a.values['Start Time'])}</td>
              <td>{formatTime(a.values['End Time'])}</td>
              <td>{a.values['Slots']}</td>
              <td className="text-right">
                <Dropdown
                  toggle={toggleDropdown(a.id)}
                  isOpen={openDropdown === a.id}
                >
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-h fa-2x" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={handleEdit(a.id)}>Edit</DropdownItem>
                    <DropdownItem onClick={handleDelete(a.id)}>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
        {!loading && (
          <tfoot>
            <tr>
              <td colSpan="5" className="text-center">
                {hasPreviousPage && (
                  <button
                    className="btn btn-sm btn-secondary pull-left"
                    onClick={() => fetchPreviousSchedulerOverrides()}
                  >{`Previous ${SCHEDULER_OVERRIDES_PAGE_SIZE}`}</button>
                )}
                {`Viewing Overrides ${startIndex} to ${endIndex}`}
                {hasNextPage && (
                  <button
                    className="btn btn-sm btn-secondary pull-right"
                    onClick={() => fetchNextSchedulerOverrides()}
                  >{`Next ${SCHEDULER_OVERRIDES_PAGE_SIZE}`}</button>
                )}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    )}

    {openModal && (
      <Modal isOpen={!!openModal} toggle={toggleModal}>
        <div className="modal-header">
          <h4 className="modal-title">
            <button
              type="button"
              className="btn btn-link"
              onClick={toggleModal}
            >
              Cancel
            </button>
            <span>{openModal === true ? 'New Override' : 'Edit Override'}</span>
          </h4>
        </div>
        <ModalBody>
          {openModal === true ? (
            <CoreForm
              datastore
              form={SCHEDULER_OVERRIDE_FORM_SLUG}
              created={handleSaved}
              error={handleError}
              values={{ 'Scheduler Id': schedulerId }}
              globals={globals}
            />
          ) : (
            <CoreForm
              datastore
              submission={openModal}
              updated={handleSaved}
              error={handleError}
              globals={globals}
            />
          )}
        </ModalBody>
      </Modal>
    )}

    {openConfirm && (
      <Modal isOpen={!!openConfirm} toggle={toggleConfirm}>
        <div className="modal-header">
          <h4 className="modal-title">
            <button
              type="button"
              className="btn btn-link"
              onClick={toggleConfirm}
            >
              Cancel
            </button>
            <span>Confirm Delete</span>
          </h4>
        </div>
        <ModalBody className="modal-body--padding">
          <div>
            <div>Are you sure you want to delete the following Override?</div>
            {[overrides.find(c => c.id === openConfirm)].map((a, i) => (
              <strong key={i}>
                {`
                    ${formatDate(a.values['Date'])} from
                    ${formatTime(a.values['Start Time'])} to
                    ${formatTime(a.values['End Time'])} with
                    ${a.values['Slots']} slots.
                  `}
              </strong>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={processDelete(openConfirm)}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={toggleConfirm}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    )}
  </div>
);

export const mapStateToProps = ({ common: { schedulers } }) => ({
  includePastOverrides: schedulers.scheduler.includePastOverrides,
  loading: schedulers.scheduler.overrides.loading,
  errors: schedulers.scheduler.overrides.errors,
  overrides: schedulers.scheduler.overrides.data,
  hasNextPage: !!schedulers.scheduler.overrides.nextPageToken,
  hasPreviousPage: !!schedulers.scheduler.overrides.previousPageTokens.size,
  startIndex:
    schedulers.scheduler.overrides.previousPageTokens.size *
      SCHEDULER_OVERRIDES_PAGE_SIZE +
    1,
  endIndex:
    schedulers.scheduler.overrides.previousPageTokens.size *
      SCHEDULER_OVERRIDES_PAGE_SIZE +
    schedulers.scheduler.overrides.data.size,
});

export const mapDispatchToProps = {
  push,
  fetchSchedulerOverrides: actions.fetchSchedulerOverrides,
  fetchNextSchedulerOverrides: actions.fetchNextSchedulerOverrides,
  fetchPreviousSchedulerOverrides: actions.fetchPreviousSchedulerOverrides,
  deleteSchedulerOverride: actions.deleteSchedulerOverride,
  addError: toastActions.addError,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

const handleAdd = ({ setOpenModal }) => () => setOpenModal(true);
const handleEdit = ({ setOpenModal }) => id => () => setOpenModal(id);
const toggleModal = ({ setOpenModal }) => () => setOpenModal(false);
const handleDelete = ({ setOpenConfirm }) => id => () => setOpenConfirm(id);
const toggleConfirm = ({ setOpenConfirm }) => () => setOpenConfirm(false);
const processDelete = ({
  deleteSchedulerOverride,
  setOpenConfirm,
}) => id => () => {
  deleteSchedulerOverride({ id });
  setOpenConfirm(false);
};

const handleSaved = ({ fetchSchedulerOverrides, setOpenModal }) => () => {
  fetchSchedulerOverrides();
  setOpenModal(false);
};
const handleError = props => response => {
  props.addError(response.error, 'Error');
};

const togglePastOverrides = ({ fetchSchedulerOverrides }) => include => {
  fetchSchedulerOverrides({ past: include });
};

export const SchedulerOverrides = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDropdown', 'setOpenDropdown', false),
  withState('openModal', 'setOpenModal', false),
  withState('openConfirm', 'setOpenConfirm', false),
  withHandlers({
    toggleDropdown,
    handleAdd,
    handleEdit,
    toggleModal,
    handleDelete,
    toggleConfirm,
    processDelete,
    handleSaved,
    handleError,
    togglePastOverrides,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchSchedulerOverrides();
    },
  }),
)(SchedulerOverridesComponent);
