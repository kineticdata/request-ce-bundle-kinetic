import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { TimeAgo } from 'common';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';
import { actions } from '../../../redux/modules/forms';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="empty-state empty-state--wally">
      <h5>No Services Forms Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
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
  loading,
  kapp,
  match,
  toggleDropdown,
  openDropdown,
  currentPage,
  formsPerPage,
  setCurrentPage,
  isSpaceAdmin,
}) => {
  const forms = (kapp && kapp.forms) || [];
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = forms.slice(indexOfFirstForm, indexOfLastForm);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(forms.length / formsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="page-container page-container--datastore">
      <div className="page-panel page-panel--scrollable page-panel--datastore-content">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="/kapps/services">services</Link> /{` `}
              <Link to="/kapps/services/settings">settings</Link> /{` `}
            </h3>
            <h1>Forms</h1>
          </div>
          {isSpaceAdmin && (
            <Link to={`${match.path}/new`} className="btn btn-primary">
              New Form
            </Link>
          )}
        </div>

        <div className="forms-list-wrapper">
          {loading ? (
            <h3>Loading</h3>
          ) : forms && forms.length > 0 ? (
            <div>
              <table className="table table-sm table-striped settings-table">
                <thead className="header">
                  <tr>
                    <th>Form Name</th>
                    <th width="30%">Description</th>
                    <th width="10%">Type</th>
                    <th width="10%">Updated</th>
                    <th width="10%">Created</th>
                    <th width="10%">Status</th>
                    <th width="48px">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {currentForms.map(form => {
                    return (
                      <tr key={form.slug}>
                        <td>
                          <Link to={`${match.path}/${form.slug}`}>
                            <span>{form.name}</span>
                          </Link>
                          <br />
                          <small>{form.slug}</small>
                        </td>
                        <td>{form.description}</td>
                        <td>{form.type}</td>
                        <td>
                          <Timestamp
                            value={form.updatedAt ? form.updatedAt : null}
                            slug={form.slug}
                          />
                        </td>
                        <td>
                          <Timestamp
                            value={form.createdAt ? form.createdAt : null}
                            slug={form.slug}
                          />
                        </td>
                        <td>{form.status}</td>
                        <td>
                          {form.canManage && (
                            <Dropdown
                              toggle={toggleDropdown(form.slug)}
                              isOpen={openDropdown === form.slug}
                            >
                              <DropdownToggle color="link" className="btn-sm">
                                <span className="fa fa-ellipsis-h fa-2x" />
                              </DropdownToggle>
                              <DropdownMenu right>
                                <DropdownItem
                                  tag={Link}
                                  to={`${match.path}/${form.slug}/settings`}
                                >
                                  Configure Form
                                </DropdownItem>
                                <DropdownItem
                                  tag={Link}
                                  to={`${match.path}/clone/${form.slug}/`}
                                >
                                  Clone Form
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className="page-item disabled">
                    <a className="page-link" aria-label="Previous">
                      <span className="icon">
                        <span
                          className="fa fa-fw fa-caret-left"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  {pageNumbers.map(number => (
                    <li
                      key={number}
                      id={number}
                      onClick={() => setCurrentPage(number)}
                      className={
                        currentPage === number
                          ? 'page-item active'
                          : 'page-item'
                      }
                    >
                      <a className="page-link">{number}</a>
                    </li>
                  ))}
                  <li className="page-item disabled">
                    <a className="page-link" aria-label="next">
                      <span className="icon">
                        <span
                          className="fa fa-fw fa-caret-right"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          ) : (
            <WallyEmptyMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.services.servicesSettings.loading,
  kapp: state.services.servicesSettings.servicesSettingsKapp,
  formsPerPage: 10,
  isSpaceAdmin: state.app.profile.spaceAdmin,
});

export const mapDispatchToProps = {
  push,
  fetchForms: actions.fetchForms,
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
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withState('currentPage', 'setCurrentPage', 1),
  withHandlers({ toggleDropdown }),
)(FormListComponent);
