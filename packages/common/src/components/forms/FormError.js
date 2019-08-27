import React from 'react';

export const FormError = props => (
  <div className="row">
    <div className="col-12">
      <div className="alert alert-danger alert-dismissible">
        {props.error}
        <button className="close btn-sm" onClick={props.clear} type="button">
          &times;
        </button>
      </div>
    </div>
  </div>
);
