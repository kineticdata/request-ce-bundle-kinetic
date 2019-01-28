import React, { Fragment } from 'react';
import { withState, withHandlers, compose } from 'recompose';
import { I18n } from '../../../../app/src/I18nProvider';
import { CoreForm } from 'react-kinetic-core';
import axios from 'axios';

const globals = import('common/globals');

export const ReviewRequestComponent = ({
  handleLoaded,
  handlePageChange,
  kappSlug,
  submission,
  nextPage,
  previousPage,
}) => {
  return (
    <Fragment>
      <I18n context={`kapps.${kappSlug}.forms.${submission.form.slug}`}>
        <CoreForm
          loaded={handleLoaded}
          submission={submission.id}
          review
          globals={globals}
        />
      </I18n>
      <button onClick={handlePageChange} value={previousPage}>
        Previous
      </button>
      <button onClick={handlePageChange} value={nextPage}>
        Next
      </button>
    </Fragment>
  );
};

export const handleLoaded = props => form => {
  const formPages = form.displayablePages();
  const currentLoc = formPages.findIndex(
    currentPage => currentPage === form.page().name(),
  );

  if (currentLoc > 0) {
    props.setPreviousPage(formPages[currentLoc]);
  } else {
    props.setPreviousPage(null);
  }

  if (currentLoc < formPages.length - 1) {
    props.setNextPage(formPages[currentLoc + 1]);
  } else {
    props.setNextPage(null);
  }
};

const handlePageChange = props => event => {};

const enhance = compose(
  withState('nextPage', 'setNextPage', null),
  withState('previousPage', 'setPreviousPage', null),
  withHandlers({ handleLoaded, handlePageChange }),
);

export const ReviewRequest = enhance(ReviewRequestComponent);
