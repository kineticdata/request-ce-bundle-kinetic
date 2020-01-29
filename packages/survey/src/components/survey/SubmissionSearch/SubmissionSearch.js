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
import { SurveyModal } from '../SurveyModal';
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
            <div className="page-title__wrapper">
              <h3>
                <Link to="../../">
                  <I18n>survey</I18n>
                </Link>{' '}
                /{` `}
                <I18n>{form.name}</I18n>
                /{` `}
              </h3>
              <h1>
                <I18n>Submissions</I18n>
              </h1>
            </div>
            <div className="page-title__actions button-group">
              <button
                onClick={() => openModal('export')}
                value="export"
                className="btn btn-primary"
              >
                <I18n>Export</I18n>
              </button>

              {form.canManage && (
                <Link to={`../settings`}>
                  <button className="btn btn-subtle">
                    <I18n>Survey Settings</I18n>
                  </button>
                </Link>
              )}
            </div>
          </div>
          <Searchbar formSlug={slug} />
          <Paging />
          <SubmissionList />
        </div>
      </div>
    ) : null}
    <SurveyModal />
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
