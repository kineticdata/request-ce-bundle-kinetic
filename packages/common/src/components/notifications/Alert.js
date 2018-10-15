import React from 'react';
import { compose, lifecycle } from 'recompose';
import { Alert as BootstrapAlert } from 'reactstrap';

const AlertComponent = ({ color, style, message, closable, handleClose }) => (
  <BootstrapAlert
    color={color}
    style={style}
    toggle={closable ? handleClose : null}
  >
    <div dangerouslySetInnerHTML={{ __html: message }} />
  </BootstrapAlert>
);

export const Alert = compose(
  lifecycle({
    componentWillMount() {
      // If handleClose prop is not a function, throw error
      if (typeof this.props.handleClose !== 'function') {
        throw new Error(
          "Invalid prop 'handleClose' supplied to the 'Alert' component. It is required and must be a function.",
        );
      }
      // If onShow prop is provided and is a function, call it
      if (typeof this.props.onShow === 'function') {
        this.props.onShow(this.props.element, this.props.domWrapper);
      }
      // If expire prop is provided and is an integer, and the alert is
      // closable, set timeout to close alert after {expire} seconds
      if (
        parseInt(this.props.expire, 10) &&
        typeof this.props.closeAlert === 'function'
      ) {
        (closeAlert =>
          setTimeout(function() {
            closeAlert();
          }, parseInt(this.props.expire, 10) * 1000))(this.props.closeAlert);
      }
    },
    componentWillUnmount() {
      // If onClose prop is provided and is a function, call it
      if (typeof this.props.onClose === 'function') {
        this.props.onClose(this.props.element, this.props.domWrapper);
      }
      // If domWrapper is provided and exists in the document dom, remove it
      if (document.body.contains(this.props.domWrapper)) {
        this.props.domWrapper.remove();
      }
    },
  }),
)(AlertComponent);
