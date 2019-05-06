import React from 'react';
import { I18n } from '@kineticdata/react';

export const LoadingMessage = ({ heading, text }) => {
  return (
    <div className="loading-state">
      <h4>
        <i className="fa fa-spinner fa-spin fa-lg fa-fw" />
      </h4>
      <h5>
        <I18n>{heading || 'Loading'}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};

export const EmptyMessage = ({ heading, text }) => {
  return (
    <div className="empty-state">
      <h5>
        <I18n>{heading || 'No Results Found'}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};

export const ErrorMessage = ({ heading, text }) => {
  return (
    <div className="error-state">
      <h4>
        <I18n>Oops!</I18n>
      </h4>
      <h5>
        <I18n>{heading || 'Error'}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};

export const InfoMessage = ({ heading, text }) => {
  return (
    <div className="info-state">
      <h5>
        <I18n>{heading}</I18n>
      </h5>
      {text && (
        <h6>
          <I18n>{text}</I18n>
        </h6>
      )}
    </div>
  );
};
