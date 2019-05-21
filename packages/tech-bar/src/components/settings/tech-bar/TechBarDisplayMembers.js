import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
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
import { AttributeSelectors, InfoMessage, StateListWrapper } from 'common';
import { actions } from '../../../redux/modules/techBarApp';
import { I18n } from '@kineticdata/react';

const TechBarDisplayMembersComponent = ({
  hasManagerAccess,
  team,
  error,
  fetchDisplayTeamRequest,
  techBarName,
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
  <div className="list-wrapper list-wrapper--users">
    <StateListWrapper
      data={team ? team.memberships : null}
      loading={!team}
      error={error}
      emptyTitle="No Front Desk Users Found"
      emptyMessage="Front Desk Users are the users who have access to the check-in, feedback, and overhead display pages."
      emptyActions={
        hasManagerAccess
          ? [{ label: 'Add User', onClick: handleAdd }]
          : undefined
      }
      errorTitle="The team for front desk users is being created."
      errorMessage="This may take a few minutes."
      errorActions={[
        {
          icon: 'fa-refresh',
          onClick: () => {
            fetchDisplayTeamRequest({ techBarName });
          },
        },
      ]}
      components={{ ErrorMessage: InfoMessage }}
    >
      {data => (
        <table className="table table-sm table-striped table-users table--settings">
          <thead className="header">
            <tr>
              <th scope="col">
                <I18n>Display Name</I18n>
              </th>
              <th scope="col">
                <I18n>Username</I18n>
              </th>
              {hasManagerAccess && (
                <th className="text-right" width="1%">
                  <button className="btn btn-primary" onClick={handleAdd}>
                    <I18n>Add User</I18n>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {List(data)
              .sortBy(a => a.user.displayName)
              .map(displayUser => (
                <tr key={displayUser.user.username}>
                  <td scope="row">{displayUser.user.displayName}</td>
                  <td>{displayUser.user.username}</td>
                  {hasManagerAccess && (
                    <td className="text-right">
                      <Dropdown
                        toggle={toggleDropdown(displayUser.user.username)}
                        isOpen={openDropdown === displayUser.user.username}
                      >
                        <DropdownToggle color="link" className="btn-sm">
                          <span className="fa fa-ellipsis-h fa-2x" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            onClick={handleRemove(displayUser.user.username)}
                          >
                            <I18n>Remove</I18n>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  )}
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
              <I18n>New User</I18n>
            </span>
          </h4>
        </div>
        <ModalBody>
          {!user && (
            <div className="form overflow-visible">
              <div className="form-group">
                <label htmlFor="add-user-select">
                  <I18n>Select Users to Add to Front Desk</I18n>
                </label>
                <AttributeSelectors.PeopleSelect
                  id="walkin-account-select"
                  users={true}
                  value={usernames}
                  valueMapper={value => value.user.username}
                  onChange={e => setUsernames(e.target.value)}
                  props={{ minLength: 3 }}
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
              <I18n>Are you sure you want to remove the user</I18n>{' '}
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
  error: state.techBarApp.displayTeamError,
  team: state.techBarApp.displayTeam,
});

export const mapDispatchToProps = {
  addDisplayTeamUser: actions.createDisplayTeamMembershipRequest,
  removeDisplayTeamUser: actions.deleteDisplayTeamMembershipRequest,
  createUserAsDisplayTeamUser: actions.createDisplayTeamUserRequest,
  fetchDisplayTeamRequest: actions.fetchDisplayTeamRequest,
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
  addDisplayTeamUser,
  createUserAsDisplayTeamUser,
  setOpenModal,
  techBarName,
  usernames,
  setUsernames,
  user,
  setUser,
}) => () => {
  user
    ? createUserAsDisplayTeamUser({ user, techBarName })
    : addDisplayTeamUser({ usernames, techBarName });
  setOpenModal(false);
  setUsernames([]);
  setUser(null);
};
const handleRemove = ({ setOpenConfirm }) => id => () => setOpenConfirm(id);
const toggleConfirm = ({ setOpenConfirm }) => () => setOpenConfirm(false);
const processRemove = ({
  removeDisplayTeamUser,
  setOpenConfirm,
  techBarName,
}) => username => () => {
  removeDisplayTeamUser({ username, techBarName });
  setOpenConfirm(false);
};

export const TechBarDisplayMembers = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ techBar }) => ({
    techBarName: techBar ? techBar.values['Name'] : '',
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
  lifecycle({
    componentDidMount() {
      this.props.fetchDisplayTeamRequest({
        techBarName: this.props.techBarName,
      });
    },
  }),
)(TechBarDisplayMembersComponent);
