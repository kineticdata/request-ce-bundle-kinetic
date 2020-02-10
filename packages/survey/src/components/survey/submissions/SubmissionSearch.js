import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { actions } from '../../../redux/modules/surveys';
import { context } from '../../../redux/store';
import { PageTitle } from '../../shared/PageTitle';
import { Searchbar } from './Searchbar';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';
import { ExportModal } from '../export/ExportModal';
import { I18n } from '@kineticdata/react';

const SubmissionSearchComponent = ({ form, loading, slug, openModal }) => (
  <I18n context={`datastore.forms.${form.slug}`}>
    {!loading ? (
      <div className="page-container">
        <PageTitle parts={['Search', form.name]} />
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
                <I18n>Export</I18n> <i className="fa fa-fw fa-download" />
              </button>

              {form.canManage && (
                <Link to={`../settings`}>
                  <button className="btn btn-subtle">
                    <I18n>Survey Settings</I18n>{' '}
                    <i className="fa fa-fw fa-gear" />
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
    <ExportModal />
  </I18n>
);

export const mapStateToProps = state => ({
  loading: state.surveys.currentFormLoading,
  form: state.surveys.currentForm,
  simpleSearchActive: state.surveys.simpleSearchActive,
  submissions: state.surveys.submissions,
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
