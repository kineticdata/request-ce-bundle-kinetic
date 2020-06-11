import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps, withState } from 'recompose';
import { Modal, ModalBody } from 'reactstrap';

import { NotificationListItem } from './NotificationListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { PageTitle } from '../shared/PageTitle';

import { isActiveClass } from '../../utils';
import { actions } from '../../redux/modules/settingsNotifications';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

const WallyNoResultsFoundMessage = ({ type }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Notification {type}s Found</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        <I18n>Add some {type}s by hitting the new button!</I18n>
      </h6>
    </div>
  );
};

const NotificationsListComponent = ({
  submissions,
  type,
  previewModal,
  setPreviewModal,
}) => (
  <div className="page-container">
    <PageTitle parts={[`${type}s`, 'Notifications', 'Settings']} />
    <div className="page-panel page-panel--white">
      <div className="page-title">
        <div
          role="navigation"
          aria-label="breadcrumbs"
          className="page-title__breadcrumbs"
        >
          <span className="breadcrumb-item">
            <Link to="/settings">
              <I18n>settings</I18n>
            </Link>{' '}
          </span>
          <span aria-hidden="true">/ </span>
          <h1>
            <I18n>Notifications</I18n>
          </h1>
        </div>
        <Link to="new" className="btn btn-primary">
          <I18n>New {type}</I18n>
        </Link>
      </div>
      <div className="notifications-tabs">
        <ul className="nav nav-tabs">
          <li role="presentation">
            <Link
              to="/settings/notifications/templates"
              getProps={isActiveClass()}
            >
              <I18n>Templates</I18n>
            </Link>
          </li>
          <li role="presentation">
            <Link
              to="/settings/notifications/snippets"
              getProps={isActiveClass()}
            >
              <I18n>Snippets</I18n>
            </Link>
          </li>
          <li role="presentation">
            <Link
              to="/settings/notifications/date-formats"
              getProps={isActiveClass()}
            >
              <I18n>Date Formats</I18n>
            </Link>
          </li>
        </ul>
      </div>
      {submissions.length > 0 ? (
        <table className="table table-sm table-striped table--settings">
          <thead className="sortable">
            <tr>
              <th scope="col">
                <I18n>Name</I18n>
              </th>
              <th scope="col">
                <I18n>Status</I18n>
              </th>
              <th scope="col">
                {type === 'Date Format' ? (
                  <I18n>Format</I18n>
                ) : (
                  <I18n>Subject</I18n>
                )}
              </th>
              <th className="sort-disabled" />
            </tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <NotificationListItem
                key={`trow-${s.id}`}
                notification={s}
                path={s.id}
                type={type}
                previewModal={previewModal}
                setPreviewModal={setPreviewModal}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <WallyNoResultsFoundMessage type={type} />
      )}
      {previewModal && (
        <Modal isOpen={!!previewModal} toggle={() => setPreviewModal(null)}>
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                onClick={() => setPreviewModal(null)}
                type="button"
                className="btn btn-link"
              >
                <I18n>Close</I18n>
              </button>
              <span>
                <I18n>Template Preview</I18n>
              </span>
            </h4>
          </div>
          <ModalBody>
            <div
              dangerouslySetInnerHTML={{
                __html: previewModal.values['HTML Content'],
              }}
            />
          </ModalBody>
        </Modal>
      )}
    </div>
  </div>
);

export const mapStateToProps = (state, props) => ({
  loading:
    state.settingsNotifications.loading ||
    state.settingsNotifications.dateFormatsLoading,
  templates: state.settingsNotifications.notificationTemplates,
  snippets: state.settingsNotifications.notificationSnippets,
  dateFormats: state.settingsNotifications.dateFormats,
});

export const mapDispatchToProps = {
  fetchNotifications: actions.fetchNotifications,
  fetchDateFormats: actions.fetchDateFormats,
};

export const NotificationsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('previewModal', 'setPreviewModal', null),
  withProps(props => {
    switch (props.type) {
      case 'templates':
        return { type: 'Template', submissions: props.templates };
      case 'snippets':
        return { type: 'Snippet', submissions: props.snippets };
      case 'date-formats':
        return { type: 'Date Format', submissions: props.dateFormats };
      default:
        return { type: 'Template', submissions: props.templates };
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchNotifications();
      this.props.fetchDateFormats();
    },
  }),
)(NotificationsListComponent);
