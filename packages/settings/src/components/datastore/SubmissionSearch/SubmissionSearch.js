import React from 'react';

import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { lifecycle, compose, withState } from 'recompose';
import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { actions } from '../../../redux/modules/settingsDatastore';
import { context } from '../../../redux/store';
import { PageTitle } from '../../shared/PageTitle';

import { Searchbar } from './Searchbar';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';
import { DatastoreModal } from '../DatastoreModal';
import { I18n } from '@kineticdata/react';

const SubmissionSearchComponent = ({
  form,
  loading,
  slug,
  openModal,
  optionsOpen,
  setOptionsOpen,
}) => (
  <I18n context={`datastore.forms.${form.slug}`}>
    {!loading ? (
      <div className="page-container">
        <PageTitle parts={['Search', form.name, 'Datastore']} />
        <div className="page-panel page-panel--white">
          <div className="page-title">
            <div
              role="navigation"
              aria-label="breadcrumbs"
              className="page-title__breadcrumbs"
            >
              <span className="breadcrumb-item">
                <Link to="/settings">
                  <I18n>settings</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <span className="breadcrumb-item">
                <Link to={`/settings/datastore/`}>
                  <I18n>datastore</I18n>
                </Link>
              </span>{' '}
              <span aria-hidden="true">/ </span>
              <h1>
                <I18n>{form.name}</I18n>
              </h1>
            </div>
            <div className="page-title__actions">
              <Link
                to={`/settings/datastore/${form.slug}/new`}
                className="btn btn-primary"
              >
                <I18n>New Record</I18n>
              </Link>
              <ButtonDropdown
                isOpen={optionsOpen}
                toggle={() => setOptionsOpen(!optionsOpen)}
              >
                <DropdownToggle
                  className="dropdown-toggle hide-caret"
                  color="link"
                >
                  <span className="fa fa-ellipsis-v fa-lg" />
                </DropdownToggle>
                <DropdownMenu>
                  <button
                    onClick={() => openModal('export')}
                    value="export"
                    className="dropdown-item"
                  >
                    <I18n>Export Records</I18n>
                  </button>
                  <button
                    onClick={() => openModal('import')}
                    value="import"
                    className="dropdown-item"
                  >
                    <I18n>Import Records</I18n>
                  </button>
                  {form.canManage && (
                    <Link
                      to={`/settings/datastore/${form.slug}/settings`}
                      className="dropdown-item"
                    >
                      <I18n>Configure Form</I18n>
                    </Link>
                  )}
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>
          <Searchbar formSlug={slug} />
          <Paging />
          <SubmissionList />
        </div>
      </div>
    ) : null}
    <DatastoreModal />
  </I18n>
);

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.currentFormLoading,
  form: state.settingsDatastore.currentForm,
  simpleSearchActive: state.settingsDatastore.simpleSearchActive,
  submissions: state.settingsDatastore.submissions,
});

export const mapDispatchToProps = {
  fetchForm: actions.fetchForm,
  clearForm: actions.clearForm,
  resetSearch: actions.resetSearchParams,
  openModal: actions.openModal,
};

export const SubmissionSearch = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('optionsOpen', 'setOptionsOpen', false),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.slug);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.slug !== nextProps.slug) {
        this.props.fetchForm(nextProps.slug);
        this.props.resetSearch();
      }
    },
    componentWillUnmount() {
      this.props.clearForm();
    },
  }),
)(SubmissionSearchComponent);
