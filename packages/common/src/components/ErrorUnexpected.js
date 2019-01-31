import React from 'react';
import { I18n } from '../../../app/src/I18nProvider';

export const ErrorUnexpected = () => (
  <div className="text-center">
    <h1>
      <I18n>Oops!</I18n>
    </h1>
    <h2>
      <I18n>Unexpected Error</I18n>
    </h2>
    <p className="error-details">
      <I18n>Sorry, an unexpected error has occurred!</I18n>
    </p>
  </div>
);
