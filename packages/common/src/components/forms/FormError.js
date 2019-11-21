import React from 'react';
import { I18n } from '@kineticdata/react';

export const FormError = props => (
  <div className="row">
    <div className="col-12">
      <div className="alert alert-danger alert-dismissible">
        <I18n>{props.error}</I18n>
        <button className="close btn-sm" onClick={props.clear} type="button">
          &times;
        </button>
      </div>
    </div>
  </div>
);
