import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { actions } from '../../../redux/modules/settingsNotifications';

const NotificationListItemComponent = ({
  notification,
  handleClone,
  handleDelete,
  openDropdown,
  toggleDropdown,
}) => {
  return (
    <tr>
      <Fragment>
        <td className="d-md-none d-table-cell">
          <div className="card">
            <div className="card-body">
              <strong className="card-title">{notification.values['Name']}</strong>
              <p className="card-text">
                <span>
                  <strong>Status:</strong> {notification.values['Status']}
                </span>
                <br />
                <span>
                  <strong>Subject:</strong> {notification.values['Subject']}
                </span>
                <br />
              </p>
              <div className="btn-group" role="group" aria-label="Actions">
                <Link
                  to={`/settings/notifications/${notification.id}`}
                  className="btn btn-primary"
                >
                  View
                </Link>
                <Link
                  to={`/settings/notifications/${notification.id}/edit`}
                  className="btn btn-info"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleClone(notification.id)}
                  className="btn btn-success"
                >
                  Clone
                </button>
                <button
                  type="button"
                  onClick={handleDelete(notification.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </td>
        <td className="d-none d-md-table-cell">
          <Link to={`/settings/notifications/${notification.id}`}>
            {notification.values['Name']}
          </Link>
        </td>
      </Fragment>
      <td className="d-none d-md-table-cell">{notification.values['Status']}</td>
      <td className="d-none d-md-table-cell">{notification.values['Subject']}</td>
      <td className="d-none d-md-table-cell">
        <Dropdown
          toggle={toggleDropdown(notification.id)}
          isOpen={openDropdown === notification.id}
        >
          <DropdownToggle color="link" className="btn-sm">
            <span className="fa fa-ellipsis-h fa-2x" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag={Link} to={`/settings/notifications/${notification.id}`}>
              View
            </DropdownItem>
            <DropdownItem tag={Link} to={`/settings/notifications/${notification.id}/edit`}>
              Edit
            </DropdownItem>
            <DropdownItem onClick={handleClone(notification.id)}>
              Clone
            </DropdownItem>
            <DropdownItem onClick={handleDelete(notification.id)}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </td>
    </tr>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsNotifications.loading,
});

export const mapDispatchToProps = {
  cloneNotification: actions.cloneNotification,
  deleteNotification: actions.deleteNotification,
  fetchNotifications: actions.fetchNotifications,
};

const handleClone = ({ cloneNotification }) => id => () =>
  cloneNotification(id);

const handleDelete = ({ deleteNotification, fetchNotifications }) => id => () =>
  deleteNotification({ id: id, callback: fetchNotifications });

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const NotificationListItem = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    toggleDropdown,
    handleClone,
    handleDelete,
  }),
)(NotificationListItemComponent);
