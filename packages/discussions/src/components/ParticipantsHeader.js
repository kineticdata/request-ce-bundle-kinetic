import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { bundle } from 'react-kinetic-core';
import { isPresent } from '../helpers';
import { Avatar } from 'common';
import { types as detailsTypes } from '../redux/modules/discussionsDetails';

const participantComparator = (p1, p2) =>
  p1.user.username.localeCompare(p2.user.username);

export const ParticipantsHeader = ({
  discussion,
  openDetails,
  openInNewTab,
  isFullScreen,
}) =>
  !discussion.participants.isEmpty() && (
    <div className="participants-preview">
      {discussion.participants
        .toList()
        .filter(p => !p.user.unknown)
        .sort(participantComparator)
        .map(p => (
          <div
            key={p.user.username}
            className={isPresent(discussion, p.user.username) ? 'present' : ''}
          >
            <Avatar size={26} username={p.user.username} />
          </div>
        ))}
      <div className="view-all">
        <button
          type="button"
          className="btn btn-icon d-md-inline-flex"
          onClick={openDetails}
        >
          <i className="fa fa-info-circle fa-fw" />
        </button>
        {!isFullScreen && (
          <button
            type="button"
            className="btn btn-icon btn-expand d-sm-none d-md-inline-flex"
            onClick={openInNewTab}
            title="Expand Discussion"
          >
            <i className="fa fa-expand fa-fw" />
          </button>
        )}
      </div>
    </div>
  );

const mapStateToProps = state => ({
  isFullScreen:
    state.router.location.pathname &&
    state.router.location.pathname.startsWith('/discussion'),
});

export const ParticipantsHeaderContainer = compose(
  connect(mapStateToProps),
  withHandlers({
    openInNewTab: props => () =>
      window.open(
        `${bundle.spaceLocation()}/#/discussions/${props.discussion.id}`,
        '_blank',
      ),
    openDetails: props => () =>
      props.dispatch({
        type: detailsTypes.OPEN,
        payload: { id: props.discussion.id },
      }),
  }),
)(ParticipantsHeader);
