import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalFooter } from 'reactstrap';
import { List, Set } from 'immutable';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import Autocomplete from 'react-autocomplete';
import { Avatar } from 'common';

import {
  actions,
  selectTeam,
  selectTeamMemberships,
} from '../../redux/modules/team';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const getAvailableUsers = (allUsers, currentMembers, addedMembers) => {
  const excludedUsers = Set(
    currentMembers.concat(addedMembers).map(member => member.username),
  );
  return allUsers.filter(user => !excludedUsers.has(user.username));
};

const AddMemberModalComponent = ({
  isOpen,
  handleToggle,
  handleFieldChange,
  handleSubmit,
  typeAheadValue,
  users,
  currentMembers,
  addedMembers,
  handleAddMemberTemp,
  handleRemoveMemberTemp,
  team,
}) => (
  <Modal size="lg" isOpen={isOpen} toggle={handleToggle}>
    <div className="modal-header">
      <h4 className="modal-title">
        <button onClick={handleToggle} type="button" className="btn btn-link">
          <I18n>Close</I18n>
        </button>
        <span>
          <I18n>Add</I18n> <I18n>{team.name}</I18n> <I18n>Team Members</I18n>
        </span>
      </h4>
    </div>
    <div className="modal-body">
      <div className="modal-form">
        <form>
          <I18n
            render={translate => (
              <Autocomplete
                inputProps={{
                  id: 'user-autocomplete',
                  className: 'form-control input-sm typeahead tt-input',
                  placeholder: translate(
                    'Search for a user to add by Name, Username, or Email',
                  ),
                }}
                wrapperStyle={{ marginBottom: '1rem' }}
                getItemValue={item => item.username}
                items={getAvailableUsers(users, currentMembers, addedMembers)}
                shouldItemRender={(user, value) =>
                  user.username.toLowerCase().includes(value.toLowerCase())
                }
                renderItem={(item, isHighlighted) => (
                  <div
                    className="tt-suggestion tt-selectable"
                    style={{
                      background: isHighlighted ? 'lightgray' : 'white',
                    }}
                  >
                    {item.displayName}
                  </div>
                )}
                menuStyle={{
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '2px 0',
                  marginBottom: '1rem',
                  fontSize: '90%',
                  position: 'inherit',
                  overflow: 'auto',
                  maxHeight: '50%',
                }}
                value={typeAheadValue}
                onChange={e => handleFieldChange(e.target.value)}
                onSelect={(username, fullUser) => {
                  handleAddMemberTemp(fullUser);
                  handleFieldChange('');
                }}
              />
            )}
          />
        </form>

        {addedMembers.length > 0 && (
          <table className="table">
            <tbody>
              {addedMembers.map(member => (
                <tr key={member.username}>
                  <td scope="row">
                    <Avatar size={30} user={member} />
                  </td>
                  <td>{member.displayName || member.username}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveMemberTemp(member)}
                      className="btn btn-danger pull-right"
                    >
                      <span className="fa fa-times fa-fw" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        disabled={addedMembers.length === 0}
        onClick={handleSubmit}
      >
        <I18n>Add Members</I18n>
      </button>
    </ModalFooter>
  </Modal>
);

export const mapStateToProps = state => ({
  isOpen: state.team.isAddMemberModalOpen,
  users: state.team.users,
  currentMembers: selectTeamMemberships(state).map(member => member.user),
  team: selectTeam(state),
});

export const mapDispatchToProps = {
  updateTeam: actions.updateTeam,
  setModalOpen: actions.setAddMemberModalOpen,
  fetchUsers: actions.fetchUsers,
};

export const AddMemberModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  lifecycle({
    /*
     * Do this so that navigating away from the parent page (causing an unmount)
     * resets the is modal open value.  This ensures that the modal is not open
     * after navigating away and then hitting the 'back' button.
     */
    componentWillMount() {
      this.props.fetchUsers();
    },
    componentWillUnmount() {
      this.props.setModalOpen(false);
    },
  }),
  withState('typeAheadValue', 'setTypeAheadValue', ''),
  withState('addedMembers', 'setAddedMembers', []),
  withHandlers({
    handleFieldChange: ({ setTypeAheadValue }) => value => {
      setTypeAheadValue(value);
    },
    handleAddMemberTemp: ({ addedMembers, setAddedMembers }) => member => {
      setAddedMembers(addedMembers.concat(member));
    },
    handleRemoveMemberTemp: ({ addedMembers, setAddedMembers }) => member => {
      const modifiedMembers = List(addedMembers).delete(
        addedMembers.indexOf(member),
      );
      setAddedMembers(modifiedMembers.toJS());
    },
    handleSubmit: ({ addedMembers, updateTeam, setModalOpen, team }) => () => {
      const newMemberships = addedMembers.map(member => ({ user: member }));
      const updatedTeam = {
        ...team,
        memberships: team.memberships.concat(newMemberships),
      };
      updateTeam(updatedTeam);
      setModalOpen(false);
    },
    handleToggle: props => event => {
      props.setTypeAheadValue('');
      props.setAddedMembers([]);
      props.setModalOpen(!props.isOpen);
    },
  }),
)(AddMemberModalComponent);
