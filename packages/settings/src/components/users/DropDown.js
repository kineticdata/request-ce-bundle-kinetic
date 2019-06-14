import React from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
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
  (user.displayName &&
    user.displayName.toUpperCase().includes(value.toUpperCase())) ||
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
  <div className="select-combobox">
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
  </div>
);

const handleChange = ({ setLookup, onChange }) => e => {
  setLookup(e.target.value);
  if (typeof onChange === 'function') {
    onChange(e);
  }
};

const handleSelect = ({ setLookup, onSelect }) => (user, item) => {
  setLookup(user);
  if (typeof onSelect === 'function') {
    onSelect(item);
  }
};

export const UsersDropdown = compose(
  withState('lookup', 'setLookup', props => {
    return props.initialValue && typeof props.initialValue === 'string'
      ? props.initialValue
      : '';
  }),
  withHandlers({
    handleChange,
    handleSelect,
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.initialValue !== nextProps.initialValue) {
        nextProps.setLookup(nextProps.initialValue);
      }
    },
  }),
)(UsersDropdownComponent);

UsersDropdown.propTypes = {
  users: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  renderUser: PropTypes.func,
  shouldUserRender: PropTypes.func,
  getUserValue: PropTypes.func,
};
