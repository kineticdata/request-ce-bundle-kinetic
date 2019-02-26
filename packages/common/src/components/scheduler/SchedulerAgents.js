import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withProps, withState } from 'recompose';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { List } from 'immutable';
import { AttributeSelectors } from 'common';
import { LoadingMessage, EmptyMessage, InfoMessage } from './Schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';
import { actions } from '../../redux/modules/schedulers';
import { I18n } from '../../../../app/src/I18nProvider';

const SchedulerAgentsComponent = ({
  loading,
  agents,
  fetchSchedulerAgentsTeam,
  schedulerName,
  openDropdown,
  toggleDropdown,
  openModal,
  toggleModal,
  handleAdd,
  usernames,
  setUsernames,
  user,
  setUser,
  processAdd,
  openConfirm,
  toggleConfirm,
  handleRemove,
  processRemove,
}) => (
  <div className="list-wrapper list-wrapper--agents">
    {loading && !agents && <LoadingMessage />}
    {!loading &&
      !agents && (
        <Fragment>
          <InfoMessage
            heading="The team for agents is being created."
            text="This may take a few minutes."
          />
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                fetchSchedulerAgentsTeam({
                  schedulerName,
                });
              }}
            >
              <span className="fa fa-refresh" />
            </button>
          </div>
        </Fragment>
      )}
    {!loading &&
      agents &&
      agents.memberships.length === 0 && (
        <Fragment>
          <EmptyMessage
            heading="No Agents Found"
            text="Agents are the users who are assigned to scheduled events."
          />
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleAdd}>
              <I18n>Add Agent</I18n>
            </button>
          </div>
        </Fragment>
      )}
    {!loading &&
      agents &&
      agents.memberships.length > 0 && (
        <table className="table table-sm table-striped table-agents table--settings">
          <thead className="header">
            <tr>
              <th scope="col">
                <I18n>Display Name</I18n>
              </th>
              <th scope="col">
                <I18n>Username</I18n>
              </th>
              <th className="text-right">
                <button className="btn btn-primary" onClick={handleAdd}>
                  <I18n>Add Agent</I18n>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {List(agents.memberships)
              .sortBy(a => a.user.displayName)
              .map(agent => (
                <tr key={agent.user.username}>
                  <td scope="row">{agent.user.displayName}</td>
                  <td>{agent.user.username}</td>
                  <td className="text-right">
                    <Dropdown
                      toggle={toggleDropdown(agent.user.username)}
                      isOpen={openDropdown === agent.user.username}
                    >
                      <DropdownToggle color="link" className="btn-sm">
                        <span className="fa fa-ellipsis-h fa-2x" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          onClick={handleRemove(agent.user.username)}
                        >
                          <I18n>Remove</I18n>
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
              <I18n>New Agent</I18n>
            </span>
          </h4>
        </div>
        <ModalBody>
          {/* TODO: add people search, and create new user options, create actions and sagas */}
          {!user && (
            <div className="form overflow-visible">
              <div className="form-group">
                <label htmlFor="add-agent-select">
                  <I18n>Select Users to Add as Agents</I18n>
                </label>
                <AttributeSelectors.PeopleSelect
                  id="walkin-account-select"
                  users={true}
                  value={usernames}
                  valueMapper={value => value.user.username}
                  onChange={e => setUsernames(e.target.value)}
                />
              </div>
              <div className="form-group text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setUser({
                      firstName: '',
                      lastName: '',
                      email: '',
                    });
                    setUsernames([]);
                  }}
                >
                  <I18n>or Create New User</I18n>
                </button>
              </div>
            </div>
          )}
          {user && (
            <div className="form">
              <div className="form-group">
                <label htmlFor="first-name-input required">
                  <I18n>First Name</I18n>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={user.firstName}
                  onChange={e =>
                    setUser({
                      ...user,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="last-name-input required">
                  <I18n>Last Name</I18n>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={user.lastName}
                  onChange={e =>
                    setUser({
                      ...user,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="email-input required">
                  <I18n>Email Address</I18n>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={user.email}
                  onChange={e =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={processAdd}
            disabled={
              (user && (!user.firstName || !user.lastName || !user.email)) ||
              (!user && usernames.length === 0)
            }
          >
            <I18n>Add</I18n>
          </button>
        </ModalFooter>
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
              <I18n>Confirm Remove</I18n>
            </span>
          </h4>
        </div>
        <ModalBody className="modal-body--padding">
          <div>
            <span>
              <I18n>Are you sure you want to remove the Agent</I18n>{' '}
            </span>
            <strong>{openConfirm}</strong>
            <span>
              <I18n>?</I18n>
            </span>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={processRemove(openConfirm)}
          >
            <I18n>Remove</I18n>
          </button>
        </ModalFooter>
      </Modal>
    )}
  </div>
);

export const mapStateToProps = state => ({
  loading: state.common.schedulers.scheduler.loading,
  scheduler: state.common.schedulers.scheduler.data,
  agents: state.common.schedulers.scheduler.teams.agents,
});

export const mapDispatchToProps = {
  push,
  addSchedulerAgent: actions.addSchedulerMembership,
  removeSchedulerAgent: actions.removeSchedulerMembership,
  createUserAsSchedulerAgent: actions.createUserWithSchedulerMembership,
  fetchSchedulerAgentsTeam: actions.fetchSchedulerAgentsTeam,
  addError: toastActions.addError,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

const handleAdd = ({ setOpenModal }) => () => setOpenModal(true);
const toggleModal = ({ setOpenModal, setUsernames, setUser }) => () => {
  setOpenModal(false);
  setUsernames([]);
  setUser(null);
};
const processAdd = ({
  addSchedulerAgent,
  createUserAsSchedulerAgent,
  setOpenModal,
  schedulerName,
  usernames,
  setUsernames,
  user,
  setUser,
}) => () => {
  user
    ? createUserAsSchedulerAgent({ user, schedulerName })
    : addSchedulerAgent({ usernames, schedulerName });
  setOpenModal(false);
  setUsernames([]);
  setUser(null);
};
const handleRemove = ({ setOpenConfirm }) => id => () => setOpenConfirm(id);
const toggleConfirm = ({ setOpenConfirm }) => () => setOpenConfirm(false);
const processRemove = ({
  removeSchedulerAgent,
  setOpenConfirm,
  schedulerName,
}) => username => () => {
  removeSchedulerAgent({ username, schedulerName });
  setOpenConfirm(false);
};

export const SchedulerAgents = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ scheduler }) => ({
    schedulerName: scheduler ? scheduler.values['Name'] : '',
  })),
  withState('openDropdown', 'setOpenDropdown', false),
  withState('openModal', 'setOpenModal', false),
  withState('usernames', 'setUsernames', []),
  withState('user', 'setUser', null),
  withState('openConfirm', 'setOpenConfirm', false),
  withHandlers({
    toggleDropdown,
    handleAdd,
    toggleModal,
    processAdd,
    handleRemove,
    toggleConfirm,
    processRemove,
  }),
)(SchedulerAgentsComponent);
