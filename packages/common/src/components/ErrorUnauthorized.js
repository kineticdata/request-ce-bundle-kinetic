import React from 'react';
import { I18n } from '../../../app/src/I18nProvider';

export const ErrorUnauthorized = () => (
  <div className="text-center">
    <h1>
      <I18n>Oops!</I18n>
    </h1>
    <h2>
      <I18n>Unauthorized</I18n>
    </h2>
    <p className="error-details">
      <I18n>Sorry, but you don&apos;t have access to this resource!</I18n>
    </p>
  </div>
);
