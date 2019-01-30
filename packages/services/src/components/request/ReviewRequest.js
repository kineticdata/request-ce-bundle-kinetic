import React, { Fragment } from 'react';
import { withState, withHandlers, compose, setDisplayName } from 'recompose';
import { I18n } from '../../../../app/src/I18nProvider';
import { CoreForm } from 'react-kinetic-core';

const globals = import('common/globals');

export const ReviewRequestComponent = ({
  handleLoaded,
  handleNextPage,
  handlePreviousPage,
  formLoaded,
  kappSlug,
  submission,
  disabledNextPage,
  disabledPreviousPage,
  reviewPage,
}) => {
  return (
    <Fragment>
      <I18n context={`kapps.${kappSlug}.forms.${submission.form.slug}`}>
        <CoreForm
          loaded={handleLoaded}
          submission={submission.id}
          review={reviewPage}
          globals={globals}
        />
      </I18n>
      {formLoaded && (
        <Fragment>
          <button onClick={handlePreviousPage} disabled={disabledPreviousPage}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={disabledNextPage}>
            Next
          </button>
        </Fragment>
      )}
    </Fragment>
  );
};

export const handleLoaded = props => form => {
  props.setDisplayPages(form.displayablePages());
  props.setCurrentPage(form.page().name());
  props.setFormLoaded(true);

  const currentLoc = form
    .displayablePages()
    .findIndex(currentPage => currentPage === form.page().name());

  if (currentLoc <= 0) {
    props.disablePrevious(true);
  } else {
    props.disablePrevious(false);
  }

  if (currentLoc >= form.displayablePages().length - 1) {
    props.disableNext(true);
  } else {
    props.disableNext(false);
  }
};

const handlePreviousPage = props => event => {
  const currentLoc = props.displayPages.findIndex(
    currentPage => currentPage === props.currentPage,
  );
  props.setReviewPage(props.displayPages[currentLoc - 1]);
  props.setFormLoaded(false);
};

const handleNextPage = props => event => {
  const currentLoc = props.displayPages.findIndex(
    currentPage => currentPage === props.currentPage,
  );
  props.setReviewPage(props.displayPages[currentLoc + 1]);
  props.setFormLoaded(false);
};

const enhance = compose(
  withState('formLoaded', 'setFormLoaded', false),
  withState('displayPages', 'setDisplayPages', null),
  withState('currentPage', 'setCurrentPage', null),
  withState('disabledNextPage', 'disableNext', true),
  withState('disabledPreviousPage', 'disablePrevious', true),
  withState('reviewPage', 'setReviewPage', true),
  withHandlers({ handleLoaded, handlePreviousPage, handleNextPage }),
);

export const ReviewRequest = enhance(ReviewRequestComponent);
