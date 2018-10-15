import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
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
  <Alert color={color} style={style}>
    <div dangerouslySetInnerHTML={{ __html: message }} />
    <hr />
    <div>
      <Button color="success" onClick={handleAccept}>
        {acceptButtonText}
      </Button>
      <Button color="link" onClick={handleReject}>
        {rejectButtonText}
      </Button>
    </div>
  </Alert>
);

export const Confirm = compose(
  withHandlers({
    handleAccept: ({ onAccept, element, domWrapper, handleClose }) => () => {
      // If accepted and onAccept prop is provided and is a function, call it
      if (typeof onAccept === 'function') {
        onAccept(element, domWrapper);
      }
      // Close the confirm
      handleClose();
    },
    handleReject: ({ onReject, element, domWrapper, handleClose }) => () => {
      // If Rejected and onReject prop is provided and is a function, call it
      if (typeof onReject === 'function') {
        onReject(element, domWrapper);
      }
      // Close the confirm
      handleClose();
    },
  }),
  lifecycle({
    componentWillMount() {
      // If handleClose prop is not a function, throw error
      if (typeof this.props.handleClose !== 'function') {
        throw new Error(
          "Invalid prop 'handleClose' supplied to the 'Confirm' component. It is required and must be a function.",
        );
      }
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
