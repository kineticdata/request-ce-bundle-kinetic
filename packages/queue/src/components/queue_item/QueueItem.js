import React from 'react';
import { compose, lifecycle, withProps } from 'recompose';
import { Link } from '@reach/router';
import { DiscussionsPanel } from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../redux/modules/queue';
import { QueueItemDetailsContainer } from './QueueItemDetails';
import { getFilterByPath } from '../../redux/modules/queueApp';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';
import { PageTitle } from '../shared/PageTitle';

const CreationForm = ({ onChange, values, errors }) => (
  <React.Fragment>
    <div className="form-group">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={values.title}
        onChange={onChange}
      />
      {errors.title && (
        <small className="form-text text-danger">{errors.title}</small>
      )}
    </div>
    <div className="form-group">
      <label htmlFor="title">Description</label>
      <textarea
        id="description"
        name="description"
        value={values.description}
        onChange={onChange}
      />
      {errors.description && (
        <small className="form-text text-danger">{errors.description}</small>
      )}
    </div>
    <div className="form-group">
      <div className="form-check-inline">
        <input
          id="relateOriginatingRequest"
          name="relateOriginatingRequest"
          type="checkbox"
          className="form-check-input"
          checked={values.relateOriginatingRequest}
          onChange={onChange}
        />
        <label htmlFor="relateOriginatingRequest" className="form-check-label">
          Relate Originating Request
        </label>
      </div>
    </div>
  </React.Fragment>
);

export const QueueItem = ({
  filter,
  queueItem,
  discussionsEnabled,
  creationFields,
  onCreated,
  profile,
  isSmallLayout,
}) =>
  queueItem !== null && (
    <div className="page-container page-container--panels">
      <PageTitle
        parts={[
          queueItem ? queueItem.handle : '',
          filter ? filter.name || 'Adhoc' : '',
        ]}
      />
      <div className="page-panel page-panel--three-fifths page-panel--white page-panel--no-padding page-panel--flex">
        {filter && (
          <div className="page-panel__header">
            <Link to="../.." className="nav-return">
              <span className="icon">
                <span className="fa fa-fw fa-chevron-left" />
              </span>
              <I18n>{filter.name || 'Adhoc'}</I18n>
            </Link>
          </div>
        )}
        <div className="page-panel__body">
          <QueueItemDetailsContainer
            filter={filter}
            creationFields={creationFields}
            onCreated={onCreated}
            CreationForm={CreationForm}
          />
        </div>
      </div>
      {discussionsEnabled &&
        !isSmallLayout && (
          <DiscussionsPanel
            itemType="Submission"
            itemKey={queueItem.id}
            creationFields={creationFields}
            onCreated={onCreated}
            CreationForm={CreationForm}
            me={profile}
          />
        )}
    </div>
  );

export const mapStateToProps = (state, props) => ({
  id: props.id,
  filter: getFilterByPath(state, props.location.pathname),
  queueItem: state.queue.currentItem,
  discussionsEnabled: selectDiscussionsEnabled(state),
  profile: state.app.profile,
  isSmallLayout: state.app.layoutSize === 'small',
});

export const mapDispatchToProps = {
  fetchCurrentItem: actions.fetchCurrentItem,
  setCurrentItem: actions.setCurrentItem,
};

export const QueueItemContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(
    props =>
      props.queueItem && {
        creationFields: {
          title: props.queueItem.label || 'Queue Discussion',
          description: props.queueItem.values['Details'] || '',
          owningTeams: [{ name: props.queueItem.values['Assigned Team'] }],
          owningUsers: [
            {
              username:
                props.queueItem.values['Assigned Individual'] ||
                props.profile.username,
            },
          ],
          relateOriginatingRequest: false,
        },
      },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchCurrentItem(this.props.id);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.id !== nextProps.id) {
        this.props.fetchCurrentItem(nextProps.id);
      }
    },
    componentWillUnmount() {
      this.props.setCurrentItem(null);
    },
  }),
)(QueueItem);
