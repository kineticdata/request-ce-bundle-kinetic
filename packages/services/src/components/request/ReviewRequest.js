import React from 'react';
import { withState, withHandlers, compose } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { CoreForm } from '@kineticdata/react';
import classNames from 'classnames';
import { I18n } from '@kineticdata/react';

const globals = import('common/globals');

export const NavigationControlsComponent = ({
  handleNextPage,
  handlePreviousPage,
  dropdownOpen,
  handleToggle,
  displayPages,
  handlePageChange,
  currentLoc,
}) => (
  <div className="btn-group">
    <button
      type="button"
      className="btn btn-inverse"
      onClick={handlePreviousPage}
      value={currentLoc}
      disabled={currentLoc <= 0}
    >
      <span className="icon">
        <span className="fa fa-fw fa-caret-left" />
      </span>
    </button>
    <div className="navigation-dropdown">
      <Dropdown isOpen={dropdownOpen} toggle={handleToggle}>
        <DropdownToggle caret>{`Page ${currentLoc + 1} `}</DropdownToggle>
        <DropdownMenu>
          {displayPages.map((pageName, idx) => {
            const str = `${idx + 1}. ${pageName}`;
            return (
              <DropdownItem
                key={pageName}
                value={idx}
                onClick={handlePageChange}
              >
                {str.length > 13 ? `${str.slice(0, 13).trim()}...` : str}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
    <button
      type="button"
      className="btn btn-inverse"
      onClick={handleNextPage}
      value={currentLoc}
      disabled={currentLoc >= displayPages.length - 1}
    >
      <span className="icon">
        <span className="fa fa-fw fa-caret-right" />
      </span>
    </button>
  </div>
);

const setState = (props, loc) => {
  props.setReviewPage(props.displayPages[loc]);
  props.setCurrentLoc(loc);
  props.setFormLoaded(false);
};

const handlePreviousPage = props => event => {
  const loc = parseInt(event.currentTarget.value, 10) - 1;
  setState(props, loc);
};

const handleNextPage = props => event => {
  const loc = parseInt(event.currentTarget.value, 10) + 1;
  setState(props, loc);
};

const handlePageChange = props => event => {
  const loc = parseInt(event.currentTarget.value, 10);
  setState(props, loc);
};

const handleToggle = props => () => {
  props.setDropdownOpen(!props.dropdownOpen);
};

const NavigationControls = compose(
  withState('dropdownOpen', 'setDropdownOpen', false),
  withHandlers({
    handlePreviousPage,
    handleNextPage,
    handleToggle,
    handlePageChange,
  }),
)(NavigationControlsComponent);

export const ReviewRequestComponent = ({
  handleLoaded,
  reviewPage,
  kappSlug,
  submission,
  formLoaded,
  displayTop,
  multiPageForm,
  displayPages,
  currentLoc,
  ...restProps
}) => {
  return multiPageForm ? (
    <div className="multi-page--service" role="tabpanel">
      {displayTop && (
        <div className="page-display--top">
          <h3>{displayPages[currentLoc]}</h3>
          <NavigationControls {...{ ...restProps, currentLoc, displayPages }} />
        </div>
      )}
      <div className="form-wrapper--review">
        <div className={classNames({ hidden: !formLoaded })}>
          <I18n context={`kapps.${kappSlug}.forms.${submission.form.slug}`}>
            <CoreForm
              loaded={handleLoaded}
              submission={submission.id}
              review={reviewPage}
              globals={globals}
            />
          </I18n>
        </div>
        <div className={classNames('load-wrapper', { hidden: formLoaded })}>
          <span className="fa fa-spinner fa-spin fa-lg fa-fw" />
        </div>
      </div>
      {formLoaded && (
        <div className="page-display--bottom">
          <NavigationControls {...{ ...restProps, currentLoc, displayPages }} />
        </div>
      )}
    </div>
  ) : (
    <I18n context={`kapps.${kappSlug}.forms.${submission.form.slug}`}>
      <div role="tabpanel">
        {' '}
        <CoreForm
          loaded={handleLoaded}
          submission={submission.id}
          review
          globals={globals}
        />
      </div>
    </I18n>
  );
};

export const handleLoaded = props => form => {
  // if form has already been loaded don't set these states again
  if (!props.displayPages) {
    props.setDisplayPages(form.displayablePages());
    props.setDisplayTop(true);
    if (form.displayablePages().length > 1) {
      props.setMultiPageForm(true);
    }
    const currentLoc = form
      .displayablePages()
      .findIndex(currentPage => currentPage === form.page().name());
    props.setCurrentLoc(currentLoc);
  }

  props.setFormLoaded(true);
};

const enhance = compose(
  withState('formLoaded', 'setFormLoaded', false),
  withState('displayTop', 'setDisplayTop', false),
  withState('displayPages', 'setDisplayPages', null),
  withState('multiPageForm', 'setMultiPageForm', false),
  withState('currentLoc', 'setCurrentLoc', 0),
  withState('reviewPage', 'setReviewPage', true),
  withHandlers({ handleLoaded }),
);

export const ReviewRequest = enhance(ReviewRequestComponent);
