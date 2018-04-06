import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { TimeAgo } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/settingsDatastore';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="wally-empty-state">
      <h5>No Datastore Forms Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        Datastore Forms are used for storing reference data that can be used by
        other Kapps.
      </h6>
    </div>
  );
};

const Timestamp = ({ slug, label, value }) =>
  value && (
    <span>
      {label}
      &nbsp;
      <TimeAgo timestamp={value} />
    </span>
  );

const FormListComponent = ({
  datastoreForms,
  loading,
  match,
  toggleDropdown,
  openDropdown,
  manageableForms,
}) => {
  return (
    <div className="datastore-container">
      <div className="datastore-content pane">
        <div className="page-title-wrapper">
          <div className="page-title">
            <h3>
              <Link to="/">home</Link> /{` `}
              <Link to="/settings">settings</Link> /{` `}
            </h3>
            <h1>Datastore Forms</h1>
          </div>
          <Link to={`${match.path}/new`} className="btn btn-primary">
            Create Datastore
          </Link>
        </div>

        <div className="forms-list-wrapper">
          {loading ? (
            <h3>Loading</h3>
          ) : datastoreForms && datastoreForms.size > 0 ? (
            <table className="table table-sm forms-list">
              <thead className="header">
                <tr>
                  <th>Form Name</th>
                  <th>Form Slug</th>
                  <th>Description</th>
                  <th>Updated</th>
                  <th>Created</th>
                  <th width="48px">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {datastoreForms.map(form => {
                  const canManage = form.canManage;
                  return (
                    <tr key={form.slug}>
                      <td>
                        <Link to={`${match.path}/${form.slug}`}>
                          <span>{form.name}</span>
                        </Link>
                      </td>
                      <td>{form.slug}</td>
                      <td>{form.description}</td>
                      <td>
                        <Timestamp value={form.updatedAt} slug={form.slug} />
                      </td>
                      <td>
                        <Timestamp
                          label="Created"
                          value={form.createdAt}
                          slug={form.slug}
                        />
                      </td>
                      <td>
                        <Dropdown
                          toggle={toggleDropdown(form.slug)}
                          isOpen={openDropdown === form.slug}
                        >
                          <DropdownToggle color="btn-link btn-sm">
                            <span className="fa fa-ellipsis-h fa-2x" />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem
                              tag={Link}
                              to={`${match.path}/${form.slug}/new`}
                            >
                              Create Submission
                            </DropdownItem>
                            {canManage && (
                              <DropdownItem
                                tag={Link}
                                to={`${match.path}/${form.slug}/settings`}
                              >
                                Configure Form
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <WallyEmptyMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.loading,
  datastoreForms: state.settingsDatastore.forms,
  manageableForms: state.settingsDatastore.manageableForms,
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
  connect(mapStateToProps, mapDispatchToProps),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
  lifecycle({
    componentWillMount() {
      this.props.resetSearch();
    },
  }),
)(FormListComponent);
