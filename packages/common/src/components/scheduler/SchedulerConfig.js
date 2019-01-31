import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { CoreForm } from 'react-kinetic-core';
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
  SCHEDULER_CONFIG_FORM_SLUG,
} from '../../redux/modules/schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';
import { I18n } from '../../../../app/src/I18nProvider';

const globals = import('common/globals');

const SchedulerConfigComponent = ({
  schedulerId,
  timeInterval,
  configs,
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
  handleLoaded,
  handleSaved,
  handleError,
  processDelete,
}) => (
  <div className="list-wrapper list-wrapper--config">
    {loading && configs.size === 0 && <LoadingMessage />}
    {!loading &&
      errors.length > 0 && (
        <ErrorMessage
          heading="Failed to retrieve event types."
          text={errors.map((e, i) => (
            <div key={`error-${i}`}>
              <I18n>{e}</I18n>
            </div>
          ))}
        />
      )}
    {!loading &&
      errors.length === 0 &&
      configs.size === 0 && (
        <Fragment>
          <EmptyMessage
            heading="No Event Types Found"
            text="Event Types define the duration of the various events customers can schedule."
          />

          <div className="text-center">
            <button className="btn btn-primary" onClick={handleAdd}>
              <I18n>Add Event Type</I18n>
            </button>
          </div>
        </Fragment>
      )}
    {configs.size > 0 && (
      <table className="table table-sm table-striped table-configs table--settings">
        <thead className="header">
          <tr>
            <th scope="col">
              <I18n>Event Type</I18n>
            </th>
            <th scope="col">
              <I18n>Duration</I18n>
            </th>
            <th scope="col">
              <I18n>Status</I18n>
            </th>
            <th className="text-right">
              <button className="btn btn-primary" onClick={handleAdd}>
                <I18n>Add Event Type</I18n>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {configs.map(config => (
            <tr key={config.values['Event Type']}>
              <td scope="row">
                <I18n>{config.values['Event Type']}</I18n>
              </td>
              <td>
                {parseInt(config.values['Duration Multiplier'], 10) *
                  timeInterval}{' '}
                <I18n>minutes</I18n>
              </td>
              <td>
                <I18n>{config.values['Status']}</I18n>
              </td>
              <td className="text-right">
                <Dropdown
                  toggle={toggleDropdown(config.id)}
                  isOpen={openDropdown === config.id}
                >
                  <DropdownToggle color="link" className="btn-sm">
                    <span className="fa fa-ellipsis-h fa-2x" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={handleEdit(config.id)}>
                      <I18n>Edit</I18n>
                    </DropdownItem>
                    <DropdownItem onClick={handleDelete(config.id)}>
                      <I18n>Delete</I18n>
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
              <I18n>Cancel</I18n>
            </button>
            <span>
              <I18n>
                {openModal === true ? 'New Event Type' : 'Edit Event Type'}
              </I18n>
            </span>
          </h4>
        </div>
        <ModalBody>
          <I18n context={`datastore.form.SCHEDULER_CONFIG_FORM_SLUG`}>
            {openModal === true ? (
              <CoreForm
                datastore
                form={SCHEDULER_CONFIG_FORM_SLUG}
                loaded={handleLoaded}
                created={handleSaved}
                error={handleError}
                values={{
                  'Scheduler Id': schedulerId,
                }}
                globals={globals}
              />
            ) : (
              <CoreForm
                datastore
                submission={openModal}
                loaded={handleLoaded}
                updated={handleSaved}
                error={handleError}
                globals={globals}
              />
            )}
          </I18n>
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
              <I18n>Cancel</I18n>
            </button>
            <span>
              <I18n>Confirm Delete</I18n>
            </span>
          </h4>
        </div>
        <ModalBody className="modal-body--padding">
          <div>
            <span>
              <I18n>Are you sure you want to delete the</I18n>{' '}
            </span>
            <strong>
              <I18n>
                {configs.find(c => c.id === openConfirm).values['Event Type']}
              </I18n>
            </strong>
            <span>
              {' '}
              <I18n>Event Type?</I18n>
            </span>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={processDelete(openConfirm)}
          >
            <I18n>Delete</I18n>
          </button>
        </ModalFooter>
      </Modal>
    )}
  </div>
);

export const mapStateToProps = state => ({
  loading: state.common.schedulers.scheduler.config.loading,
  errors: state.common.schedulers.scheduler.config.errors,
  configs: state.common.schedulers.scheduler.config.data,
});

export const mapDispatchToProps = {
  push,
  fetchSchedulerConfig: actions.fetchSchedulerConfig,
  deleteSchedulerConfig: actions.deleteSchedulerConfig,
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
  deleteSchedulerConfig,
  setOpenConfirm,
}) => id => () => {
  deleteSchedulerConfig({ id });
  setOpenConfirm(false);
};

const handleLoaded = ({ timeInterval }) => form => {
  form
    .getFieldByName('Time Interval')
    .value(timeInterval)
    .trigger('change');
};
const handleSaved = ({ fetchSchedulerConfig, setOpenModal }) => () => {
  fetchSchedulerConfig();
  setOpenModal(false);
};
const handleError = props => response => {
  props.addError(response.error, 'Error');
};

export const SchedulerConfig = compose(
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
    handleLoaded,
    handleSaved,
    handleError,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchSchedulerConfig();
    },
  }),
)(SchedulerConfigComponent);
