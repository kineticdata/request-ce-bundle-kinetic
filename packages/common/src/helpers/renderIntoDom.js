import React from 'react';
import ReactDOM from 'react-dom';
import { KineticLib, bundle } from '@kineticdata/react';

export default (content, container) =>
  ReactDOM.render(
    <KineticLib locale={bundle.lang()}>{content}</KineticLib>,
    container,
  );
