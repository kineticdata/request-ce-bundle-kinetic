import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { actions } from '../../../../redux/modules/settingsDatastore';

const SubmissionListItemComponent = ({
  submission,
  columns,
  form,
  handleClone,
  handleDelete,
  openDropdown,
  toggleDropdown,
  path,
}) => {
  return (
    <tr>
      {columns.map((column, index) => {
        const rowData = getSubmissionData(submission, column);
        if (index === 0) {
          return (
            <Fragment key={`tcol-${index}-${submission.id}`}>
              <td className="d-md-none d-table-cell">
                <div className="card">
                  <div className="card-body">
                    <strong className="card-title">{rowData}</strong>
                    <p className="card-text">
                      {columns.map((innerColumn, innerIndex) => {
                        const innerRowData = getSubmissionData(
                          submission,
                          innerColumn,
                        );
                        return (
                          innerIndex !== 0 && (
                            <Fragment key={`tcol-mobile-${innerIndex}`}>
                              <span>
                                <strong>{innerColumn.label}:</strong>{' '}
                                {innerRowData}
                              </span>
                              <br />
                            </Fragment>
                          )
                        );
                      })}
                    </p>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Actions"
                    >
                      <Link
                        to={`${path}/${submission.id}`}
                        className="btn btn-info"
                      >
                        View
                      </Link>
                      <Link
                        to={`${path}/${submission.id}/edit`}
                        className="btn btn-info"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={handleClone(submission.id)}
                        className="btn btn-success"
                      >
                        Clone
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete(submission.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td className="d-none d-md-table-cell">
                <Link to={`${path}/${submission.id}`}>{rowData}</Link>
              </td>
            </Fragment>
          );
        } else {
          return (
            <td
              key={`tcol-${index}-${submission.id}`}
              className="d-none d-md-table-cell"
            >
              {rowData}
            </td>
          );
        }
      })}
      <td className="d-none d-md-table-cell">
        <Dropdown
          toggle={toggleDropdown(submission.id)}
          isOpen={openDropdown === submission.id}
        >
          <DropdownToggle color="link">
            <span className="fa fa-ellipsis-h fa-2x" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag={Link} to={`${path}/${submission.id}`}>
              View
            </DropdownItem>
            <DropdownItem tag={Link} to={`${path}/${submission.id}/edit`}>
              Edit
            </DropdownItem>
            <DropdownItem onClick={handleClone(submission.id)}>
              Clone
            </DropdownItem>
            <DropdownItem onClick={handleDelete(submission.id)}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </td>
    </tr>
  );
};

const getSubmissionData = (submission, column) => {
  if (column.type === 'value') {
    return submission.values[column.name];
  } else {
    return submission[column.name];
  }
};

export const mapStateToProps = state => ({
  loading: state.settingsDatastore.currentFormLoading,
  form: state.settingsDatastore.currentForm,
  columns: state.settingsDatastore.currentForm.columns.filter(c => c.visible === true),
  path: state.router.location.pathname.replace(/\/$/, ''),
});

export const mapDispatchToProps = {
  cloneSubmission: actions.cloneSubmission,
  deleteSubmission: actions.deleteSubmission,
  fetchSubmissions: actions.fetchSubmissions,
};

const handleClone = ({ cloneSubmission }) => id => () => cloneSubmission(id);

const handleDelete = ({ deleteSubmission, fetchSubmissions }) => id => () =>
  deleteSubmission({ id: id, callback: fetchSubmissions });

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

export const SubmissionListItem = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('openDropdown', 'setOpenDropdown', ''),
  withHandlers({
    toggleDropdown,
    handleClone,
    handleDelete,
  }),
)(SubmissionListItemComponent);
