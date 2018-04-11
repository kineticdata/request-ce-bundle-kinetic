import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Autocomplete from 'react-autocomplete';

export const defaultRenderUser = (user, isHighlighted) => (
  <div
    key={`${user.username}`}
    className={classNames('item', {
      'item-highlighted': isHighlighted,
    })}
  >
    {user.displayName}
  </div>
);

export const defaultGetUserValue = item => item.displayName;

export const defaultShouldUserRender = (user, value) =>
  user.displayName.toUpperCase().includes(value.toUpperCase()) ||
  user.username.toUpperCase().includes(value.toUpperCase());

export const UsersDropdownComponent = ({
  users,
  shouldUserRender,
  renderUser,
  getUserValue,
  handleSelect,
  handleChange,
  lookup,
}) => (
  <Autocomplete
    shouldItemRender={
      shouldUserRender ? shouldUserRender : defaultShouldUserRender
    }
    renderItem={renderUser ? renderUser : defaultRenderUser}
    value={lookup}
    items={users}
    getItemValue={getUserValue ? getUserValue : defaultGetUserValue}
    onChange={handleChange}
    onSelect={handleSelect}
  />
);

const handleChange = ({ setLookup, onChange }) => e => {
  setLookup(e.target.value);
  if (typeof onChange === 'function') {
    onChange(e);
  }
};

const handleSelect = ({ setLookup, onSelect }) => user => {
  setLookup(user);
  if (typeof onSelect === 'function') {
    onSelect(user);
  }
};

export const UsersDropdown = compose(
  withState('lookup', 'setLookup', ''),
  withHandlers({
    handleChange,
    handleSelect,
  }),
)(UsersDropdownComponent);

UsersDropdown.propTypes = {
  users: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  renderUser: PropTypes.func,
  shouldUserRender: PropTypes.func,
  getUserValue: PropTypes.func,
};
