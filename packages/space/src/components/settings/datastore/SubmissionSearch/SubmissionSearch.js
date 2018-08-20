import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { lifecycle, compose, withState } from 'recompose';
import { PageTitle } from 'common';
import {
  ButtonGroup,
  ButtonDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';

import { actions } from '../../../../redux/modules/settingsDatastore';
import { Searchbar } from './Searchbar';
import { SubmissionList } from './SubmissionList';
import { Paging } from './Paging';
import { ExportModal } from '../ExportModal';

const SubmissionSearchComponent = ({
  form,
  loading,
  match,
  openModal,
  optionsOpen,
  setOptionsOpen,
}) => (
  <Fragment>
    {!loading ? (
      <div className="page-container page-container--datastore">
        <PageTitle parts={['Search', form.name, 'Datastore']} />
        <div className="page-panel page-panel--scrollable page-panel--datastore-content">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> /{` `}
                <Link to="/settings">settings</Link> /{` `}
                <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
              </h3>
              <h1>{form.name}</h1>
            </div>
            <div className="page-title__actions ml-3 text-right">
              <Link
                to={`/settings/datastore/${form.slug}/new`}
                className="btn btn-primary"
              >
                New Record
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
                  <button onClick={openModal} className="dropdown-item">
                    Export Records
                  </button>
                  <Link
                    to={`/settings/datastore/${form.slug}/import`}
                    className="dropdown-item"
                  >
                    Import Records
                  </Link>
                  {form.canManage && (
                    <Link
                      to={`/settings/datastore/${form.slug}/settings`}
                      className="dropdown-item"
                    >
                      Configure Form
                    </Link>
                  )}
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </div>
          <Searchbar formSlug={match.params.slug} />
          <Paging />
          <SubmissionList />
        </div>
      </div>
    ) : null}
    <ExportModal />
  </Fragment>
);

export const mapStateToProps = state => ({
  loading: state.space.settingsDatastore.currentFormLoading,
  form: state.space.settingsDatastore.currentForm,
  simpleSearchActive: state.space.settingsDatastore.simpleSearchActive,
  submissions: state.space.settingsDatastore.submissions,
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
  ),
  withState('optionsOpen', 'setOptionsOpen', false),
  lifecycle({
    componentWillMount() {
      this.props.fetchForm(this.props.match.params.slug);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.slug !== nextProps.match.params.slug) {
        this.props.fetchForm(nextProps.match.params.slug);
        this.props.resetSearch();
      }
    },
    componentWillUnmount() {
      this.props.clearForm();
    },
  }),
)(SubmissionSearchComponent);
