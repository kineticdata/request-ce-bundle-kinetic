import React from 'react';
import ReactDOM from 'react-dom';
import {
  validateNotificationOptions,
  processNotificationExits,
} from './notifications';
import { Alert } from '../../../src/components/Notifications/Alert';
import { Confirm } from '../../../src/components/Notifications/Confirm';

// Ensure the bundle global object exists
const bundle = typeof window.bundle !== "undefined" ? window.bundle : {};
// Create helpers namespace
bundle.helpers = bundle.helpers || {};

/**
 * Displays an alert to the user.
 *
 * @param options {
 *    element:        DOM Element *required*
 *        Element which triggers the display of the alert.
 *
 *    anchor:         DOM Element|string [Defaults to the element option]
 *        Element or string selector of element's ancesotor. The notification
 *        will be inserted above the anchor.
 *
 *    color:          string [Default: 'danger']
 *        Defines the color of the alert as defined by Bootstrap.
 *
 *    message:        string [Default: 'Error']
 *        The message to display inside the alert.
 *
 *    style:          object [Default: {}]
 *        Object containing inline styles to be added to the notification.
 *
 *    onShow:         function(element, notification)
 *        Function that fires when the notification is shown.
 *
 *    onClose:        function(element, notification)
 *        Function that fires when the notification is closed.
 *
 *    closable:       boolean [Default: true]
 *        If true, shows close icon in top right corner.
 *
 *    exitEvents:     string (Example: 'click' or 'focus' or 'click focus')
 *        Events to be added to the element that will close the notification.
 *
 *    toggle:         boolean [Default: false]
 *        If true and if notification already exists for this anchor, it will be
 *        closed and a new one will not be opened.
 *
 *    allowMultiple:  boolean [Default: false]
 *        If true, will allow multiple notifications to be opened for the same
 *        anchor.
 *
 *    expire:         number
 *        If provided, the notification will automatically close after the
 *        given number of seconds. The closable option must be true.
 *
 *    exit:           boolean|'all'
 *        If exit evaluates to a truthy value, existing notifications will be
 *        closed instead of a new one being created. If set to 'all', all
 *        notifications that are descendants of the anchor will be closed, in
 *        addition to the anchors notifications. If set to any other truthy
 *        value, only the anchors notifications will be closed.
 * }
 */
bundle.helpers.alert = (options = {}) => {
  // Combine passed in options with the defaults and validate
  const opts = validateNotificationOptions({
    color: 'danger',
    message: 'Error',
    style: {},
    closable: true,
    ...options,
  }, 'bundle.helpers.alert');
  // If method returns true, no need to create new notification
  if (processNotificationExits(opts)) { return; }
  // Create wrapper div to insert into DOM
  const div = document.createElement('div');
  div.classList.add("notification-wrapper");
  // Insert the wrapper div into the DOM
  opts.anchor.parentElement.insertBefore(div, opts.anchor);
  // Initialize the Alert component
  ReactDOM.render(<Alert
    {...opts}
    domWrapper={div}
    handleClose={() => ReactDOM.unmountComponentAtNode(div)}
  />, div);
  // Add exitEvents to the element
  if (opts.exitEvents && typeof opts.exitEvents === 'string' && typeof alert.closeAlert === 'function') {
    opts.element.addEventListener(opts.exitEvents, e => {
      ReactDOM.unmountComponentAtNode(div);
    }, { once: true });
  }
};

/**
 * Displays a confirm message to the user.
 *
 * @param options {
 *    element:          DOM Element *required*
 *        Element which triggers the display of the alert.
 *
 *    anchor:           DOM Element|string [Defaults to the element option]
 *        Element or string selector of element's ancesotor. The notification
 *        will be inserted above the anchor.
 *
 *    color:            string [Default: 'danger']
 *        Defines the color of the alert as defined by Bootstrap.
 *
 *    message:          string [Default: 'Error']
 *        The message to display inside the alert.
 *
 *    acceptButtonText: string [Default: 'OK']
 *        The text shown in the accept button.
 *
 *    rejectButtonText: string [Default: 'Cancel']
 *        The text shown in the reject button.
 *
 *    style:            object [Default: {}]
 *        Object containing inline styles to be added to the notification.
 *
 *    onShow:           function(element, notification)
 *        Function that fires when the notification is shown.
 *
 *    onAccept:         function(element, notification)
 *        Function that fires when the confirm is accepted.
 *
 *    onReject:         function(element, notification)
 *        Function that fires when the confirm is rejected.
 *
 *    onClose:          function(element, notification)
 *        Function that fires when the notification is closed.
 *
 *    disable:          boolean [Default: true]
 *        If true, disables the element while the notification is open.
 *
 *    toggle:           boolean [Default: false]
 *        If true and if notification already exists for this anchor, it will be
 *        closed and a new one will not be opened.
 *
 *    allowMultiple:    boolean [Default: false]
 *        If true, will allow multiple notifications to be opened for the same
 *        anchor.
 *
 *    exit:             boolean|'all'
 *        If exit evaluates to a truthy value, existing notifications will be
 *        closed instead of a new one being created. If set to 'all', all
 *        notifications that are descendants of the anchor will be closed, in
 *        addition to the anchors notifications. If set to any other truthy
 *        value, only the anchors notifications will be closed.
 * }
 */
bundle.helpers.confirm = (options = {}) => {
  // Combine passed in options with the defaults and validate
  const opts = validateNotificationOptions({
    color: 'danger',
    message: 'Error',
    acceptButtonText: 'OK',
    rejectButtonText: 'Cancel',
    style: {},
    disable: true,
    ...options,
    onClose: options.disable === false
      ? options.onClose
      : (element, notification) => {
        element.disabled = false;
        if (typeof options.onClose === 'function') {
          options.onClose(element, notification);
        }
      },
  }, 'bundle.helpers.confirm');
  // If method returns true, no need to create new notification
  if (processNotificationExits(opts)) { return; }
  // Create wrapper div to insert into DOM
  const div = document.createElement('div');
  div.classList.add("notification-wrapper");
  // Insert the wrapper div into the DOM
  opts.anchor.parentElement.insertBefore(div, opts.anchor);
  // Initialize the Confirm component
  ReactDOM.render(<Confirm
    {...opts}
    domWrapper={div}
    handleClose={() => ReactDOM.unmountComponentAtNode(div)}
  />, div);
  // Disable element if disable option is true
  if (opts.disable) { opts.element.disabled = true; }
};
