import React from 'react';
import { Link } from 'react-router-dom';

export const generateFormButtons = ({
  submitLabel,
  cancelPath,
  handleDelete,
} = {}) => props => (
  <div className="row">
    <div className="col-12 d-flex justify-content-between">
      {handleDelete && (
        <div className="form-buttons">
          <button
            className="btn btn-link btn-delete"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
      <div className="form-buttons ml-auto">
        <button
          className="btn btn-success"
          type="submit"
          disabled={!props.dirty || props.submitting}
          onClick={props.submit}
        >
          {props.submitting ? (
            <span className="fa fa-circle-o-notch fa-spin fa-fw" />
          ) : (
            <span className="fa fa-check fa-fw" />
          )}
          {submitLabel}
        </button>
        {cancelPath ? (
          typeof cancelPath === 'function' ? (
            <button type="button" className="btn btn-link" onClick={cancelPath}>
              Cancel
            </button>
          ) : (
            <Link className="btn btn-sm btn-link" to={cancelPath}>
              Cancel
            </Link>
          )
        ) : null}
      </div>
    </div>
  </div>
);

export const FormButtons = generateFormButtons({
  submitLabel: 'Save',
  cancelPath: null,
});
