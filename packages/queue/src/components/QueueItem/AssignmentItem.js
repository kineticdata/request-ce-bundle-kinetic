import React, { Component } from 'react';

/* eslint-disable react/prefer-stateless-function */
export class AssignmentItem extends Component {
  render() {
    const { item, isHighlighted, onClick } = this.props;

    return (
      <div
        className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
        onClick={onClick}
        role="menuitem"
        tabIndex={-1}
      >
        {item.displayName}
      </div>
    );
  }
}
