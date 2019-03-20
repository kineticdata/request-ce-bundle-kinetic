import React from 'react';
import ReactDOM from 'react-dom';
import renderIntoDom from '../../../src/helpers/renderIntoDom';
import {
  validateNotificationOptions,
  processNotificationExits,
} from './notifications';
import { Alert } from '../../../src/components/notifications/Alert';
import { Confirm } from '../../../src/components/notifications/Confirm';
import { SchedulerWidget } from '../../../src/components/scheduler/SchedulerWidget';
import { PeopleSelect } from '../../../src/components/attribute_selectors/PeopleSelect';

// Ensure the bundle global object exists
const bundle = typeof window.bundle !== 'undefined' ? window.bundle : {};
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
  const opts = validateNotificationOptions(
    {
      color: 'danger',
      message: 'Error',
      style: {},
      closable: true,
      ...options,
    },
    'bundle.helpers.alert',
  );
  // If method returns true, no need to create new notification
  if (processNotificationExits(opts)) {
    return;
  }
  // Create wrapper div to insert into DOM
  const div = document.createElement('div');
  div.classList.add('notification-wrapper');
  // Insert the wrapper div into the DOM
  opts.anchor.parentElement.insertBefore(div, opts.anchor);
  // Initialize the Alert component
  renderIntoDom(
    <Alert
      {...opts}
      domWrapper={div}
      handleClose={() => ReactDOM.unmountComponentAtNode(div)}
    />,
    div,
  );
  // Add exitEvents to the element
  if (
    opts.exitEvents &&
    typeof opts.exitEvents === 'string' &&
    typeof alert.closeAlert === 'function'
  ) {
    opts.element.addEventListener(
      opts.exitEvents,
      e => {
        ReactDOM.unmountComponentAtNode(div);
      },
      { once: true },
    );
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
  const opts = validateNotificationOptions(
    {
      color: 'danger',
      message: 'Error',
      acceptButtonText: 'OK',
      rejectButtonText: 'Cancel',
      style: {},
      disable: true,
      ...options,
      onClose:
        options.disable === false
          ? options.onClose
          : (element, notification) => {
              element.disabled = false;
              if (typeof options.onClose === 'function') {
                options.onClose(element, notification);
              }
            },
    },
    'bundle.helpers.confirm',
  );
  // If method returns true, no need to create new notification
  if (processNotificationExits(opts)) {
    return;
  }
  // Create wrapper div to insert into DOM
  const div = document.createElement('div');
  div.classList.add('notification-wrapper');
  // Insert the wrapper div into the DOM
  opts.anchor.parentElement.insertBefore(div, opts.anchor);
  // Initialize the Confirm component
  renderIntoDom(
    <Confirm
      {...opts}
      domWrapper={div}
      handleClose={() => ReactDOM.unmountComponentAtNode(div)}
    />,
    div,
  );
  // Disable element if disable option is true
  if (opts.disable) {
    opts.element.disabled = true;
  }
};

/**
 * Displays the sheduler widget to allow users to shcedule a time.
 *
 * @param div       DOM element *required*
 *    The element into which the scheduler should be inserted.
 * @param props     {
 *    showSchedulerSelector   boolean [Default: false]
 *    schedulerId             string *required if showSchedulerSelector != true*
 *    showTypeSelector        boolean [Default: false]
 *    eventType               string *required if showTypeSelector != true*
 *    scheduledEventId        string
 *    eventUpdated            string
 *    canReschedule           boolean [Default: false]
 *    canCancel               boolean [Default: false]
 *    performSubmit           function action.continue function from submit event
 *  }
 * @param form      Kinetic form object *required*
 * @param fieldMap  Map *required*
 *    A map of scheduled event values to form fields that should be updated on
 *    event creation, update, or delete.
 *    Available values:
 *      scheduledEventId *required*
 *      eventDate
 *      eventTime
 *      duration
 */
bundle.helpers.schedulerWidget = (div, props = {}, form, fieldMap = {}) => {
  /*
    TODO
    - Make showSchedulerSelector and showTypeSelector work in widget and update
    corresponding fields with fieldMap
  */
  if (
    (!props.showSchedulerSelector && !props.schedulerId) ||
    (!props.showTypeSelector && !props.eventType)
  ) {
    ReactDOM.unmountComponentAtNode(div);
  } else {
    if (typeof props.performSubmit === 'function') {
      if (Object.keys(form.validate()).length > 0) {
        props.performSubmit();
        return;
      }
    }
    renderIntoDom(
      <SchedulerWidget
        {...props}
        appointmentRequestId={form.submission().id()}
        rescheduleDataMap={fieldMap}
        eventUpdated={event => {
          if (
            fieldMap.scheduledEventId &&
            form.getFieldByName(fieldMap.scheduledEventId)
          ) {
            form.getFieldByName(fieldMap.scheduledEventId).value(event.id);
          }
          if (fieldMap.eventDate && form.getFieldByName(fieldMap.eventDate)) {
            form.getFieldByName(fieldMap.eventDate).value(event.values['Date']);
          }
          if (fieldMap.eventTime && form.getFieldByName(fieldMap.eventTime)) {
            form.getFieldByName(fieldMap.eventTime).value(event.values['Time']);
          }
          if (fieldMap.duration && form.getFieldByName(fieldMap.duration)) {
            form
              .getFieldByName(fieldMap.duration)
              .value(event.values['Duration']);
          }
        }}
        eventDeleted={() => {
          if (
            fieldMap.scheduledEventId &&
            form.getFieldByName(fieldMap.scheduledEventId)
          ) {
            form.getFieldByName(fieldMap.scheduledEventId).value('');
          }
          if (fieldMap.eventDate && form.getFieldByName(fieldMap.eventDate)) {
            form.getFieldByName(fieldMap.eventDate).value('');
          }
          if (fieldMap.eventTime && form.getFieldByName(fieldMap.eventTime)) {
            form.getFieldByName(fieldMap.eventTime).value('');
          }
          if (fieldMap.duration && form.getFieldByName(fieldMap.duration)) {
            form.getFieldByName(fieldMap.duration).value('');
          }
        }}
      />,
      div,
    );
  }
};

/**
 * Renders a PeopleSelect into the given container.
 *
 * @param options {
 *    container:        DOM Element *required*
 *        Element into which the PeopleSelect should be rendered.
 *
 *    multiple:         boolean [Default: true]
 *        If true, PeopleSelect will allow multiple users to be sleected.
 *
 *    onChange:         Function *required*
 *        Function that is called when the value of the PeopleSelect changes.
 *        Passed a user object if multiple=false.
 *        Passed a list of user objects if multiple=true.
 * }
 */
bundle.helpers.peopleSelect = ({
  container,
  multiple = false,
  onChange,
  ...props
} = {}) => {
  if (container) {
    renderIntoDom(
      <PeopleSelect
        multiple={multiple}
        users={true}
        valueMapper={value => value.user}
        onChange={
          typeof onChange === 'function'
            ? e => onChange(multiple ? e.target.value : e.target.value[0])
            : undefined
        }
        props={props || {}}
      />,
      container,
    );
  } else {
    console.warn(
      'bundle.helpers.peopleSelect must pass container as an option',
    );
  }
};
/**
 * Removes the people select from a given container.
 *
 * @param container:        DOM Element *required*
 *    Element from which the PeopleSelect should be removed.
 */
bundle.helpers.peopleSelect.remove = container =>
  ReactDOM.unmountComponentAtNode(container);
