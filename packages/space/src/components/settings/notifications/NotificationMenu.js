import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

export const NotificationMenuComponent = ({ handleClick }) => (
  <UncontrolledButtonDropdown>
    <DropdownToggle caret>Insert Dynamic Replacement Value</DropdownToggle>
    <DropdownMenu>
      <li className="dropdown-item dropdown-submenu">
        Submission
        <ul className="dropdown-menu">
          <DropdownItem data-value="${Handle}" onClick={handleClick}>
            Handle
          </DropdownItem>
        </ul>
      </li>
    </DropdownMenu>
  </UncontrolledButtonDropdown>
);

export const NotificationMenu = compose(
  connect(() => ({})),
  withHandlers({
    handleClick: props => event => props.onSelect(event.target.dataset.value),
  }),
  lifecycle({
    componentWillMount() {
      console.log('NotificationMenu mounting...');
    },
  }),
)(NotificationMenuComponent);
