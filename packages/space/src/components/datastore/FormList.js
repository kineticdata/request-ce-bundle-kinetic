import React from 'react';
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

import { TimeAgo } from '../TimeAgo';
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

const Timestamp = ({ slug, label, value }) =>
  value && (
    <li className="list-group-item">
      {label}
      &nbsp;
      <TimeAgo timestamp={value} id={`${slug}-${label}`} />
    </li>
  );

const FormListItem = ({ form }) => {
  const { createdAt, updatedAt, slug, name, description } = form;
  return (
    <li className="submission list-group-item">
      <Link to={`datastore/${slug}`} className="summary-group">
        <h6>
          {name} ({slug})
        </h6>
        <p className="summary">{description}</p>
        <ul className="timestamps list-group">
          <Timestamp label="Updated" value={updatedAt} slug={slug} />
          <Timestamp label="Created" value={createdAt} slug={slug} />
        </ul>
      </Link>
    </li>
  );
};

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
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to={`/datastore/`}>datastore</Link> /{` `}
          </h3>
          <h1>Forms</h1>
        </div>
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
                <tr key={form.slug}>
                  <td>
                    <Link to={`/datastore/${form.slug}`}>{form.name}</Link>
                  </td>
                  <td>{form.description}</td>
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
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
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
