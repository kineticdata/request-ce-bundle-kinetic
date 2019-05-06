import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import { PageTitle } from 'common';
import { CoreForm } from '@kineticdata/react';
import { ErrorUnauthorized } from '../ErrorUnauthorized';
import { SCHEDULER_FORM_SLUG } from '../../redux/modules/schedulers';
import { actions as toastActions } from '../../redux/modules/toasts';
import { selectHasRoleSchedulerAdmin } from '../../redux/selectors';
import { I18n } from '@kineticdata/react';

const globals = import('common/globals');

export const handleCreated = props => response => {
  props.push(props.match.url.replace(/new$/, response.submission.id));
  props.addSuccess(
    `Successfully created scheduler (${response.submission.values['Name']})`,
    'Scheduler Created!',
  );
};
export const handleError = props => response => {
  props.addError(response.error, 'Error');
};

const CreateSchedulerComponent = ({
  pathPrefix = '',
  breadcrumbs = [],
  handleCreated,
  handleError,
  isSchedulerAdmin,
  type,
}) =>
  isSchedulerAdmin ? (
    <div className="page-container page-container--scheduler">
      <PageTitle parts={['Create Scheduler', 'Schedulers', 'Settings']} />
      <div className="page-panel page-panel--scrollable page-panel--scheduler-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              {breadcrumbs.map(breadcrumb => (
                <Fragment key={breadcrumb.label}>
                  <Link to={breadcrumb.path}>
                    <I18n>{breadcrumb.label}</I18n>
                  </Link>{' '}
                  /{` `}
                </Fragment>
              ))}
            </h3>
            <h1>
              <I18n>Create Scheduler</I18n>
            </h1>
          </div>
          <Link to={pathPrefix} className="btn btn-secondary">
            <I18n>Cancel Create</I18n>
          </Link>
        </div>
        <div className="content-wrapper">
          <I18n context={`datastore.forms.${SCHEDULER_FORM_SLUG}`}>
            <CoreForm
              datastore
              form={SCHEDULER_FORM_SLUG}
              values={{ Type: type || '' }}
              created={handleCreated}
              error={handleError}
              globals={globals}
            />
          </I18n>
        </div>
      </div>
    </div>
  ) : (
    <ErrorUnauthorized />
  );

export const mapStateToProps = (state, props) => ({
  addSuccess: toastActions.addSuccess,
  addError: toastActions.addError,
  isSchedulerAdmin: selectHasRoleSchedulerAdmin(props.profile),
});

export const mapDispatchToProps = {
  push,
};

export const CreateScheduler = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleCreated,
    handleError,
  }),
)(CreateSchedulerComponent);
