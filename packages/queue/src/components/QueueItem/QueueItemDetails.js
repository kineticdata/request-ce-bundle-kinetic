import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { KappLink as Link } from 'common';
import { actions as discussionActions } from 'react-kinops-discussions';
import { selectAssignments } from '../../redux/modules/queueApp';
import { actions, selectPrevAndNext } from '../../redux/modules/queue';
import { AssignmentSelector } from './AssignmentSelector';
import { ViewOriginalRequest } from './ViewOriginalRequest';
import { AssignmentBadge } from './AssignmentBadge';
import { TimeAgo } from '../TimeAgo';
import { StatusParagraph } from '../StatusParagraph';
import { QueueListItemSmall } from '../queueList/QueueListItem';
import { WallyButtonContainer } from '../WallyButton';

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
  prohibitSubtasks,
  refreshQueueItem,
  openDiscussion,
  createDiscussion,
  prevAndNext,
  kappSlug,
}) => (
  <div className="queue-item-details">
    <div className="scroll-wrapper">
      <div className="general">
        <button
          onClick={
            queueItem.values['Discussion Id'] === null
              ? createDiscussion
              : openDiscussion
          }
          className="btn btn-primary btn-inverse discussion-button icon-wrapper hidden-md-up"
        >
          <span className="icon">
            <span
              className="fa fa-comments"
              style={{ color: '#7e8083', fontSize: '16px' }}
            />
          </span>
          {queueItem.values['Discussion Id'] === null
            ? 'Create Discussion'
            : 'View Discussion'}
        </button>
        <StatusParagraph queueItem={queueItem} prevAndNext={prevAndNext} />
        <h1>
          {queueItem.form.name} ({queueItem.handle})
        </h1>
        <p className="summary">{queueItem.values.Summary}</p>
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
            className="btn btn-primary btn-inverse request-button"
          >
            View Parent
          </Link>
        )}
        <ul className="list-group timestamps">
          <li className="list-group-item timestamp">
            <span className="label">Due</span>
            <span className="value">
              <TimeAgo timestamp={queueItem.values['Due Date']} id="due-date" />
            </span>
          </li>
          <li className="list-group-item timestamp">
            <span className="label">Updated</span>
            <span className="value">
              <TimeAgo timestamp={queueItem.updatedAt} id="updated-at" />
            </span>
          </li>
          <li className="list-group-item timestamp">
            <span className="label">Created</span>
            <span className="value">
              <TimeAgo timestamp={queueItem.createdAt} id="created-at" />
            </span>
          </li>
        </ul>
      </div>

      {!prohibitSubtasks && (
        <div className="subtasks-section">
          <h2>
            <span>Subtasks</span>
            {queueItem.coreState === 'Draft' && (
              <button className="btn btn-link" onClick={openNewItemMenu}>
                <span className="icon">
                  <span className="fa fa-plus" style={{ color: '#7e8083' }} />
                </span>
              </button>
            )}
          </h2>
          {queueItem.children.length > 0 && (
            <ul className="list-group submissions">
              {queueItem.children.map(child => (
                <QueueListItemSmall key={child.id} queueItem={child} />
              ))}
            </ul>
          )}
          {queueItem.children.length < 1 && (
            <div className="empty-subtasks">
              <h5>No Subtasks to display</h5>
              <h6>
                Subtasks are an easy way to create smaller and/or related tasks
                to parent task.
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

export const mapStateToProps = (state, props) => ({
  queueItem: state.queue.currentItem,
  assignments: selectAssignments(state).toJS(),
  prevAndNext: selectPrevAndNext(state, props.filter),
  kappSlug: state.kinops.kappSlug,
});

export const mapDispatchToProps = {
  updateQueueItem: actions.updateQueueItem,
  setCurrentItem: actions.setCurrentItem,
  openNewItemMenu: actions.openNewItemMenu,
  fetchCurrentItem: actions.fetchCurrentItem,
  openModal: discussionActions.openModal,
  createDiscussion: discussionActions.createIssue,
};

export const QueueItemDetailsContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ queueItem }) => {
    const prohibit = getAttr(queueItem.form, 'Prohibit Subtasks');
    const permitted = getAttr(queueItem.form, 'Permitted Subtasks');
    return {
      prohibitSubtasks: ['True', 'Yes'].includes(prohibit),
      permittedSubtasks: permitted && permitted.split(/\s*,\s*/),
    };
  }),
  withState('isAssigning', 'setIsAssigning', false),
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
    refreshQueueItem: props => () => props.fetchCurrentItem(props.queueItem.id),
    openDiscussion: props => () =>
      props.openModal(props.queueItem.values['Discussion Id'], 'discussion'),
    createDiscussion: props => () =>
      props.createDiscussion(
        props.queueItem.label || 'Queue Discussion',
        props.queueItem.values['Details'] || '',
        props.queueItem,
        (issue, submission) => {
          props.setCurrentItem(submission);
          props.openModal(issue.guid, 'discussion');
        },
      ),
  }),
)(QueueItemDetails);
