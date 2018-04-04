import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { UncontrolledDropdown } from 'reactstrap';

export class CardDropdown extends Component {
  render() {
    return (
      <UncontrolledDropdown
        ref={component => (this.dropdownRoot = findDOMNode(component))}
        onClick={event => {
          if (this.dropdownRoot && this.dropdownRoot.contains(event.target)) {
            event.preventDefault();
          }
        }}
      >
        {this.props.children}
      </UncontrolledDropdown>
    );
  }
}
