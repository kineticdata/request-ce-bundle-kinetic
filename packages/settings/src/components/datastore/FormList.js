import React from 'react';
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { TimeAgo } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../redux/modules/settingsDatastore';
import { context } from '../../redux/store';
import { PageTitle } from '../shared/PageTitle';
import { I18n } from '@kineticdata/react';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>
        <I18n>No Datastore Forms Found</I18n>
      </h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        <I18n>
          Datastore Forms are used for storing reference data that can be used
          by other Kapps.
        </I18n>
      </h6>
    </div>
  );
};

const Timestamp = ({ slug, label, value }) =>
  value && (
    <span>
      <I18n>{label}</I18n>
      &nbsp;
      <TimeAgo timestamp={value} />
    </span>
  );

const FormListComponent = ({
  datastoreForms,
  loading,
  toggleDropdown,
  openDropdown,
}) => {
  return (
    <div className="page-container page-container--panels page-container--datastore">
      <PageTitle parts={['Datastore Forms']} />
      <div className="page-panel page-panel--two-thirds page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="../">
                <I18n>settings</I18n>
              </Link>{' '}
              /{` `}
            </h3>
            <h1>
              <I18n>Datastore Forms</I18n>
            </h1>
          </div>
          <Link to="new" className="btn btn-primary">
            <I18n>New Datastore Form</I18n>
          </Link>
        </div>

        <div className="forms-list-wrapper">
          {loading ? (
            <h3>
              <I18n>Loading</I18n>
            </h3>
          ) : datastoreForms && datastoreForms.size > 0 ? (
            <table className="table table-sm table-striped table--settings">
              <thead className="header sortable">
                <tr>
                  <th scope="col" width="10%">
                    <I18n>Form Name</I18n>
                  </th>
                  <th scope="col">Slug</th>
                  <th scope="col" width="50%">
                    <I18n>Description</I18n>
                  </th>
                  <th scope="col" width="10%">
                    <I18n>Updated</I18n>
                  </th>
                  <th scope="col" width="10%">
                    <I18n>Created</I18n>
                  </th>
                  <th scope="col" width="48px" className="sort-disabled" />
                </tr>
              </thead>
              <tbody>
                {datastoreForms.map(form => {
                  const canManage = form.canManage;
                  return (
                    <I18n
                      context={`datastore.forms.${form.slug}`}
                      key={form.slug}
                    >
                      <tr>
                        <td>
                          <Link to={form.slug}>
                            <span>
                              <I18n>{form.name}</I18n>
                            </span>
                          </Link>
                        </td>
                        <td>{form.slug}</td>
                        <td>
                          <I18n>{form.description}</I18n>
                        </td>
                        <td>
                          <Timestamp value={form.updatedAt} slug={form.slug} />
                        </td>
                        <td>
                          <Timestamp value={form.createdAt} slug={form.slug} />
                        </td>
                        <td>
                          <Dropdown
                            toggle={toggleDropdown(form.slug)}
                            isOpen={openDropdown === form.slug}
                          >
                            <DropdownToggle color="link" className="btn-sm">
                              <span className="fa fa-ellipsis-h fa-2x" />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem tag={Link} to={form.slug}>
                                <I18n>View</I18n>
                              </DropdownItem>
                              <DropdownItem tag={Link} to={`${form.slug}/new`}>
                                <I18n>New Record</I18n>
                              </DropdownItem>
                              {canManage && (
                                <DropdownItem
                                  tag={Link}
                                  to={`${form.slug}/settings`}
                                >
                                  <I18n>Configure</I18n>
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      </tr>
                    </I18n>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <WallyEmptyMessage />
          )}
        </div>
      </div>
      <div className="page-panel page-panel--one-thirds page-panel--transparent page-panel--sidebar page-panel--datastore-sidebar">
        <h3>
          <I18n>Datastore Forms</I18n>
        </h3>
        {/* TODO: Update tone of copy */}
        <p>
          <I18n>
            Datastore Forms allow administrators to define and build referential
            datasets. These forms can be configured with compound
            (multi-field/property) indexes and unique indexes, which provide
            efficient query support for large datasets.
          </I18n>
        </p>
        <p>
          <I18n>
            Example datasets: Assets, People, Locations, Vendors, or Cities and
            States
          </I18n>
        </p>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.loading,
  datastoreForms: state.settingsDatastore.forms.filter(f => !f.isHidden),
});

export const mapDispatchToProps = {
  push,
  fetchForms: actions.fetchForms,
  resetSearch: actions.resetSearchParams,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const FormList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
  lifecycle({
    componentWillMount() {
      this.props.resetSearch();
    },
  }),
)(FormListComponent);
