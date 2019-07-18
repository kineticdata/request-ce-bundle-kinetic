import React from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { CoreForm, I18n, Moment } from '@kineticdata/react';
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
import { StateListWrapper } from '../StateMessages';
import {
  actions,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULER_OVERRIDES_PAGE_SIZE,
} from '../../redux/modules/schedulers';
import { addError } from '../../redux/modules/toasts';

const globals = import('common/globals');

const formatDate = date => (
  <Moment timestamp={moment(date, 'YYYY/MM/DD')} format={Moment.formats.date} />
);
const formatTime = time => (
  <Moment timestamp={moment(time, 'HH:mm')} format={Moment.formats.time} />
);

const SchedulerOverridesComponent = ({
  schedulerId,
  overrides,
  error,
  paging,
  hasPreviousPage,
  hasNextPage,
  pageIndexStart,
  pageIndexEnd,
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
    <div className="form py-2 px-0">
      <label htmlFor="past-overrides" className="m-0">
        <input
          type="checkbox"
          id="past-overrides"
          className="mr-2"
          checked={includePastOverrides}
          onChange={() => togglePastOverrides(!includePastOverrides)}
        />
        <span>Show Past Overrides</span>
      </label>
    </div>
    <StateListWrapper
      error={error}
      data={overrides}
      emptyTitle="No overrides found"
      emptyMessage="Overrides overwrite the standard availability for a given date"
      errorTitle="Failed to retrieve overrides"
      errorMessage={true}
    >
      {data => (
        <table className="table table-sm table-striped table-overrides table--settings">
          <thead className="header">
            <tr>
              <th scope="col">
                <I18n>Date</I18n>
              </th>
              <th scope="col">
                <I18n>Start Time</I18n>
              </th>
              <th scope="col">
                <I18n>End Time</I18n>
              </th>
              <th scope="col">
                <I18n>Slots</I18n>
              </th>
              <th className="text-right">
                <button className="btn btn-primary" onClick={handleAdd}>
                  <I18n>Add Override</I18n>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((a, index) => (
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
                      <DropdownItem onClick={handleEdit(a.id)}>
                        <I18n>Edit</I18n>
                      </DropdownItem>
                      <DropdownItem onClick={handleDelete(a.id)}>
                        <I18n>Delete</I18n>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="text-center">
                <div className="pagination-bar">
                  <I18n
                    render={translate => (
                      <button
                        className="btn btn-link icon-wrapper"
                        onClick={() => fetchPreviousSchedulerOverrides()}
                        disabled={paging || !hasPreviousPage}
                        title={translate('Previous Page')}
                      >
                        <span className="icon">
                          <span className="fa fa-fw fa-caret-left" />
                        </span>
                      </button>
                    )}
                  />
                  <small>
                    {paging ? (
                      <span className="fa fa-spinner fa-spin" />
                    ) : (
                      <strong>{`${pageIndexStart}-${pageIndexEnd}`}</strong>
                    )}
                  </small>
                  <I18n
                    render={translate => (
                      <button
                        className="btn btn-link icon-wrapper"
                        onClick={() => fetchNextSchedulerOverrides()}
                        disabled={paging || !hasNextPage}
                        title={translate('Next Page')}
                      >
                        <span className="icon">
                          <span className="fa fa-fw fa-caret-right" />
                        </span>
                      </button>
                    )}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
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
                {openModal === true ? 'New Override' : 'Edit Override'}
              </I18n>
            </span>
          </h4>
        </div>
        <ModalBody>
          <I18n context={`datastore.forms.${SCHEDULER_OVERRIDE_FORM_SLUG}`}>
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
            <div>
              <I18n>
                Are you sure you want to delete the following Override?
              </I18n>
            </div>
            {[overrides.find(c => c.id === openConfirm)].map((a, i) => (
              <strong key={i}>
                {formatDate(a.values['Date'])} <I18n>from</I18n>{' '}
                {formatTime(a.values['Start Time'])} <I18n>to</I18n>{' '}
                {formatTime(a.values['End Time'])} <I18n>with</I18n>{' '}
                {a.values['Slots']} <I18n>slots</I18n>.
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
            <I18n>Delete</I18n>
          </button>
        </ModalFooter>
      </Modal>
    )}
  </div>
);

export const mapStateToProps = ({ schedulers }) => ({
  includePastOverrides: schedulers.scheduler.includePastOverrides,
  error: schedulers.scheduler.overrides.error,
  overrides: schedulers.scheduler.overrides.data,
  paging: schedulers.scheduler.overrides.paging,
  hasNextPage: !!schedulers.scheduler.overrides.nextPageToken,
  hasPreviousPage: !!schedulers.scheduler.overrides.previousPageTokens.size,
  pageIndexStart:
    schedulers.scheduler.overrides.previousPageTokens.size *
      SCHEDULER_OVERRIDES_PAGE_SIZE +
    (schedulers.scheduler.overrides.data &&
    schedulers.scheduler.overrides.data.size > 0
      ? 1
      : 0),
  pageIndexEnd:
    schedulers.scheduler.overrides.previousPageTokens.size *
      SCHEDULER_OVERRIDES_PAGE_SIZE +
    (schedulers.scheduler.overrides.data
      ? schedulers.scheduler.overrides.data.size
      : 0),
});

export const mapDispatchToProps = {
  fetchSchedulerOverrides: actions.fetchSchedulerOverridesRequest,
  fetchNextSchedulerOverrides: actions.fetchSchedulerOverridesNext,
  fetchPreviousSchedulerOverrides: actions.fetchSchedulerOverridesPrevious,
  deleteSchedulerOverride: actions.deleteSchedulerOverrideRequest,
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
  addError(response.error, 'Error');
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
