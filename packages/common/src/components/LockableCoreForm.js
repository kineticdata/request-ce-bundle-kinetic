import React, { Component, Fragment } from 'react';
import { CoreForm } from '@kineticdata/react';
import { I18n, Moment } from '@kineticdata/react';
import moment from 'moment';
import {
  Countdown,
  PromiseButton,
  addToast,
  addToastAlert,
  removeToastAlert,
} from 'common';

export const LockableCoreForm = props => (
  <CoreForm
    {...props}
    lock={true}
    layoutComponent={CoreFormLayout}
    lockMessageComponent={LockMessage}
  />
);

export const CoreFormLayout = ({ form, submission, content, lockMessage }) => (
  <Fragment>
    {lockMessage}
    {content}
  </Fragment>
);

export class LockMessage extends Component {
  constructor(props) {
    super(props);
    this.toastAlertId = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.lock) {
      if (
        this.props.lock.isExpiring &&
        (!prevProps.lock || !prevProps.lock.isExpiring)
      ) {
        this.toastAlertId = addToastAlert({
          severity: 'warning',
          message: (
            <Fragment>
              Your lock will expire in{' '}
              <Countdown
                date={moment().add(this.props.lock.timeLeft, 'ms')}
                onComplete={this.props.actions.refreshSubmission}
              />.
            </Fragment>
          ),
          actions: [
            { label: 'Renew Lock', onClick: this.props.actions.obtainLock },
          ],
        }).payload.id;
      } else if (
        this.props.lock.lockLost &&
        (!prevProps.lock || !prevProps.lock.lockLost)
      ) {
        this.toastAlertId = addToastAlert({
          message: 'Your lock has expired.',
        }).payload.id;
      } else if (
        this.props.lock.isLocked &&
        (!prevProps.lock || !prevProps.lock.isLocked)
      ) {
        removeToastAlert(this.toastAlertId);
      }

      // Toast if lock obtained
      if (
        this.props.lock.isLockedByMe &&
        (!prevProps.lock || !prevProps.lock.isLockedByMe)
      ) {
        addToast({
          message: 'You have successfully locked this submission.',
        });
      }

      // Toast error if lock error occurs
      if (
        this.props.lock.lockError &&
        (!prevProps.lock ||
          this.props.lock.lockError !== prevProps.lock.lockError)
      ) {
        addToast({
          severity: 'danger',
          message: this.props.lock.lockError.message,
        });
      }
    }
  }

  componentWillUnmount() {
    removeToastAlert(this.toastAlertId);
  }

  render() {
    const { lock, actions = {} } = this.props;
    return lock ? (
      !lock.isLocked ? (
        // Not locked
        <div className="alert alert-info">
          <span>
            <I18n>This submission unlocked.</I18n>
          </span>
          <PromiseButton className="btn btn-link" onClick={actions.obtainLock}>
            Obtain Lock
          </PromiseButton>
          <PromiseButton
            className="btn btn-link"
            onClick={actions.refreshSubmission}
          >
            Refresh
          </PromiseButton>
        </div>
      ) : !lock.isLockedByMe ? (
        // Locked by someone else
        <div className="alert alert-warning">
          <span>
            <span className="fa fa-lock fw-fw mr-1" />
            <I18n>This submission is locked by</I18n> {lock.lockedBy}{' '}
            <I18n>until</I18n>{' '}
            <Moment
              timestamp={moment().add(lock.timeLeft, 'ms')}
              format={Moment.formats.timeWithSeconds}
            />
            .
          </span>
          <PromiseButton
            className="btn btn-link"
            onClick={actions.refreshSubmission}
          >
            Refresh
          </PromiseButton>
        </div>
      ) : null
    ) : null;
  }
}
