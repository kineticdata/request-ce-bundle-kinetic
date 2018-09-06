import React from 'react';
import ReactDOM from 'react-dom';
import { compose, lifecycle, withProps } from 'recompose';
import { Alert as BootstrapAlert } from 'reactstrap';

const AlertComponent = ({
  color,
  style,
  message,
  closeAlert,
}) => (
  <BootstrapAlert
    color={color}
    style={style}
    toggle={closeAlert}
  >
    <div dangerouslySetInnerHTML={{__html: message}}></div>
  </BootstrapAlert>
);

export const Alert = compose(
  // Add closeAlert prop with correct function to call, or null if not closable
  withProps(({ closable, handleClose, domWrapper}) => {
    if (closable) {
      // Verify that alert is closable
      if (typeof handleClose === 'function') {
        // If handleClose function is passed as a prop, use it to close alert
        return { closeAlert: handleClose };
      } else if (document.body.contains(domWrapper)) {
        // Else if domWrapper is passed as a prop, unmount its child component
        // to close the alert
        return { closeAlert: () => ReactDOM.unmountComponentAtNode(domWrapper) };
      } else {
        // Otherwise, show warning in console that alert cannot be closed
        console.warn("Alert component is not closable because it did not provide a handleClose prop.");
      }
    }
    return {};
  }),
  lifecycle({
    componentWillMount() {
      // If onShow prop is provided and is a function, call it
      if (typeof this.props.onShow === 'function') {
        this.props.onShow(this.props.element, this.props.domWrapper);
      }
      // If expire prop is provided and is an integer, and the alert is
      // closable, set timeout to close alert after {expire} seconds
      if (parseInt(this.props.expire, 10) && typeof this.props.closeAlert === 'function') {
        (closeAlert => setTimeout(function() {
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
