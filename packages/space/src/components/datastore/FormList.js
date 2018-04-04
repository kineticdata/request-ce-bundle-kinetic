import React from 'react';
import wallyHappyImage from '../../assets/images/wally-happy.svg';

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

import { TimeAgo } from '../TimeAgo';
import { actions } from '../../redux/modules/datastore';

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
      <TimeAgo timestamp={value} id={`${slug}-${label}`} />
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
              <Link to={match.path}>datastore</Link> /{` `}
            </h3>
            <h1>Forms</h1>
          </div>
          <Link to={`${match.path}/new`}
            className="btn btn-primary"
            target="blank"
          >
            Create Datastore
          </Link>
        </div>

        <div>
          {loading ? (
            <h3>Loading</h3>
          ) : datastoreForms && datastoreForms.size > 0 ? (
            <table className="table forms-list">
              <thead className="header">
                <tr>
                  <th>Form Name</th>
                  <th>Description</th>
                  <th>Dates</th>
                  <th style={{ width: '48px' }}>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {datastoreForms.map(form => {
                  const canManage = form.canManage;
                  return (
                    <tr key={form.slug}>
                      <td>
                        <Link to={`/datastore/${form.slug}`}>
                          <span>{form.name}</span>
                          <br />
                          <span>
                            <small>({form.slug})</small>
                          </span>
                        </Link>
                      </td>
                      <td>{form.description}</td>
                      <td>
                        <Timestamp
                          label="Updated"
                          value={form.updatedAt}
                          slug={form.slug}
                        />
                        <br />
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
                          <DropdownToggle color="link">
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
  loading: state.datastore.loading,
  datastoreForms: state.datastore.forms,
  manageableForms: state.datastore.manageableForms,
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
  connect(mapStateToProps, mapDispatchToProps),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({ toggleDropdown }),
)(FormListComponent);
