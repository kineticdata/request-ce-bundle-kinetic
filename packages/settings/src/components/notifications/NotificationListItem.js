import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { actions } from '../../redux/modules/settingsNotifications';
import { context } from '../../redux/store';

import { I18n } from '@kineticdata/react';

const NotificationListItemComponent = ({
  notification,
  type,
  path,
  handleClone,
  handleDelete,
  handlePreview,
  openDropdown,
  toggleDropdown,
}) => {
  return (
    <tr>
      <td scope="row">
        <Link to={path}>{notification.values['Name']}</Link>
      </td>
      <td>{notification.values['Status']}</td>
      <td className="hidden-md-down">
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
            <DropdownItem onClick={handlePreview(notification)}>
              <I18n>Preview</I18n>
            </DropdownItem>
            <DropdownItem onClick={handleClone(notification.id)}>
              <I18n>Clone</I18n>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem
              onClick={handleDelete(notification.id)}
              className="text-danger"
            >
              <I18n>Delete</I18n>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </td>
    </tr>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsNotifications.loading,
  snippets: state.settingsNotifications.notificationSnippets.reduce(
    (obj, item) => {
      obj[item.label] = item;
      return obj;
    },
    {},
  ),
  space: state.app.space,
});

export const mapDispatchToProps = {
  cloneNotification: actions.cloneNotification,
  deleteNotification: actions.deleteNotification,
  fetchNotifications: actions.fetchNotifications,
  fetchDateFormats: actions.fetchDateFormats,
  fetchNotification: actions.fetchNotification,
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

const handlePreview = props => notification => () => {
  let values = notification.values;

  values['HTML Content'] = values['HTML Content'].replace(
    /\$\{snippet\(\'.*?\'\)\}/gi,
    snippet => {
      const label = snippet.match(/\$\{snippet\(\'(.*?)\'\)\}/);
      return props.snippets[label[1]].values['HTML Content'];
    },
  );

  props.setPreviewModal({ ...notification, values });
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const NotificationListItem = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withState('modalIsOpen', 'setModalVisible', true),
  withHandlers({
    toggleDropdown,
    handleClone,
    handleDelete,
    handlePreview,
  }),
)(NotificationListItemComponent);
