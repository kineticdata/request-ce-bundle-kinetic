import React from 'react';
import { I18n } from '@kineticdata/react';

export const ErrorNotFound = () => (
  <div className="text-center overflow-auto">
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
