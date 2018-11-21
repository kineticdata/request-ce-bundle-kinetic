import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { Avatar } from 'common';
import { actions } from '../../../redux/modules/settingsUsers';

const UsersListItemComponent = ({ user, openDropdown, toggleDropdown }) => {
  return (
    <tr key={user.username}>
      <Fragment>
        <td scope="row" className="d-md-none d-table-cell">
          <div className="card">
            <div className="card-body">
              <strong className="card-title">
                <Avatar username={user.username} />
                {user.displayName}
              </strong>
              <p className="card-text">
                <span>
                  <strong>Username:</strong> {user.username}
                </span>
                <br />
                <span>
                  <strong>Email:</strong> {user.email}
                </span>
                <br />
              </p>
              <div className="btn-group" role="group" aria-label="Actions">
                <Link
                  to={`/profile/${user.username}`}
                  className="btn btn-primary"
                >
                  View
                </Link>
                <Link
                  to={`/settings/users/${user.username}/edit`}
                  className="btn btn-info"
                >
                  Edit
                </Link>
                <Link
                  to={`/settings/users/${user.username}/clone`}
                  className="btn btn-info"
                >
                  Clone
                </Link>
              </div>
            </div>
          </div>
        </td>
        <td scope="row" className="d-none d-md-table-cell">
          <Avatar username={user.username} size={18} />
        </td>
      </Fragment>
      <td>
        <Link
          className="d-none d-md-table-cell"
          to={`/settings/users/${user.username}/edit`}
        >
          {user.username}
        </Link>
      </td>
      <td className="d-none d-md-table-cell">{user.displayName}</td>
      <td className="d-none d-md-table-cell">{user.email}</td>
      <td className="d-none d-md-table-cell">
        <Dropdown
          toggle={toggleDropdown(user.username)}
          isOpen={openDropdown === user.username}
        >
          <DropdownToggle color="link" className="btn-sm">
            <span className="fa fa-ellipsis-h fa-2x" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag={Link} to={`/profile/${user.username}`}>
              View
            </DropdownItem>
            <DropdownItem
              tag={Link}
              to={`/settings/users/${user.username}/edit`}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              tag={Link}
              to={`/settings/users/${user.username}/clone`}
            >
              Clone
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </td>
    </tr>
  );
};

export const mapStateToProps = state => ({});

export const mapDispatchToProps = {
  setUser: actions.setUser,
  push,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const UsersListItem = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
)(UsersListItemComponent);
