import React from 'react';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { Link } from '@reach/router';
import { TimeAgo, ViewDiscussionsModal } from 'common';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { selectAssignments } from '../../redux/modules/queueApp';
import { actions, selectPrevAndNext } from '../../redux/modules/queue';
import { ViewOriginalRequest } from './ViewOriginalRequest';
import { AssignmentBadge } from './AssignmentBadge';
import { QueueListItemSmall } from '../queue_list/QueueListItem';
import { AssignmentSelector } from '../shared/AssignmentSelector';
import { StatusContent } from '../shared/StatusContent';
import { WallyButtonContainer } from '../shared/WallyButton';
import { I18n } from '@kineticdata/react';
import { connect } from '../../redux/store';

const nonQueueLink = (queueItem, kappSlug) =>
  queueItem.parent &&
  queueItem.parent.form &&
  queueItem.parent.form.kapp &&
  queueItem.parent.form.kapp.slug !== kappSlug;

const queueLink = (queueItem, kappSlug) =>
  queueItem.parent &&
  queueItem.parent.form &&
  queueItem.parent.form.kapp &&
  queueItem.parent.form.kapp.slug === kappSlug;

export const QueueItemDetails = ({
  queueItem,
  isAssigning,
  toggleAssigning,
  setIsAssigning,
  setAssignment,
  assignments,
  openNewItemMenu,
  viewDiscussionsModal,
  prohibitSubtasks,
  refreshQueueItem,
  openDiscussions,
  closeDiscussions,
  prevAndNext,
  kappSlug,
  discussionsEnabled,
  profile,
  isSmallLayout,
  creationFields,
  onCreated,
  CreationForm,
}) => (
  <div className="queue-item-details">
    {viewDiscussionsModal &&
      isSmallLayout && (
        <ViewDiscussionsModal
          itemType="Submission"
          itemKey={queueItem.id}
          close={closeDiscussions}
          creationFields={creationFields}
          onCreated={onCreated}
          CreationForm={CreationForm}
          me={profile}
        />
      )}
    <div className="">
      <div className="general">
        {discussionsEnabled && (
          <button
            onClick={openDiscussions}
            className="btn btn-inverse btn-discussion d-md-none d-lg-none d-xl-none"
          >
            <span
              className="fa fa-fw fa-comments"
              style={{ fontSize: '16px' }}
            />
            <I18n>
              {queueItem.values['Discussion Id'] === null
                ? 'New Discussion'
                : 'View Discussion'}
            </I18n>
          </button>
        )}
        <div className="submission__meta">
          <StatusContent queueItem={queueItem} prevAndNext={prevAndNext} />
        </div>
        <h4>{queueItem.values.Summary}</h4>
        <ul className="list-group timestamps">
          <li className="list-group-item timestamp">
            <span className="label">
              <I18n
                context={`kapps.${queueItem.form.kapp.slug}.forms.${
                  queueItem.form.slug
                }`}
              >
                {queueItem.form.name}
              </I18n>{' '}
              ({queueItem.handle})
            </span>
          </li>
          <li className="list-group-item timestamp">
            <span className="label">
              <I18n>Due</I18n>
            </span>
            <span className="value">
              <TimeAgo timestamp={queueItem.values['Due Date']} id="due-date" />
            </span>
          </li>
          <li className="list-group-item timestamp">
            <span className="label">
              <I18n>Updated</I18n>
            </span>
            <span className="value">
              <TimeAgo timestamp={queueItem.updatedAt} id="updated-at" />
            </span>
          </li>
          <li className="list-group-item timestamp">
            <span className="label">
              <I18n>Created</I18n>
            </span>
            <span className="value">
              <TimeAgo timestamp={queueItem.createdAt} id="created-at" />
            </span>
          </li>
        </ul>
        <pre>{queueItem.values.Details}</pre>
        <div className="actions">
          {!isAssigning && (
            <AssignmentBadge
              queueItem={queueItem}
              toggle={
                queueItem.coreState === 'Draft' ? toggleAssigning : undefined
              }
              readOnly={queueItem.coreState !== 'Draft'}
            />
          )}
          {isAssigning && (
            <AssignmentSelector
              toggle={setIsAssigning}
              onSelect={setAssignment}
              isAssigning={isAssigning}
              assignments={assignments}
            />
          )}
          <WallyButtonContainer
            className="btn btn-primary wally-button"
            queueItem={queueItem}
            onWorked={refreshQueueItem}
            onGrabbed={refreshQueueItem}
          />
        </div>
        {nonQueueLink(queueItem, kappSlug) && (
          <ViewOriginalRequest queueItem={queueItem} />
        )}
        {queueLink(queueItem, kappSlug) && (
          <Link
            to={`/item/${queueItem.parent.id}`}
            className="btn btn-inverse request-button"
          >
            <I18n>View Parent</I18n>
          </Link>
        )}
      </div>

      {!prohibitSubtasks && (
        <div className="subtasks-section">
          <h2 className="section__title">
            <I18n>Subtasks</I18n>
            {queueItem.coreState === 'Draft' && (
              <button className="btn btn-link" onClick={openNewItemMenu}>
                <span className="fa fa-plus" />
              </button>
            )}
          </h2>
          {queueItem.children.length > 0 && (
            <ul className="list-group submissions">
              {queueItem.children.map(child => (
                <QueueListItemSmall
                  key={child.id}
                  queueItem={child}
                  path={`../${child.id}`}
                />
              ))}
            </ul>
          )}
          {queueItem.children.length < 1 && (
            <div className="empty-subtasks">
              <h5>
                <I18n>No Subtasks to display</I18n>
              </h5>
              <h6>
                <I18n>
                  Subtasks are an easy way to create smaller and/or related
                  tasks to parent task.
                </I18n>
              </h6>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const getAttr = (form, attrName) => {
  const attrConfig =
    form.attributes &&
    form.attributes.find(attribute => attribute.name === attrName);
  return attrConfig && attrConfig.values[0];
};

export const mapStateToProps = (state, props) => {
  const queueItem = state.queue.currentItem;
  return {
    filter: props.filter,
    queueItem,
    assignments: selectAssignments(
      state.queueApp.allTeams,
      queueItem.form,
      queueItem,
    ).toJS(),
    prevAndNext: selectPrevAndNext(state, props.filter),
    kappSlug: state.app.kappSlug,
    discussionsEnabled: selectDiscussionsEnabled(state),
    profile: state.app.profile,
    isSmallLayout: state.app.layoutSize === 'small',
  };
};

export const mapDispatchToProps = {
  updateQueueItem: actions.updateQueueItem,
  setCurrentItem: actions.setCurrentItem,
  openNewItemMenu: actions.openNewItemMenu,
  fetchCurrentItem: actions.fetchCurrentItem,
  setOffset: actions.setOffset,
  fetchList: actions.fetchList,
};

export const QueueItemDetailsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ queueItem }) => {
    const prohibit = getAttr(queueItem.form, 'Prohibit Subtasks');
    const permitted = getAttr(queueItem.form, 'Permitted Subtasks');
    return {
      prohibitSubtasks: ['True', 'Yes'].includes(prohibit),
      permittedSubtasks: permitted && permitted.split(/\s*,\s*/),
    };
  }),
  withState('isAssigning', 'setIsAssigning', false),
  withState('viewDiscussionsModal', 'setViewDiscussionsModal', false),
  withHandlers({
    toggleAssigning: ({ setIsAssigning, isAssigning }) => () =>
      setIsAssigning(!isAssigning),
    setAssignment: ({ queueItem, updateQueueItem, setCurrentItem }) => (
      _v,
      assignment,
    ) => {
      const teamParts = assignment.team.split('::');
      const values = {
        'Assigned Individual': assignment.username,
        'Assigned Individual Display Name': assignment.displayName,
        'Assigned Team': assignment.team,
        'Assigned Team Display Name': teamParts[teamParts.length - 1],
      };

      updateQueueItem({
        id: queueItem.id,
        values,
        onSuccess: setCurrentItem,
      });
    },
    openNewItemMenu: ({
      openNewItemMenu,
      queueItem,
      permittedSubtasks,
    }) => () => {
      openNewItemMenu({
        permittedSubtasks,
        parentId: queueItem.id,
        originId: queueItem.origin ? queueItem.origin.id : queueItem.id,
      });
    },
    refreshQueueItem: ({
      filter,
      fetchList,
      setOffset,
      fetchCurrentItem,
      queueItem,
    }) => () => {
      if (filter && filter !== null) {
        fetchList(filter);
        setOffset(0);
      }
      fetchCurrentItem(queueItem.id);
    },
    openDiscussions: props => () => props.setViewDiscussionsModal(true),
    closeDiscussions: props => () => props.setViewDiscussionsModal(false),
  }),
)(QueueItemDetails);
