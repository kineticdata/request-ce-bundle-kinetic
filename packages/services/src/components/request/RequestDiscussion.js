import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ViewDiscussionsModal, Discussion } from 'common';

export const RequestDiscussionComponent = ({
  discussion,
  viewDiscussionModal,
  isSmallLayout,
  closeDiscussion,
  me,
}) => (
  <Fragment>
    {viewDiscussionModal && isSmallLayout ? (
      <ViewDiscussionsModal
        close={closeDiscussion}
        discussionId={discussion.id}
        modalBodyClassName="services-submission-discussion"
      />
    ) : (
      <div className="page-panel page-panel--two-fifths page-panel--scrollable page-panel--discussions d-none d-md-flex">
        <Discussion id={discussion.id} />
      </div>
    )}
  </Fragment>
);

export const mapStateToProps = state => ({
  me: state.app.profile,
  isSmallLayout: state.app.layout.get('size') === 'small',
});

export const mapDispatchToProps = {};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
);

export const RequestDiscussion = enhance(RequestDiscussionComponent);
