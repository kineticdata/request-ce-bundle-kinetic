import React from 'react';

export const SystemError = ({ status, statusText }) => (
  <div>
    <h1>There was a problem!</h1>
    <h4>{status}</h4>
    <p>{statusText || 'Unknown error has occurred.'}</p>
  </div>
);
