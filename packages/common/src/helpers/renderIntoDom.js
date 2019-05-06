import React from 'react';
import ReactDOM from 'react-dom';
import { KineticLib } from '@kineticdata/react';

// TODO KinetiLib needs to be connected or passed locale
export default (content, container) =>
  ReactDOM.render(<KineticLib>{content}</KineticLib>, container);
