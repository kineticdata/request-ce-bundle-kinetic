import React from 'react';
import ReactDOM from 'react-dom';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { Alert, Button } from 'reactstrap';

const ConfirmComponent = ({
  color,
  style,
  message,
  acceptButtonText,
  rejectButtonText,
  handleAccept,
  handleReject,
}) => (
  <Alert
    color={color}
    style={style}
  >
    <div dangerouslySetInnerHTML={{__html: message}}></div>
    <hr />
    <div>
      <Button
        color="success"
        onClick={handleAccept}
      >
        {acceptButtonText}
      </Button>
      <Button
        color="link"
        onClick={handleReject}
      >
        {rejectButtonText}
      </Button>
    </div>
  </Alert>
);

export const Confirm = compose(
  // Add closeConfirm prop with correct function to call in order to close the
  // notification. Throws an error is no valid close option exists.
  withProps(({ handleClose, domWrapper}) => {
    if (typeof handleClose === 'function') {
      // If handleClose function is passed as a prop, use it to close confirm
      return { closeConfirm: handleClose };
    } else if (document.body.contains(domWrapper)) {
      // Else if domWrapper is passed as a prop, unmount its child component
      // to close the confirm
      return { closeConfirm: () => ReactDOM.unmountComponentAtNode(domWrapper) };
    } else {
      // Otherwise, throw error because this component must be closable
      throw new Error("Confirm component is missing the handleClose prop.");
    }
  }),
  withHandlers({
    handleAccept: ({ onAccept, element, domWrapper, closeConfirm }) => () => {
      // If accepted and onAccept prop is provided and is a function, call it
      if (typeof onAccept === 'function') {
        onAccept(element, domWrapper);
      }
      // Close the confirm
      closeConfirm();
    },
    handleReject: ({ onReject, element, domWrapper, closeConfirm }) => () => {
      // If Rejected and onReject prop is provided and is a function, call it
      if (typeof onReject === 'function') {
        onReject(element, domWrapper);
      }
      // Close the confirm
      closeConfirm();
    },
  }),
  lifecycle({
    componentWillMount() {
      // If onShow prop is provided and is a function, call it
      if (typeof this.props.onShow === 'function') {
        this.props.onShow(this.props.element, this.props.domWrapper);
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
)(ConfirmComponent);
