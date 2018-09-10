import ReactDOM from 'react-dom';
import isarray from 'isarray';

/**
 * Validates that the options for displaying a notification are valid.
 * @param opts  Options object
 * @return      Updated options object
 */
export const validateNotificationOptions = (opts, fnName) => {
  // If element option is an array, use first value
  if (isarray(opts.element)) { opts.element = opts.element[0]; }
  // Make sure element option is an actual DOM Element object
  if (!opts.element || !(opts.element instanceof Element)) {
    throw new Error(`${fnName} failed, element is required and must be a DOM Element`);
  }

  // If anchor option is an array, use the first value
  if (isarray(opts.anchor)) { opts.anchor = opts.anchor[0]; }
  // If anchor option is a string, use as argument to find closest Element
  if (opts.anchor && typeof opts.anchor === 'string') {
    opts.anchor = opts.element.closest(opts.anchor);
    if (!opts.anchor) {
      console.warn(`${fnName} could not find the anchor DOM Element and is using the element instead`);
    }
  }
  // If no anchor option provided or it couldn't be found, set to be the element
  if (!opts.anchor || !(opts.anchor instanceof Element)) {
    opts.anchor = opts.element;
  }

  return opts;
}

/**
 * Handles the exit parameter for notifications and closes any existing
 * notification at the anchor level if applicable.
 * @param opts  Options object
 * @returns     Boolean; true if only exit was required and notifications does
 *              not need to be shown, otherwise false
 */
export const processNotificationExits = opts => {
  // Define function to close notifications on this anchor
  const close = () => {
    let prev;
    while ((prev = opts.anchor.previousElementSibling)
      && prev.matches('div.notification-wrapper'))
    {
      ReactDOM.unmountComponentAtNode(prev)
    }
  }

  // If exit option is set to 'all', remove all notifications in descendants
  if (opts.exit === 'all') {
    opts.anchor.querySelectorAll('div.notification-wrapper')
      .forEach(element => ReactDOM.unmountComponentAtNode(element));
  }
  // If exit option is truthy, close existing notifications and return
  if (opts.exit) {
    close();
    return true;
  }
  // If toggle option is true and notification exists, close it and return
  if (opts.toggle && opts.anchor.previousElementSibling
    && opts.anchor.previousElementSibling.matches('div.notification-wrapper'))
  {
    close();
    return true;
  }
  // If allowMultiple option is not true, close existing notifications
  if (!opts.allowMultiple) {
    close();
  }

  return false;
}
