import React from 'react';
import { Link } from '@reach/router';
import { I18n } from '@kineticdata/react';

export const generateFormButtons = ({
  submitLabel,
  cancelPath,
  handleDelete,
} = {}) => props => (
  <div className="d-flex justify-content-between">
    {handleDelete && (
      <div className="form-buttons">
        <button
          className="btn btn-link text-danger"
          type="button"
          onClick={handleDelete}
        >
          <I18n>Delete</I18n>
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
        <I18n>{submitLabel}</I18n>
      </button>
      {cancelPath ? (
        typeof cancelPath === 'function' ? (
          <button type="button" className="btn btn-link" onClick={cancelPath}>
            <I18n>Cancel</I18n>
          </button>
        ) : (
          <Link className="btn btn-sm btn-link" to={cancelPath}>
            <I18n>Cancel</I18n>
          </Link>
        )
      ) : (
        <button
          type="button"
          className="btn btn-link"
          onClick={props.reset}
          disabled={!props.dirty || props.submitting}
        >
          <I18n>Reset</I18n>
        </button>
      )}
    </div>
  </div>
);

export const FormButtons = generateFormButtons({
  submitLabel: 'Save',
  cancelPath: null,
});
