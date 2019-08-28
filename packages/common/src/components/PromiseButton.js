import React, { Component } from 'react';

export class PromiseButton extends Component {
  constructor(props) {
    super(props);
    this.state = { pending: false };
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  handleClick = e => {
    if (typeof this.props.onClick === 'function') {
      !this._unmounted && this.setState({ pending: true });
      const promise = this.props.onClick(e);
      if (typeof promise.finally === 'function') {
        promise.finally(() => {
          !this._unmounted && this.setState({ pending: false });
        });
      } else {
        !this._unmounted && this.setState({ pending: false });
      }
    }
  };

  render() {
    const { children, onClick, disabled, ...props } = this.props;
    return (
      <button
        {...props}
        onClick={this.handleClick}
        disabled={disabled || this.state.pending}
      >
        {children}
      </button>
    );
  }
}
