import React, { Component } from 'react';
import t from 'prop-types';

export class PromiseButton extends Component {
  constructor(props) {
    super(props);
    this.state = { pending: false };
    this._controlled = typeof props.pending === 'boolean';
  }

  componentDidMount() {
    if (this._controlled) {
      this.setState({ pending: this.props.pending });
    }
  }
  componentDidUpdate(prevProps) {
    if (this._controlled && this.props.pending !== prevProps.pending) {
      this.setState({ pending: this.props.pending });
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  handleClick = e => {
    if (typeof this.props.onClick === 'function') {
      !this._unmounted && this.setState({ pending: true });
      const promise = this.props.onClick(e);
      if (promise && typeof promise.finally === 'function') {
        promise.finally(() => {
          !this._unmounted && this.setState({ pending: false });
        });
      } else {
        !this._unmounted && this.setState({ pending: false });
      }
    }
  };

  render() {
    const { children, onClick, disabled, pending, ...props } = this.props;
    return (
      <button
        {...props}
        onClick={this._controlled ? onClick : this.handleClick}
        disabled={disabled || this.state.pending}
      >
        {typeof children === 'function'
          ? children({ pending: this.state.pending })
          : children}
      </button>
    );
  }
}

PromiseButton.propTypes = {
  // Function that will be called on click and should return a Promise
  onClick: t.func,
  // If set, will use this value for disabling the button instead of the Promise
  pending: t.bool,
};
