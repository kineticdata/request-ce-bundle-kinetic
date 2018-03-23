import React from 'react';
import SVGInline from 'react-svg-inline';
import wallyHappyImage from '../../images/wally-happy.svg';

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

import { actions } from '../../redux/modules/datastore';

const WallyEmptyMessage = ({ filter }) => {
  return (
    <div className="wally">
      <h5>No Datstore Forms Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>
        Datastore Forms are used for storing reference data that can be used by
        other Kapps.
      </h6>
    </div>
  );
};

const FormListItem = ({ form, openDropdown, toggleDropdown, match }) => (
  <tr>
    <td>
      <Link to={`/datastore/${form.slug}`}>{form.name}</Link>
    </td>
    <td>{form.description}</td>
    <td>
      <Dropdown
        toggle={toggleDropdown(form.slug)}
        isOpen={openDropdown === form.slug}
        className="list-dropdown"
      >
        <DropdownToggle className="btn btn-link">
          <span className="fa fa-ellipsis-h fa-2x" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={Link} to={`${match.path}/${form.slug}/new`}>
            Create
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </td>
  </tr>
);

const FormListComponent = ({
  datastoreForms,
  loading,
  match,
  toggleDropdown,
  openDropdown,
}) => {
  console.log(match);
  return (
    <div className="datastore-container">
      <div className="controls">
        <h3>Forms</h3>
      </div>
      <div className="queue-list-content submissions">
        {loading ? (
          <h3>Loading</h3>
        ) : datastoreForms && datastoreForms.size > 0 ? (
          <table className="table forms-list">
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Description</th>
                <th style={{ width: '48px' }}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {datastoreForms.map(form => (
                <FormListItem
                  key={form.slug}
                  form={form}
                  toggleDropdown={toggleDropdown}
                  openDropdown={openDropdown}
                  match={match}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <WallyEmptyMessage />
        )}
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  loading: state.datastore.loading,
  datastoreForms: state.datastore.forms,
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
