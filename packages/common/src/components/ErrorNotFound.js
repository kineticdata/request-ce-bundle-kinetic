import React from 'react';
import { I18n } from '../../../app/src/I18nProvider';

export const ErrorNotFound = () => (
  <div className="text-center">
    <h1>
      <I18n>Oops!</I18n>
    </h1>
    <h2>
      <I18n>Not Found</I18n>
    </h2>
    <p className="error-details">
      <I18n>Sorry, an error has occured, Requested page not found!</I18n>
    </p>
  </div>
);
