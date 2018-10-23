import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps, withState } from 'recompose';
import { NavLink } from 'react-router-dom';
import { PageTitle } from 'common';
import { Modal, ModalBody } from 'reactstrap';
import { NotificationListItem } from './NotificationListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsNotifications';

const WallyNoResultsFoundMessage = ({ type }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Notification {type}s Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Add some {type}s by hitting the new button!</h6>
    </div>
  );
};

const NotificationsListComponent = ({
  submissions,
  type,
  match,
  previewModal,
  setPreviewModal,
}) => (
  <div className="page-container page-container--notifications">
    <PageTitle parts={[`${type}s`, 'Notifications', 'Settings']} />
    <div className="page-panel page-panel--scrollable">
      <div className="page-title">
        <div className="page-title__wrapper">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
          </h3>
          <h1>Notifications</h1>
        </div>
        <Link to={`${match.url}/new`} className="btn btn-primary">
          New {type}
        </Link>
      </div>
      <div className="notifications-tabs">
        <ul className="nav nav-tabs">
          <li role="presentation">
            <NavLink
              to="/settings/notifications/templates"
              activeClassName="active"
            >
              Templates
            </NavLink>
          </li>
          <li role="presentation">
            <NavLink
              to="/settings/notifications/snippets"
              activeClassName="active"
            >
              Snippets
            </NavLink>
          </li>
          <li role="presentation">
            <NavLink
              to="/settings/notifications/date-formats"
              activeClassName="active"
            >
              Date Formats
            </NavLink>
          </li>
        </ul>
      </div>
      {submissions.length > 0 ? (
        <table className="table table-sm table-striped table--settings">
          <thead className="sortable">
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>{type === 'Date Format' ? 'Format' : 'Subject'}</th>
              <th className="sort-disabled" />
            </tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <NotificationListItem
                key={`trow-${s.id}`}
                notification={s}
                path={`${match.url}/${s.id}`}
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
                Close
              </button>
              <span>Template Preview</span>
              <span>&nbsp;</span>
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
    state.space.settingsNotifications.loading ||
    state.space.settingsNotifications.dateFormatsLoading,
  templates: state.space.settingsNotifications.notificationTemplates,
  snippets: state.space.settingsNotifications.notificationSnippets,
  dateFormats: state.space.settingsNotifications.dateFormats,
});

export const mapDispatchToProps = {
  fetchNotifications: actions.fetchNotifications,
  fetchDateFormats: actions.fetchDateFormats,
};

export const NotificationsList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('previewModal', 'setPreviewModal', null),
  withProps(props => {
    switch (props.match.params.type) {
      case 'templates':
        return { type: 'Template', submissions: props.templates };
      case 'snippets':
        return { type: 'Snippet', submissions: props.snippets };
      case 'date-formats':
        return { type: 'Date Format', submissions: props.dateFormats };
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchNotifications();
      this.props.fetchDateFormats();
    },
  }),
)(NotificationsListComponent);
