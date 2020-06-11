import React, { Component, Fragment } from 'react';
import { I18n } from '@kineticdata/react';

const DefaultToggleButton = props => (
  <I18n
    render={translate => (
      <button
        className="btn btn-sm btn-primary"
        title={translate('Filter')}
        {...props}
      >
        <span className="fa fa fa-window-maximize fa-fw" />
      </button>
    )}
  />
);

export class ModalButton extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.onOpen =
      typeof this.props.onClose === 'function' ? this.props.onOpen : undefined;
    this.onClose =
      typeof this.props.onClose === 'function' ? this.props.onClose : undefined;
  }

  open = e => {
    this.onOpen && this.onOpen(e);
    this.setState({ open: true });
  };

  forceOpen = () => {
    this.setState({ open: true });
  };

  close = e => {
    this.onClose && this.onClose(e);
    this.setState({ open: false });
  };

  forceClose = () => {
    this.setState({ open: false });
  };

  toggle = e => {
    this.state.open ? this.close(e) : this.open(e);
  };

  forceToggle = () => {
    this.state.open ? this.forceClose() : this.forceOpen();
  };

  render() {
    const { components = {}, children } = this.props;
    const { ToggleButton = DefaultToggleButton } = components;

    if (typeof children === 'function') {
      return (
        <Fragment>
          <ToggleButton type="button" onClick={this.toggle} />
          {children({
            isOpen: this.state.open,
            open: this.open,
            close: this.close,
            toggle: this.toggle,
            forceOpen: this.forceOpen,
            forceClose: this.forceClose,
            forceToggle: this.forceToggle,
          })}
        </Fragment>
      );
    } else {
      console.error(
        'ModalButton Error: The children prop is required and must be a function.',
      );
      return null;
    }
  }
}
