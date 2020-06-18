import React from 'react';
import ReactDOM from 'react-dom';
import { CommonProvider } from 'common';
import { KineticLib, bundle } from '@kineticdata/react';

export default (content, container) =>
  ReactDOM.render(
    <KineticLib locale={bundle.lang()}>
      <CommonProvider>{content}</CommonProvider>
    </KineticLib>,
    container,
  );
