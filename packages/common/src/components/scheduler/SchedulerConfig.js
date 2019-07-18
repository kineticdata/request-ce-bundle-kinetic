import React from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { CoreForm, I18n } from '@kineticdata/react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { StateListWrapper } from '../StateMessages';
import {
  actions,
  SCHEDULER_CONFIG_FORM_SLUG,
} from '../../redux/modules/schedulers';
import { addError } from '../../redux/modules/toasts';

const globals = import('common/globals');

const SchedulerConfigComponent = ({
  schedulerId,
  timeInterval,
  configs,
  error,
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
    <StateListWrapper
      error={error}
      data={configs}
      emptyTitle="No event types found"
      emptyMessage="Event types define the duration of the various events customers can schedule"
      errorTitle="Failed to retrieve event types"
      errorMessage={true}
    >
      {data => (
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
            {data.map(config => (
              <tr key={config.values['Event Type']}>
                <td>
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
    </StateListWrapper>

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
          <I18n context={`datastore.forms.${SCHEDULER_CONFIG_FORM_SLUG}`}>
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
  error: state.schedulers.scheduler.config.error,
  configs: state.schedulers.scheduler.config.data,
});

export const mapDispatchToProps = {
  fetchSchedulerConfig: actions.fetchSchedulerConfigRequest,
  deleteSchedulerConfig: actions.deleteSchedulerConfigRequest,
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
  addError(response.error, 'Error');
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
