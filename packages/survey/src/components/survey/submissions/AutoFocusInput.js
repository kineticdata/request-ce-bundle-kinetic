import React, { Component } from 'react';
import { Input } from 'reactstrap';

export class AutoFocusInput extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  handleRef = input => {
    if (this.props.innerRef) {
      this.props.innerRef(input);
    }

    this.input = input;
  };

  render() {
    return <Input {...this.props} innerRef={this.handleRef} />;
  }
}
