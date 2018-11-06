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
  SCHEDULER_AVAILABILITY_FORM_SLUG,
} from '../../redux/modules/schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';

const globals = import('common/globals');

const formatDayName = day => moment(day, 'd').format('dddd');
const formatTime = time => moment(time, 'HH:mm').format('LT');

const SchedulerAvailabilityComponent = ({
  schedulerId,
  availability,
  loading,
  errors,
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
  <div className="list-wrapper list-wrapper--availability">
    <div className="text-right">
      <button className="btn btn-primary" onClick={handleAdd}>
        Add Availability
      </button>
    </div>
    {loading && availability.size === 0 && <LoadingMessage />}
    {!loading &&
      errors.length > 0 && (
        <ErrorMessage
          heading="Failed to retrieve availability"
          text={errors.map(e => <div>{e}</div>)}
        />
      )}
    {!loading &&
      errors.length === 0 &&
      availability.size === 0 && (
        <EmptyMessage
          heading="No Availability Found"
          text="Availability is the times during which customers can request appointments and how many appointments are available at each time."
        />
      )}
    {availability.size > 0 && (
      <table className="table table-sm table-striped table-availability table--settings">
        <thead className="header">
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Slots</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {availability.map((a, index) => (
            <tr key={`availability-${index}`}>
              <td scope="row">{formatDayName(a.values['Day'])}</td>
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
            <span>
              {openModal === true ? 'New Availability' : 'Edit Availability'}
            </span>
          </h4>
        </div>
        <ModalBody>
          {openModal === true ? (
            <CoreForm
              datastore
              form={SCHEDULER_AVAILABILITY_FORM_SLUG}
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
            <div>
              Are you sure you want to delete the following Availability?
            </div>
            {[availability.find(c => c.id === openConfirm)].map((a, i) => (
              <strong key={i}>
                {`
                    ${formatDayName(a.values['Day'])} from
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

export const mapStateToProps = state => ({
  loading: state.common.schedulers.scheduler.availability.loading,
  errors: state.common.schedulers.scheduler.availability.errors,
  availability: state.common.schedulers.scheduler.availability.data,
});

export const mapDispatchToProps = {
  push,
  fetchSchedulerAvailability: actions.fetchSchedulerAvailability,
  deleteSchedulerAvailability: actions.deleteSchedulerAvailability,
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
  deleteSchedulerAvailability,
  setOpenConfirm,
}) => id => () => {
  deleteSchedulerAvailability({ id });
  setOpenConfirm(false);
};

const handleSaved = ({ fetchSchedulerAvailability, setOpenModal }) => () => {
  fetchSchedulerAvailability();
  setOpenModal(false);
};
const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const SchedulerAvailability = compose(
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
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchSchedulerAvailability();
    },
  }),
)(SchedulerAvailabilityComponent);
