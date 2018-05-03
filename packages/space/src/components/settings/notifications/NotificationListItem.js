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
  type,
  path,
  handleClone,
  handleDelete,
  openDropdown,
  toggleDropdown,
}) => {
  return (
    <tr>
      <td>
        <Link to={path}>{notification.values['Name']}</Link>
      </td>
      <td>{notification.values['Status']}</td>
      <td className="d-none d-md-block">
        {type === 'Date Format'
          ? notification.values['Format']
          : notification.values['Subject']}
      </td>
      <td>
        <Dropdown
          toggle={toggleDropdown(notification.id)}
          isOpen={openDropdown === notification.id}
        >
          <DropdownToggle color="link" className="btn-sm">
            <span className="fa fa-ellipsis-h fa-2x" />
          </DropdownToggle>
          <DropdownMenu right>
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
  fetchDateFormats: actions.fetchDateFormats,
};

const handleClone = ({ cloneNotification }) => id => () =>
  cloneNotification(id);

const handleDelete = props => id => () =>
  props.deleteNotification({
    id: id,
    callback:
      props.type === 'Date Format'
        ? props.fetchDateFormats
        : props.fetchNotifications,
  });

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
