import React, { Fragment } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from '@kineticdata/react';
import { isImmutable } from 'immutable';
import { ModalButton } from '../ModalButton';

export const isFiltered = value =>
  isImmutable(value) ? !value.filter(v => v).isEmpty() : !!value;

export const generateFilterLayout = filterSet => ({
  filters,
  onSearch,
  onReset,
  columnSet,
  loading,
  initializing,
}) => (
  <form onSubmit={onSearch} onReset={onReset}>
    {filterSet.map(fs => <Fragment key={fs}>{filters.get(fs)}</Fragment>)}
    <button type="submit" className="btn btn-sm btn-primary">
      <I18n>Search</I18n>
    </button>
    <button type="reset" className="btn btn-sm btn-link">
      <I18n>Clear</I18n>
    </button>
  </form>
);

const generateToggleButton = isActive => props => (
  <button
    className={`btn btn-sm btn-${isActive ? 'secondary' : 'subtle'}`}
    {...props}
  >
    <span className="fa fa-filter fa-fw" /> <I18n>Filter</I18n>
  </button>
);

export const generateFilterModalLayout = (filterSet, title = 'Filter') => ({
  filters,
  onSearch,
  onReset,
  onClear,
  onChangeFilter,
  columnSet,
  loading,
  initializing,
  appliedFilters,
}) => {
  const hasAppliedFilters = appliedFilters.some(f =>
    isFiltered(f.get('value')),
  );
  return (
    <span className="btn-group">
      <ModalButton
        components={{ ToggleButton: generateToggleButton(hasAppliedFilters) }}
        onClose={onClear}
      >
        {({ isOpen, toggle, forceToggle }) => (
          <Modal isOpen={isOpen} toggle={toggle} size="md">
            <form
              onSubmit={e => {
                onSearch(e);
                forceToggle();
              }}
              onReset={e => {
                onReset(e);
                forceToggle();
              }}
              className="p-0"
            >
              <div className="modal-header">
                <h4 className="modal-title">
                  <button
                    type="button"
                    className="btn btn-link btn-delete"
                    onClick={toggle}
                  >
                    <I18n>Close</I18n>
                  </button>
                  <span>
                    <I18n>{title}</I18n>
                  </span>
                  <button
                    className="btn btn-link btn-delete"
                    type="reset"
                    disabled={!hasAppliedFilters}
                  >
                    <I18n>Reset</I18n>
                  </button>
                </h4>
              </div>
              <ModalBody className="p-3">
                {filterSet.map(fs => (
                  <Fragment key={fs}>{filters.get(fs)}</Fragment>
                ))}
              </ModalBody>
              <ModalFooter className="modal-footer--full-width">
                <button className={`btn btn-primary`} type="submit">
                  <I18n>Apply</I18n>
                </button>
              </ModalFooter>
            </form>
          </Modal>
        )}
      </ModalButton>
      {hasAppliedFilters && (
        <I18n
          render={translate => (
            <button
              className="btn btn-sm btn-outline-secondary"
              type="reset"
              title={translate('Reset Filters')}
              onClick={onReset}
            >
              <span className="sr-only">Reset Filters</span>
              <span className="fa fa-times" />
            </button>
          )}
        />
      )}
    </span>
  );
};
